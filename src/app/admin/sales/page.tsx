"use client";

import { useState, useEffect } from "react";
import { Receipt, Calendar, Download, Filter, Search } from "lucide-react";
import Link from "next/link";
import BackButton from "../components/BackButton";
import Loader from "@/components/Loader";
import jsPDF from "jspdf";
import SalesListSkeleton from "@/components/skeletons/SalesListSkeleton";
import SalesSummarySkeleton from "@/components/skeletons/SalesSummarySkeleton";
import Pagination from "@/components/Pagination";
import { footerConfig } from "@/config/footer";

interface SaleItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  plateType?: string | null;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  saleDate: string;
  items: SaleItem[];
}

export default function SalesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [tempDate, setTempDate] = useState<string>(""); // Temporary date for calendar selection
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    checkSession();
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setTempDate(today);
  }, []);

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
        // Fetch sales with today's date as default
        const today = new Date().toISOString().split("T")[0];
        setCurrentPage(1); // Reset to first page
        fetchSales(today, 1);
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

  const fetchSales = async (
    date?: string,
    page: number = 1,
    updateTotals: boolean = true
  ) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const limit = itemsPerPage;

      let url = `/api/sales?limit=${limit}&offset=${offset}`;
      if (date) {
        url += `&date=${date}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch sales:", response.status);
        setSales([]);
        if (updateTotals) {
          setTotalItems(0);
          setTotalRevenue(0);
        }
        return;
      }

      const data = await response.json();
      if (data.sales && Array.isArray(data.sales)) {
        setSales(data.sales);
        // Only update totals when explicitly requested (e.g., date filter changes)
        if (updateTotals) {
          // API returns total count - must use data.total, not sales.length
          // sales.length is only the current page items (max 10)
          setTotalItems(data.total || 0);
          // API returns total revenue across all pages
          setTotalRevenue(data.totalRevenue || 0);
        }
      } else {
        setSales([]);
        if (updateTotals) {
          setTotalItems(0);
          setTotalRevenue(0);
        }
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
      if (updateTotals) {
        setTotalItems(0);
        setTotalRevenue(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle date input change - only update temp state, don't call API
  const handleDateInputChange = (date: string) => {
    setTempDate(date);
  };

  // Check if search button should be enabled (when tempDate differs from selectedDate)
  const isSearchEnabled = tempDate && tempDate !== selectedDate;

  // Handle search button click - commit the date and fetch sales
  const handleSearch = () => {
    setSelectedDate(tempDate);
    setCurrentPage(1); // Reset to first page on new search
    fetchSales(tempDate || undefined, 1);
  };

  // Handle when user presses Enter in date input
  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setTempDate(today);
    setCurrentPage(1); // Reset to first page
    fetchSales(today, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Don't update totals when paginating - only fetch the sales list
    fetchSales(selectedDate || undefined, page, false);
    // Scroll to top of sales list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateSalesReportPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Fetch ALL sales data for the selected date (no pagination)
      let url = `/api/sales?limit=10000&offset=0`; // Large limit to get all records
      if (selectedDate) {
        url += `&date=${selectedDate}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }

      const data = await response.json();
      const allSales: Sale[] = data.sales && Array.isArray(data.sales) ? data.sales : [];

      if (allSales.length === 0) {
        alert("No sales data to generate report");
        setIsGeneratingPDF(false);
        return;
      }

      // Calculate totals from all sales
      const totalSales = allSales.length;
      const totalRevenue = allSales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );
      const totalItems = allSales.reduce(
        (sum, sale) => sum + sale.items.length,
        0
      );
      const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Disable automatic page numbering
      pdf.setProperties({
        title: `Sales Report - ${footerConfig.brand.name}`,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = margin;

      // Header
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(footerConfig.brand.name.toUpperCase(), pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 6;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const addressLines = pdf.splitTextToSize(
        footerConfig.contact.address,
        pageWidth - margin * 2
      );
      addressLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPos, { align: "center" });
        yPos += 4;
      });
      yPos += 2;
      pdf.text(`Phone: ${footerConfig.contact.phone}`, pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 6;

      // Divider
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("SALES REPORT", pageWidth / 2, yPos, { align: "center" });
      yPos += 8;

      // Date Information - More prominent
      const reportDate = selectedDate
        ? new Date(selectedDate + "T00:00:00")
        : null;

      if (selectedDate && reportDate) {
        const dateStr = reportDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const dayName = reportDate.toLocaleDateString("en-IN", {
          weekday: "long",
        });

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Report Date:", margin, yPos);
        yPos += 5;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${dayName}, ${dateStr}`, margin, yPos);
        yPos += 6;
      } else {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Report Period: All Time", margin, yPos);
        yPos += 6;
      }

      // Report Generation Date
      const generatedDate = new Date();
      const generatedDateStr = generatedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const generatedTimeStr = generatedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on: ${generatedDateStr} at ${generatedTimeStr}`,
        pageWidth - margin,
        yPos,
        { align: "right" }
      );
      yPos += 8;

      // Summary Section
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("SUMMARY", margin, yPos);
      yPos += 6;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Total Number of Sales: ${totalSales}`, margin, yPos);
      yPos += 5;
      pdf.text(`Total Items Sold: ${totalItems}`, margin, yPos);
      yPos += 5;
      pdf.text(
        `Average Order Value: Rs. ${avgOrderValue.toFixed(2)}`,
        margin,
        yPos
      );
      yPos += 5;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Total Revenue: Rs. ${totalRevenue.toFixed(2)}`, margin, yPos);
      yPos += 8;

      // Divider
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      // Sales Details Header
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("DETAILED SALES TRANSACTIONS", margin, yPos);
      yPos += 6;

      // Sales Data - Detailed view with complete order segregation
      allSales.forEach((sale, saleIndex) => {
        // Check if we need a new page before starting a new sale
        if (yPos > 250) {
          pdf.addPage();
          yPos = margin;
        }

        // Sale Header
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Order #${saleIndex + 1}`, margin, yPos);
        yPos += 5;

        // Invoice Number
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("Invoice Number:", margin, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(sale.invoiceNumber, margin + 35, yPos);
        yPos += 5;

        // Date & Time
        const saleDate = new Date(sale.saleDate);
        const dateTimeStr = `${saleDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })} ${saleDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`;
        pdf.setFont("helvetica", "bold");
        pdf.text("Date & Time:", margin, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(dateTimeStr, margin + 35, yPos);
        yPos += 6;

        // Items Header
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("Items:", margin, yPos);
        yPos += 5;

        // Items List with plate type information
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        sale.items.forEach((item, itemIndex) => {
          // Check if we need a new page for items
          if (yPos > 270) {
            pdf.addPage();
            yPos = margin;
          }

          // Item name (already includes plate type from checkout)
          // Just use itemName directly as it already contains plate type information
          const itemLine = `${itemIndex + 1}. ${item.itemName}`;
          pdf.text(itemLine, margin + 5, yPos);
          yPos += 4;

          // Quantity, Unit Price, Total
          const detailsLine = `   Qty: ${
            item.quantity
          } × Rs. ${item.unitPrice.toFixed(2)} = Rs. ${item.totalPrice.toFixed(
            2
          )}`;
          pdf.text(detailsLine, margin + 5, yPos);
          yPos += 5;
        });

        // Order Total
        yPos += 2;
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("Order Total:", margin + 5, yPos);
        pdf.text(
          `Rs. ${sale.totalAmount.toFixed(2)}`,
          pageWidth - margin,
          yPos,
          {
            align: "right",
          }
        );
        yPos += 8;

        // Divider between orders
        if (saleIndex < allSales.length - 1) {
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPos, pageWidth - margin, yPos);
          yPos += 5;
        }
      });

      // Footer
      yPos += 5;
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("GRAND TOTAL", pageWidth - margin - 50, yPos, {
        align: "right",
      });
      pdf.setFontSize(12);
      pdf.text(`Rs. ${totalRevenue.toFixed(2)}`, pageWidth - margin, yPos, {
        align: "right",
      });
      yPos += 8;

      // Footer note
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "This is a computer-generated report. No signature required.",
        pageWidth / 2,
        yPos,
        { align: "center" }
      );

      // Generate filename
      const filenameDateStr = selectedDate
        ? selectedDate.replace(/-/g, "")
        : new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const filename = `sales-report-${filenameDateStr}.pdf`;

      // Save PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Sales Records
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  View all sales transactions
                </p>
              </div>
            </div>
            <BackButton href="/admin" />
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <label className="text-xs sm:text-sm text-slate-400 font-medium">
                  Filter by Date:
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTodayClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium cursor-pointer"
                >
                  Today
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => handleDateInputChange(e.target.value)}
                    onKeyDown={handleDateKeyDown}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg text-xs sm:text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading || !isSearchEnabled}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-300 text-xs sm:text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
                    title={!isSearchEnabled ? "Select a date to enable search" : "Search for sales on selected date"}
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={generateSalesReportPDF}
              disabled={isGeneratingPDF || (sales.length === 0 && !selectedDate)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/30 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Compiling Report...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Card */}
        {loading ? (
          <SalesSummarySkeleton />
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs sm:text-sm text-slate-400 mb-1">
                  Total Sales
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400">
                  {totalItems}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-400 mb-1">
                  Total Revenue
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400">
                  ₹{totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sales List */}
        {loading ? (
          <SalesListSkeleton />
        ) : sales.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-8 sm:p-12 text-center">
            <p className="text-slate-400 mb-4 text-sm sm:text-base">
              No sales records found
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {sales.map((sale) => {
                const saleDate = new Date(sale.saleDate);
                return (
                  <div
                    key={sale.id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4 hover:border-blue-500/50 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 pb-3 border-b border-slate-700/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Receipt className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <p className="text-sm sm:text-base font-semibold text-white truncate">
                            {sale.invoiceNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
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
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">
                          ₹{sale.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {sale.items.length}{" "}
                          {sale.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {sale.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs sm:text-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {item.itemName}
                            </p>
                            <p className="text-slate-400">
                              ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-amber-400 font-semibold ml-2">
                            ₹{item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems / itemsPerPage)}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
