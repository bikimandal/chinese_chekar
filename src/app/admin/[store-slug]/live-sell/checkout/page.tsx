"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import { Printer, CheckCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import Loader from "@/components/Loader";
import { footerConfig } from "@/config/footer";

interface CartItem {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  stock: number;
  plateType?: "half" | "full" | null;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  saleDate: string;
  items: Array<{
    itemName: string;
    plateType?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

interface StoreInfo {
  invoiceName?: string | null;
  invoiceAddress?: string | null;
  invoicePhone?: string | null;
  name?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sale, setSale] = useState<Sale | null>(null);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkSession();
    // Load cart from sessionStorage
    const savedCart = sessionStorage.getItem("checkoutCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      const storeSlug = currentStore?.slug || "";
      router.push(storeSlug ? `/admin/${storeSlug}/live-sell` : "/admin/live-sell");
    }
    
    // Fetch store info for invoice
    if (currentStore?.id) {
      fetchStoreInfo();
    }
  }, [router, currentStore]);

  const fetchStoreInfo = async () => {
    if (!currentStore?.id) return;
    
    try {
      const response = await fetch(`/api/stores/${currentStore.id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStoreInfo({
          invoiceName: data.invoiceName,
          invoiceAddress: data.invoiceAddress,
          invoicePhone: data.invoicePhone,
          name: data.name,
        });
      }
    } catch (error) {
      console.error("Error fetching store info:", error);
    }
  };

  const checkSession = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (data.user) {
        setIsAuthenticated(true);
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error checking session:", error);
      window.location.href = "/login";
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const createSale = async () => {
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const saleItems = cart.map((item) => {
        const displayName = item.plateType
          ? `${item.itemName} (${
              item.plateType === "half" ? "Half plate" : "Full plate"
            })`
          : item.itemName;
        return {
          itemId: item.itemId,
          itemName: displayName,
          plateType: item.plateType || null,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        };
      });

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: saleItems }),
      });

      if (response.ok) {
        const saleData = await response.json();
        setSale(saleData);
        // Clear cart from sessionStorage
        sessionStorage.removeItem("checkoutCart");
        // Refresh items in Live Sell page (if it's open in another tab)
        window.dispatchEvent(new Event("saleCompleted"));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      setError("An error occurred while processing the sale");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const storeSlug = currentStore?.slug || "";
  const liveSellPath = storeSlug ? `/admin/${storeSlug}/live-sell` : "/admin/live-sell";

  if (cart.length === 0 && !sale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No items in cart</p>
          <Link
            href={liveSellPath}
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300"
          >
            Go Back to Live Sell
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalAmount();

  // Get store info for receipt
  const invoiceName = storeInfo?.invoiceName || storeInfo?.name || footerConfig.brand.name;
  const invoiceAddress = storeInfo?.invoiceAddress || footerConfig.contact.address;
  const invoicePhone = storeInfo?.invoicePhone || footerConfig.contact.phone;

  // Receipt component for 58mm thermal printer - full names, no truncation, enlarged for print
  const ReceiptContent = ({ isPreview = false }: { isPreview?: boolean }) => {
    const currentDate = sale 
      ? new Date(sale.saleDate)
      : new Date();
    
    const items = sale ? sale.items : cart.map((item) => {
      const displayName = item.plateType
        ? `${item.itemName} (${
            item.plateType === "half" ? "Half plate" : "Full plate"
          })`
        : item.itemName;
      return {
        itemName: displayName,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      };
    });

    const total = sale ? sale.totalAmount : totalAmount;

    // Enlarged for print readability: store 15px, items 11px, small 10px, total 14px
    const base = 13;
    const small = 10;
    const itemsFont = 11;
    const totalFont = 14;
    const storeFont = 15;
    const paddingMm = "5mm 4mm";

    return (
      <div 
        className="receipt-container bg-white text-black mx-auto receipt-print-source"
        style={{
          width: "58mm",
          maxWidth: "58mm",
          minWidth: "58mm",
          fontFamily: "'Courier New', 'Courier', monospace",
          fontSize: `${itemsFont}px`,
          lineHeight: "1.45",
          padding: paddingMm,
          boxSizing: "border-box",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {/* Store Header - full name, no truncation */}
        <div className="text-center mb-2 receipt-store-header" style={{ marginBottom: "6px" }}>
          <div 
            className="font-bold uppercase receipt-store-name"
            style={{ 
              fontSize: `${storeFont}px`,
              fontWeight: "bold",
              marginBottom: "4px",
              letterSpacing: "0.5px",
              lineHeight: "1.3",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {invoiceName}
          </div>
          <div 
            className="receipt-address"
            style={{ 
              fontSize: `${small}px`,
              lineHeight: "1.35",
              marginBottom: "2px",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {invoiceAddress}
          </div>
          <div 
            className="receipt-phone"
            style={{ fontSize: `${small}px` }}
          >
            Ph: {invoicePhone}
          </div>
        </div>

        <div 
          className="divider"
          style={{
            borderTop: "1px dashed #000",
            margin: "6px 0",
          }}
        />

        {sale && (
          <>
            <div 
              className="text-center font-bold uppercase mb-2"
              style={{
                fontSize: `${base}px`,
                fontWeight: "bold",
                marginBottom: "6px",
                letterSpacing: "0.5px",
              }}
            >
              INVOICE
            </div>
            <div 
              className="mb-1"
              style={{ fontSize: `${small}px`, marginBottom: "3px" }}
            >
              Invoice #: {sale.invoiceNumber}
            </div>
            <div 
              className="mb-2"
              style={{ fontSize: `${small}px`, marginBottom: "6px" }}
            >
              Date: {currentDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} {currentDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            <div 
              className="divider"
              style={{
                borderTop: "1px dashed #000",
                margin: "6px 0",
              }}
            />
          </>
        )}

        <div 
          className="flex justify-between font-bold mb-1 receipt-items-header"
          style={{
            fontSize: `${small}px`,
            fontWeight: "bold",
            marginBottom: "4px",
            borderBottom: "1px solid #000",
            paddingBottom: "2px",
          }}
        >
          <span style={{ width: "45%" }}>Item</span>
          <span style={{ width: "15%", textAlign: "right" }}>Qty</span>
          <span style={{ width: "40%", textAlign: "right" }}>Amount</span>
        </div>

        {/* Items - full item names, wrap; no truncation */}
        <div className="items-list receipt-items-list" style={{ marginBottom: "6px" }}>
          {items.map((item, index) => (
            <div 
              key={index}
              className="item-row mb-1 receipt-item-row"
              style={{ 
                marginBottom: "6px",
                fontSize: `${itemsFont}px`,
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <div 
                className="receipt-item-name"
                style={{ 
                  marginBottom: "2px",
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "clip",
                }}
              >
                {item.itemName}
              </div>
              <div 
                className="flex justify-between receipt-item-details"
                style={{ fontSize: `${small}px` }}
              >
                <span style={{ marginLeft: "0" }}>
                  ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                </span>
                <span style={{ fontWeight: "bold" }}>
                  ₹{item.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="divider"
          style={{
            borderTop: "1px dashed #000",
            margin: "6px 0",
          }}
        />

        <div 
          className="flex justify-between font-bold receipt-total"
          style={{
            fontSize: `${totalFont}px`,
            fontWeight: "bold",
            marginTop: "4px",
            paddingTop: "4px",
            borderTop: "2px solid #000",
          }}
        >
          <span>TOTAL</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {sale && (
          <>
            <div 
              className="divider"
              style={{
                borderTop: "1px dashed #000",
                margin: "8px 0 6px 0",
              }}
            />
            <div 
              className="text-center receipt-footer"
              style={{
                fontSize: `${small}px`,
                marginTop: "6px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                Thank you for your visit!
              </div>
              <div style={{ fontSize: `${small - 1}px` }}>
                Visit us again soon
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Print: exact 58mm, enlarged text, full names (no truncation) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: 58mm auto;
            margin: 0;
            padding: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 58mm !important;
            min-width: 58mm !important;
            max-width: 58mm !important;
            height: auto !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-container,
          .receipt-print-source {
            width: 58mm !important;
            max-width: 58mm !important;
            min-width: 58mm !important;
            margin: 0 auto !important;
            padding: 5mm 4mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            background: white !important;
            page-break-after: avoid;
            page-break-inside: avoid;
            overflow: visible !important;
          }
          /* Enlarged text for print readability */
          .receipt-print-source { font-size: 11px !important; line-height: 1.45 !important; }
          .receipt-store-name { font-size: 15px !important; }
          .receipt-address, .receipt-phone, .receipt-items-header, .receipt-item-details, .receipt-footer { font-size: 10px !important; }
          .receipt-item-name, .receipt-item-row { font-size: 11px !important; }
          .receipt-total { font-size: 14px !important; }
          /* Full names in print - no ellipsis, wrap */
          .receipt-store-name, .receipt-address, .receipt-item-name {
            overflow: visible !important;
            text-overflow: clip !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }
          .receipt-container * { overflow: visible !important; }
          .receipt-print-wrapper { width: 58mm !important; max-width: 58mm !important; margin: 0 auto !important; }
          [class*="bg-"]:not(.receipt-container):not(.receipt-print-source) { background: transparent !important; box-shadow: none !important; }
        }
      `}} />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col print:bg-white print:min-h-0 print:h-auto">
        <div className="container mx-auto px-4 pt-6 pb-4 max-w-4xl flex-1 print:p-0 print:max-w-none print:w-auto print:h-auto">
          {/* Header */}
          <div className="mb-6 no-print">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1
                    className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent truncate"
                    style={{ fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {sale ? "Receipt" : "Checkout"}
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    {sale ? "Sale completed successfully" : "Review your order and confirm sale"}
                  </p>
                </div>
              </div>
              {!sale && <BackButton href={liveSellPath} label="Back to Cart" />}
            </div>
          </div>

          {/* Receipt Preview/Display - print: exact 58mm wrapper */}
          <div className="flex justify-center mb-6 print:mb-0 print:block print:bg-transparent print:p-0 receipt-print-wrapper">
            <div className="bg-white rounded-lg shadow-2xl p-4 print:p-0 print:shadow-none print:rounded-none print:bg-transparent print:w-[58mm] print:max-w-[58mm] print:box-border">
              <ReceiptContent isPreview={!sale} />
            </div>
          </div>

          {!sale ? (
            <>
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center max-w-md mx-auto no-print">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto no-print">
                <button
                  onClick={createSale}
                  disabled={isProcessing || cart.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Sale</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Print & New Sale - minimal, no popups */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto no-print">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 cursor-pointer"
                >
                  <Printer className="w-5 h-5" />
                  Print Receipt
                </button>
                <Link
                  href={liveSellPath}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-700/50 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-xl transition-all duration-300"
                >
                  New Sale
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
