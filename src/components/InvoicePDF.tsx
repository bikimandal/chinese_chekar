"use client";

import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { footerConfig } from "@/config/footer";

interface Sale {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  saleDate: string;
  items: Array<{
    itemName: string;
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

interface InvoicePDFProps {
  sale: Sale;
  storeInfo?: StoreInfo;
  autoPrint?: boolean;
}

export default function InvoicePDF({ sale, storeInfo, autoPrint = false }: InvoicePDFProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Use store-specific invoice info if available, otherwise fall back to footer config
  const invoiceName = storeInfo?.invoiceName || storeInfo?.name || footerConfig.brand.name;
  const invoiceAddress = storeInfo?.invoiceAddress || footerConfig.contact.address;
  const invoicePhone = storeInfo?.invoicePhone || footerConfig.contact.phone;

  useEffect(() => {
    if (autoPrint && invoiceRef.current) {
      // Auto-print after a short delay to ensure rendering
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [autoPrint]);

  const generatePDF = () => {
    if (!invoiceRef.current) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200], // Small format for thermal printer (80mm width)
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 5;
    let yPos = margin;

    // Restaurant Name
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(invoiceName.toUpperCase(), pageWidth / 2, yPos, { align: "center" });
    yPos += 6;

    // Address
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    const addressLines = pdf.splitTextToSize(invoiceAddress, pageWidth - margin * 2);
    addressLines.forEach((line: string) => {
      pdf.text(line, pageWidth / 2, yPos, { align: "center" });
      yPos += 4;
    });
    yPos += 2;
    pdf.text(`Phone: ${invoicePhone}`, pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 6;

    // Divider
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    // Invoice Details
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Invoice #: ${sale.invoiceNumber}`, margin, yPos);
    yPos += 4;

    const saleDate = new Date(sale.saleDate);
    const dateStr = saleDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr = saleDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    pdf.text(`Date: ${dateStr} ${timeStr}`, margin, yPos);
    yPos += 5;

    // Divider
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    // Items Header
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("Item", margin, yPos);
    pdf.text("Qty", pageWidth - margin - 30, yPos, { align: "right" });
    pdf.text("Amount", pageWidth - margin, yPos, { align: "right" });
    yPos += 4;

    // Divider
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    // Items
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    sale.items.forEach((item) => {
      // Item name (may wrap)
      const itemNameLines = pdf.splitTextToSize(item.itemName, pageWidth - margin - 35);
      pdf.text(itemNameLines[0], margin, yPos);
      yPos += 3;

      // Price per unit and quantity
      pdf.setFont("helvetica", "normal");
      pdf.text(`₹${item.unitPrice.toFixed(2)} × ${item.quantity}`, margin + 2, yPos);
      pdf.setFont("helvetica", "bold");
      pdf.text(`₹${item.totalPrice.toFixed(2)}`, pageWidth - margin, yPos, {
        align: "right",
      });
      yPos += 4;

      // Handle wrapping for long item names
      if (itemNameLines.length > 1) {
        for (let i = 1; i < itemNameLines.length; i++) {
          pdf.text(itemNameLines[i], margin + 2, yPos);
          yPos += 3;
        }
      }
    });

    yPos += 2;

    // Divider
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    // Total
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL", margin, yPos);
    pdf.text(`₹${sale.totalAmount.toFixed(2)}`, pageWidth - margin, yPos, {
      align: "right",
    });
    yPos += 6;

    // Footer
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    pdf.text("Thank you for your visit!", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 4;
    pdf.text("Visit us again soon", pageWidth / 2, yPos, { align: "center" });

    // Generate filename: invoice number-date-time.pdf
    const filenameDateStr = saleDate.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const filenameTimeStr = saleDate.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
    const filename = `${sale.invoiceNumber}-${filenameDateStr}-${filenameTimeStr}.pdf`;
    
    // Save PDF
    pdf.save(filename);
  };

  const saleDate = new Date(sale.saleDate);

  return (
    <div className="print:bg-white print:text-black">
      {/* Printable Invoice */}
      <div
        ref={invoiceRef}
        className="bg-white text-black p-3 sm:p-4 print:p-2 mx-auto"
        style={{ 
          width: "80mm", 
          maxWidth: "100%",
          minWidth: "280px" // Minimum width for mobile
        }}
      >
        {/* Restaurant Header */}
        <div className="text-center mb-4 print:mb-3">
          <h1 className="text-lg sm:text-xl font-bold mb-1 print:text-base">
            {invoiceName.toUpperCase()}
          </h1>
          <p className="text-xs print:text-[10px] text-gray-600">
            {invoiceAddress}
          </p>
          <p className="text-xs print:text-[10px] text-gray-600">
            Phone: {invoicePhone}
          </p>
        </div>

        <div className="border-t border-b border-gray-300 py-2 my-3 print:my-2">
          <h2 className="text-center text-sm sm:text-base font-bold print:text-sm mb-2">
            INVOICE
          </h2>
          <div className="text-xs print:text-[10px] space-y-1">
            <p>
              <span className="font-semibold">Invoice #:</span> {sale.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {saleDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {saleDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-3 print:mb-2">
          <div className="grid grid-cols-12 gap-1 text-xs print:text-[10px] font-semibold pb-1 border-b border-gray-300 mb-2">
            <div className="col-span-6">Item</div>
            <div className="col-span-3 text-right">Qty</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>
          <div className="space-y-2 print:space-y-1">
            {sale.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-1 text-xs print:text-[10px]">
                <div className="col-span-6">
                  <p className="font-medium">{item.itemName}</p>
                  <p className="text-[10px] print:text-[9px] text-gray-600">
                    ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="col-span-3 text-right">{item.quantity}</div>
                <div className="col-span-3 text-right font-semibold">
                  ₹{item.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-300 pt-2 mt-3 print:mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-bold print:text-sm">TOTAL</span>
            <span className="text-sm sm:text-base font-bold print:text-sm">
              ₹{sale.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 print:mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs print:text-[10px] font-semibold">
            Thank you for your visit!
          </p>
          <p className="text-xs print:text-[10px] text-gray-600 mt-1">
            Visit us again soon
          </p>
        </div>
      </div>

      {/* Download PDF Button (hidden in print) */}
      <div className="mt-4 text-center no-print">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

