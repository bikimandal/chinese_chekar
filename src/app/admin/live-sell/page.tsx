"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import BackButton from "../components/BackButton";
import { Item } from "../types";
import LiveSellItemsSkeleton from "@/components/skeletons/LiveSellItemsSkeleton";

interface CartItem {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function LiveSellPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  useEffect(() => {
    checkSession();
    
    // Listen for sale completion to refresh items
    const handleSaleCompleted = () => {
      fetchItems();
    };
    window.addEventListener("saleCompleted", handleSaleCompleted);
    
    return () => {
      window.removeEventListener("saleCompleted", handleSaleCompleted);
    };
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
    setIsLoadingItems(true);
    try {
      const response = await fetch("/api/items?admin=true");
      if (!response.ok) {
        console.error("Failed to fetch items:", response.status);
        setItems([]);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const enabledItems = data.filter((item: Item) => item.isAvailable === true);
        setItems(enabledItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const addToCart = (item: Item) => {
    const existingItem = cart.find((ci) => ci.itemId === item.id);
    
    if (existingItem) {
      // Increase quantity if stock allows
      if (existingItem.quantity < item.stock) {
        setCart(
          cart.map((ci) =>
            ci.itemId === item.id
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          )
        );
      }
    } else {
      // Add new item to cart
      if (item.stock > 0) {
        setCart([
          ...cart,
          {
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            quantity: 1,
            stock: item.stock,
          },
        ]);
      }
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((ci) => ci.itemId !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(
      cart.map((ci) => {
        if (ci.itemId === itemId) {
          const newQuantity = ci.quantity + change;
          // Get current stock from items list
          const item = items.find((i) => i.id === itemId);
          const maxQuantity = item ? item.stock : ci.stock;
          
          if (newQuantity <= 0) {
            return ci; // Don't allow negative
          }
          if (newQuantity > maxQuantity) {
            return ci; // Don't allow more than stock
          }
          return { ...ci, quantity: newQuantity };
        }
        return ci;
      })
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Please add items to cart first");
      return;
    }

    // Trigger progress bar
    window.dispatchEvent(new Event('navigation-start'));

    // Store cart in sessionStorage and navigate to checkout
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    router.push("/admin/live-sell/checkout");
  };

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const enabledItems = items.filter((item) => item.isAvailable === true);
  const totalAmount = getTotalAmount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent truncate">
                  Live Sell
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  Add items to cart and proceed to checkout
                </p>
              </div>
            </div>
            <BackButton href="/admin" />
          </div>
        </div>

        {/* Items List - Mobile Row Layout */}
        {isLoadingItems ? (
          <LiveSellItemsSkeleton />
        ) : enabledItems.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-6 sm:p-8 text-center">
            <p className="text-slate-400 mb-4 text-xs sm:text-sm">
              No enabled items available
            </p>
            <Link
              href="/admin"
              className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 text-xs sm:text-sm"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {enabledItems.map((item) => {
              const cartItem = cart.find((ci) => ci.itemId === item.id);
              const quantity = cartItem?.quantity || 0;
              const isOutOfStock = item.stock === 0;

              return (
                <div
                  key={item.id}
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg border p-3 sm:p-4 transition-all duration-300 ${
                    isOutOfStock
                      ? "border-slate-600/30 opacity-50 grayscale cursor-not-allowed"
                      : "border-slate-700/50 hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Small Image */}
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm sm:text-base font-semibold mb-1 truncate ${
                        isOutOfStock ? "text-slate-500" : "text-white"
                      }`}>
                        {item.name}
                        {isOutOfStock && (
                          <span className="ml-2 text-xs text-red-400">(Out of Stock)</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className={`text-xs ${isOutOfStock ? "text-slate-600" : "text-slate-500"}`}>
                            Price
                          </p>
                          <p className={`text-sm sm:text-base font-bold ${
                            isOutOfStock ? "text-slate-500" : "text-amber-400"
                          }`}>
                            ₹{item.price}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isOutOfStock ? "text-slate-600" : "text-slate-500"}`}>
                            Stock
                          </p>
                          <p
                            className={`text-sm sm:text-base font-bold ${
                              isOutOfStock
                                ? "text-slate-500"
                                : item.stock === 0
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

                    {/* Quantity Controls */}
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={quantity >= item.stock}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-lg text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => !isOutOfStock && addToCart(item)}
                        disabled={isOutOfStock}
                        className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 font-semibold rounded-lg transition-all duration-300 active:scale-95 text-xs sm:text-sm ${
                          isOutOfStock
                            ? "bg-slate-700/50 text-slate-500 border border-slate-600/30 cursor-not-allowed"
                            : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/30 cursor-pointer"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1" />
                        {isOutOfStock ? "Out of Stock" : "Add"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Cart Summary at Bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-slate-900 to-slate-800 border-t border-slate-700/50 p-3 sm:p-4 shadow-2xl z-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-xs sm:text-sm text-slate-400">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <button
                onClick={proceedToCheckout}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30 text-sm sm:text-base whitespace-nowrap"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
