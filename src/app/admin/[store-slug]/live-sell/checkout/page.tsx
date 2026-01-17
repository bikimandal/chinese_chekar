"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import { Printer, CheckCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import Loader from "@/components/Loader";
import InvoicePDF from "@/components/InvoicePDF";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-3 sm:px-4 pt-6 sm:pt-8 pb-3 sm:pb-4 max-w-2xl flex-1">
        {/* Header */}
        <div className="mb-4 sm:mb-6 no-print">
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Checkout
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  Review your order and confirm sale
                </p>
              </div>
            </div>
            <BackButton href={liveSellPath} label="Back to Cart" />
          </div>
        </div>

        {!sale ? (
          <>
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-4 sm:p-6 mb-4">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                Order Summary
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => {
                  const displayName = item.plateType
                    ? `${item.itemName} (${
                        item.plateType === "half" ? "Half plate" : "Full plate"
                      })`
                    : item.itemName;
                  return (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-700/50 last:border-0"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p
                          className="text-base sm:text-lg md:text-xl font-medium text-white mb-1"
                          style={{ fontFamily: "var(--font-body), sans-serif" }}
                        >
                          {displayName}
                        </p>
                        <p className="text-sm sm:text-base text-slate-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-400 whitespace-nowrap">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50 flex items-center justify-between">
                <span
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Total
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Process Sale Button */}
            <button
              onClick={createSale}
              disabled={isProcessing || cart.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 text-sm sm:text-base cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Confirm Sale</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Invoice Display */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl p-2 sm:p-4 print:p-0 print:shadow-none flex justify-center">
              <InvoicePDF sale={sale} storeInfo={storeInfo || undefined} />
            </div>

            {/* Print Button */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 text-sm sm:text-base cursor-pointer"
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                Print Invoice
              </button>
              <Link
                href={liveSellPath}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-slate-700/50 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                New Sale
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
