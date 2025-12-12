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
  plateType?: "half" | "full" | null; // "half" or "full" or null if product doesn't have half/full option
}

export default function LiveSellPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  // Track plate type selection for each item (itemId -> "half" | "full")
  const [plateSelections, setPlateSelections] = useState<Record<string, "half" | "full">>({});

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
        // Initialize plate selections to "half" for items with half/full option
        const initialSelections: Record<string, "half" | "full"> = {};
        enabledItems.forEach((item: Item) => {
          if (item.product?.hasHalfFullPlate) {
            initialSelections[item.id] = "half";
          }
        });
        setPlateSelections(initialSelections);
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

  const getItemPrice = (item: Item, plateType?: "half" | "full" | null): number => {
    if (!item.product?.hasHalfFullPlate || !plateType) {
      return item.price;
    }
    if (plateType === "half" && item.product.halfPlatePrice) {
      return item.product.halfPlatePrice;
    }
    if (plateType === "full" && item.product.fullPlatePrice) {
      return item.product.fullPlatePrice;
    }
    return item.price;
  };

  const addToCart = (item: Item) => {
    const hasHalfFull = item.product?.hasHalfFullPlate ?? false;
    const plateType = hasHalfFull ? (plateSelections[item.id] || "half") : null;
    const price = getItemPrice(item, plateType);
    
    // For items with half/full, we need to check if same item with same plate type exists
    const cartKey = hasHalfFull ? `${item.id}-${plateType}` : item.id;
    const existingItem = cart.find((ci) => {
      if (hasHalfFull) {
        return ci.itemId === item.id && ci.plateType === plateType;
      }
      return ci.itemId === item.id;
    });
    
    if (existingItem) {
      // Increase quantity if stock allows
      if (existingItem.quantity < item.stock) {
        setCart(
          cart.map((ci) =>
            ci.itemId === item.id && ci.plateType === plateType
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
            price: price,
            quantity: 1,
            stock: item.stock,
            plateType: plateType,
          },
        ]);
      }
    }
  };

  const togglePlateType = (itemId: string, currentType: "half" | "full") => {
    const newType = currentType === "half" ? "full" : "half";
    // Only update the selection for adding new items, don't modify existing cart items
    setPlateSelections((prev) => ({ ...prev, [itemId]: newType }));
  };

  const removeFromCart = (itemId: string, plateType?: "half" | "full" | null) => {
    if (plateType !== undefined) {
      // Remove specific item with specific plate type
      setCart(cart.filter((ci) => !(ci.itemId === itemId && ci.plateType === plateType)));
    } else {
      // Remove all instances of this item
      setCart(cart.filter((ci) => ci.itemId !== itemId));
    }
  };

  const updateQuantity = (itemId: string, change: number, plateType?: "half" | "full" | null) => {
    setCart((prevCart) => {
      // First, calculate total quantity across all plate types for this item
      const allCartItemsForProduct = prevCart.filter((c) => c.itemId === itemId);
      const totalQuantity = allCartItemsForProduct.reduce((sum, c) => sum + c.quantity, 0);
      
      // Get the item to check stock
      const item = items.find((i) => i.id === itemId);
      const maxQuantity = item ? item.stock : 0;
      
      // Check if total quantity (including change) exceeds stock
      const newTotalQuantity = totalQuantity + change;
      if (newTotalQuantity > maxQuantity) {
        return prevCart; // Don't allow more than stock
      }
      
      // Update the specific cart item matching itemId and plateType
      return prevCart.map((ci) => {
        const matches = ci.itemId === itemId && (plateType !== undefined ? ci.plateType === plateType : true);
        if (matches) {
          const newQuantity = ci.quantity + change;
          
          if (newQuantity <= 0) {
            // Remove this cart item if quantity becomes 0
            return null;
          }
          
          return { ...ci, quantity: newQuantity };
        }
        return ci;
      }).filter((ci) => ci !== null) as CartItem[];
    });
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
              const hasHalfFull = item.product?.hasHalfFullPlate ?? false;
              const currentPlateType = plateSelections[item.id] || (hasHalfFull ? "half" : null);
              const displayPrice = getItemPrice(item, currentPlateType);
              // Find cart items for this item with the current plate type
              const cartItem = cart.find((ci) => 
                ci.itemId === item.id && 
                (hasHalfFull ? ci.plateType === currentPlateType : !ci.plateType)
              );
              const quantity = cartItem?.quantity || 0;
              // Get all cart items for this product to show total in cart
              const allCartItemsForProduct = cart.filter((ci) => ci.itemId === item.id);
              const totalInCart = allCartItemsForProduct.reduce((sum, ci) => sum + ci.quantity, 0);
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`text-sm sm:text-base font-semibold truncate ${
                          isOutOfStock ? "text-slate-500" : "text-white"
                        }`}>
                          {item.name}
                        </h3>
                        {totalInCart > 0 && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] font-semibold text-emerald-400">
                            {totalInCart} in cart
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-xs text-red-400">(Out of Stock)</span>
                        )}
                      </div>
                      {/* Show cart items breakdown if multiple plate types in cart */}
                      {hasHalfFull && allCartItemsForProduct.length > 0 && (
                        <div className="mb-2 space-y-0.5">
                          {allCartItemsForProduct.map((cartItem, idx) => (
                            <div key={idx} className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-slate-700/30 rounded">
                                {cartItem.plateType === "half" ? "Half" : "Full"} plate: {cartItem.quantity} × ₹{cartItem.price} = ₹{(cartItem.quantity * cartItem.price).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className={`text-xs ${isOutOfStock ? "text-slate-600" : "text-slate-500"}`}>
                            Price
                          </p>
                          <p className={`text-sm sm:text-base font-bold ${
                            isOutOfStock ? "text-slate-500" : "text-amber-400"
                          }`}>
                            ₹{displayPrice}
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
                      {/* Half/Full Plate Toggle */}
                      {hasHalfFull && !isOutOfStock && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => togglePlateType(item.id, currentPlateType || "half")}
                              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all text-xs sm:text-sm cursor-pointer"
                            >
                              <span className={`px-2 py-0.5 rounded ${currentPlateType === "half" ? "bg-amber-600 text-white" : "text-slate-400"}`}>
                                Half
                              </span>
                              <span className="text-slate-500">/</span>
                              <span className={`px-2 py-0.5 rounded ${currentPlateType === "full" ? "bg-amber-600 text-white" : "text-slate-400"}`}>
                                Full
                              </span>
                            </button>
                            {allCartItemsForProduct.length > 0 && (
                              <span className="text-[10px] text-slate-500 italic">
                                Toggle to add different plate type
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1, currentPlateType)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-white transition-all active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-bold text-white">
                            {quantity}
                          </span>
                          {hasHalfFull && (
                            <span className="text-[9px] text-slate-500">
                              {currentPlateType === "half" ? "Half" : "Full"}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, 1, currentPlateType)}
                          disabled={totalInCart >= item.stock}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-lg text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, currentPlateType)}
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
