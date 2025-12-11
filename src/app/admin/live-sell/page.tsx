"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Package } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Item } from "../types";

export default function LiveSellPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [decrementingIds, setDecrementingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkSession();
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
        fetchItems();
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

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items?admin=true");
      if (!response.ok) {
        console.error("Failed to fetch items:", response.status);
        setItems([]);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        // Filter only enabled items (isAvailable === true)
        const enabledItems = data.filter((item: Item) => item.isAvailable === true);
        setItems(enabledItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    }
  };

  const handleDecrement = async (item: Item) => {
    if (item.stock <= 0 || decrementingIds.has(item.id)) return;

    setDecrementingIds((prev) => new Set(prev).add(item.id));

    try {
      const response = await fetch(`/api/items/${item.id}/decrement`, {
        method: "POST",
      });

      if (response.ok) {
        const updatedItem = await response.json();
        // Update the item in the list
        setItems((prevItems) =>
          prevItems.map((i) => (i.id === item.id ? updatedItem : i))
        );
      } else {
        const data = await response.json();
        alert(data.error || "Failed to decrement stock");
      }
    } catch (error) {
      console.error("Error decrementing stock:", error);
      alert("An error occurred while decrementing stock");
    } finally {
      setDecrementingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const enabledItems = items.filter((item) => item.isAvailable === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-2 sm:mb-3 md:mb-4 transition-colors text-xs sm:text-sm md:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Admin Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent truncate">
                Live Sell
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Quick stock reduction for enabled items
              </p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {enabledItems.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 p-6 sm:p-8 md:p-12 text-center">
            <p className="text-slate-400 mb-4 text-xs sm:text-sm md:text-base">
              No enabled items available
            </p>
            <Link
              href="/admin"
              className="inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 text-xs sm:text-sm md:text-base"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Row Layout */}
            <div className="sm:hidden space-y-2">
              {enabledItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3 hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-3"
                >
                  {/* Small Image */}
                  {item.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-sm font-bold text-amber-400">₹{item.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Stock</p>
                        <p
                          className={`text-sm font-bold ${
                            item.stock === 0
                              ? "text-red-400"
                              : item.stock <= 5
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {item.stock}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decrement Button */}
                  <button
                    onClick={() => handleDecrement(item)}
                    disabled={item.stock <= 0 || decrementingIds.has(item.id)}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all duration-300 active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 text-xs"
                  >
                    {decrementingIds.has(item.id) ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>...</span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4" />
                        <span>-1</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {enabledItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-5 lg:p-6 hover:border-emerald-500/50 transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  {item.image && (
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 md:h-36 lg:h-40 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Name and Category */}
                  <div className="mb-3 flex-shrink-0">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[3rem]">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.category && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs">
                          {item.category.name}
                        </span>
                      )}
                      {item.product && !item.category && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">
                          {item.product.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50 flex-shrink-0">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Price</p>
                      <p className="text-lg md:text-xl font-bold text-amber-400">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-xs text-slate-500 mb-1">Stock</p>
                      <p
                        className={`text-lg md:text-xl font-bold ${
                          item.stock === 0
                            ? "text-red-400"
                            : item.stock <= 5
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {item.stock}
                      </p>
                    </div>
                  </div>

                  {/* Decrement Button */}
                  <button
                    onClick={() => handleDecrement(item)}
                    disabled={item.stock <= 0 || decrementingIds.has(item.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/30 mt-auto text-sm md:text-base"
                  >
                    {decrementingIds.has(item.id) ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Sell (-1)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

