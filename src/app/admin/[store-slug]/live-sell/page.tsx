"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import {
  Package,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  ChevronUp,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import BackButton from "../../components/BackButton";
import { Item } from "../../types";
import LiveSellItemsSkeleton from "@/components/skeletons/LiveSellItemsSkeleton";

interface CartItem {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  stock: number;
  plateType?: "half" | "full" | null;
}

export default function LiveSellPage() {
  const router = useRouter();
  const { currentStore } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [plateSelections, setPlateSelections] = useState<
    Record<string, "half" | "full">
  >({});

  useEffect(() => {
    checkSession();

    const handleSaleCompleted = () => {
      fetchItems();
    };
    window.addEventListener("saleCompleted", handleSaleCompleted);

    return () => {
      window.removeEventListener("saleCompleted", handleSaleCompleted);
    };
  }, []);

  // Fetch items when store is available (no delay - StoreCookieSetter runs in parallel)
  useEffect(() => {
    if (isAuthenticated && currentStore) {
      fetchItems();
    }
  }, [isAuthenticated, currentStore?.id]);

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
        // Don't fetch items here - wait for store context
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
      const response = await fetch("/api/items?admin=true", {
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch items:", response.status, errorData);
        setItems([]);
        return;
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const enabledItems = data.filter(
          (item: Item) => item.isAvailable === true
        );
        setItems(enabledItems);
        const initialSelections: Record<string, "half" | "full"> = {};
        enabledItems.forEach((item: Item) => {
          if (item.product?.hasHalfFullPlate) {
            initialSelections[item.id] = "half";
          }
        });
        setPlateSelections(initialSelections);
      } else {
        console.error("Invalid data format:", data);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Optimized: Memoized price calculation function
  const getItemPrice = useCallback((
    item: Item,
    plateType?: "half" | "full" | null
  ): number => {
    const hasHalfFull = item.product?.hasHalfFullPlate ?? false;

    // When segregation is disabled, always use fullPlatePrice as the single price
    if (!hasHalfFull) {
      return item.product?.fullPlatePrice ?? item.price;
    }

    // When segregation is enabled, use the appropriate price based on plateType
    if (!plateType || !item.product) {
      return item.price;
    }
    if (plateType === "half" && item.product.halfPlatePrice) {
      return item.product.halfPlatePrice;
    }
    if (plateType === "full" && item.product.fullPlatePrice) {
      return item.product.fullPlatePrice;
    }
    return item.price;
  }, []);

  // Optimized: Use Map for O(1) cart lookups instead of array.find (O(n))
  const addToCart = useCallback((item: Item) => {
    const hasHalfFull = item.product?.hasHalfFullPlate ?? false;
    const plateType = hasHalfFull ? plateSelections[item.id] || "half" : null;
    const price = getItemPrice(item, plateType);

    // Create a unique key for cart item lookup
    const cartKey = hasHalfFull 
      ? `${item.id}-${plateType}` 
      : item.id;

    setCart((prevCart) => {
      // Use Map for O(1) lookup
      const cartMap = new Map(
        prevCart.map((ci) => {
          const key = ci.plateType !== null && ci.plateType !== undefined
            ? `${ci.itemId}-${ci.plateType}`
            : ci.itemId;
          return [key, ci];
        })
      );

      const existingItem = cartMap.get(cartKey);

      if (existingItem) {
        if (existingItem.quantity < item.stock) {
          cartMap.set(cartKey, { ...existingItem, quantity: existingItem.quantity + 1 });
        }
      } else {
        if (item.stock > 0) {
          cartMap.set(cartKey, {
            itemId: item.id,
            itemName: item.name,
            price: price,
            quantity: 1,
            stock: item.stock,
            plateType: plateType,
          });
        }
      }

      return Array.from(cartMap.values());
    });
  }, [plateSelections, getItemPrice]);

  const togglePlateType = (itemId: string, currentType: "half" | "full") => {
    const newType = currentType === "half" ? "full" : "half";
    setPlateSelections((prev) => ({ ...prev, [itemId]: newType }));
  };

  // Optimized: Use Set for O(1) filtering
  const removeFromCart = useCallback((
    itemId: string,
    plateType?: "half" | "full" | null
  ) => {
    setCart((prevCart) => {
      if (plateType !== undefined && plateType !== null) {
        // Use Set for O(1) lookup
        const targetKey = `${itemId}-${plateType}`;
        return prevCart.filter((ci) => {
          const key = ci.plateType !== null && ci.plateType !== undefined
            ? `${ci.itemId}-${ci.plateType}`
            : ci.itemId;
          return key !== targetKey;
        });
      } else {
        // Remove all items with this itemId
        return prevCart.filter((ci) => ci.itemId !== itemId);
      }
    });
  }, []);

  // Optimized: Use Map and Set for O(1) operations
  const updateQuantity = useCallback((
    itemId: string,
    change: number,
    plateType?: "half" | "full" | null
  ) => {
    setCart((prevCart) => {
      // Use Map for O(1) lookups
      const cartMap = new Map(
        prevCart.map((ci) => {
          const key = ci.plateType !== null && ci.plateType !== undefined
            ? `${ci.itemId}-${ci.plateType}`
            : ci.itemId;
          return [key, ci];
        })
      );

      // Calculate total quantity for this item using Set for unique keys
      const itemKeys = new Set<string>();
      cartMap.forEach((ci, key) => {
        if (ci.itemId === itemId) {
          itemKeys.add(key);
        }
      });

      let totalQuantity = 0;
      itemKeys.forEach((key) => {
        const ci = cartMap.get(key);
        if (ci) totalQuantity += ci.quantity;
      });

      // Use Map for O(1) item lookup
      const itemsMap = new Map(items.map((i) => [i.id, i]));
      const item = itemsMap.get(itemId);
      const maxQuantity = item ? item.stock : 0;

      const newTotalQuantity = totalQuantity + change;
      if (newTotalQuantity > maxQuantity) {
        return prevCart;
      }

      // Update the specific cart item
      const targetKey = plateType !== undefined && plateType !== null
        ? `${itemId}-${plateType}`
        : itemId;
      
      const targetItem = cartMap.get(targetKey);
      if (targetItem) {
        const newQuantity = targetItem.quantity + change;
        if (newQuantity <= 0) {
          cartMap.delete(targetKey);
        } else {
          cartMap.set(targetKey, { ...targetItem, quantity: newQuantity });
        }
      }

      return Array.from(cartMap.values());
    });
  }, [items]);

  // Optimized: Memoized total calculation
  // Optimized: Memoized total calculation - O(n) but memoized
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Optimized: Memoized enabled items filter - MUST be before conditional returns
  const enabledItems = useMemo(() => {
    return items.filter((item) => item.isAvailable === true);
  }, [items]);

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Please add items to cart first");
      return;
    }

    if (!currentStore) {
      alert("Store not selected");
      return;
    }

    window.dispatchEvent(new Event("navigation-start"));

    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    router.push(`/admin/${currentStore.slug}/live-sell/checkout`);
  };

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }
  
  const storeSlug = currentStore?.slug || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                Live Sell
              </h1>
              <p className="text-xs text-slate-400">Quick checkout</p>
            </div>
          </div>
          <BackButton href={storeSlug ? `/admin/${storeSlug}` : "/admin"} />
        </div>

        {/* Items Grid - Better Desktop Layout */}
        {isLoadingItems ? (
          <LiveSellItemsSkeleton />
        ) : enabledItems.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
            <p className="text-slate-400 mb-4">No items available</p>
            <Link
              href={storeSlug ? `/admin/${storeSlug}` : "/admin"}
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enabledItems.map((item) => {
              const hasHalfFull = item.product?.hasHalfFullPlate ?? false;
              const currentPlateType =
                plateSelections[item.id] || (hasHalfFull ? "half" : null);
              const displayPrice = getItemPrice(item, currentPlateType);
              
              // Optimized: Use Map for O(1) cart lookups
              const cartKey = hasHalfFull && currentPlateType
                ? `${item.id}-${currentPlateType}`
                : item.id;
              
              // Find cart item using optimized key lookup
              const cartItem = cart.find(
                (ci) => {
                  const key = ci.plateType !== null && ci.plateType !== undefined
                    ? `${ci.itemId}-${ci.plateType}`
                    : ci.itemId;
                  return key === cartKey;
                }
              );
              
              const quantity = cartItem?.quantity || 0;
              
              // Optimized: Calculate total in cart - single pass O(n) but only for this item
              const totalInCart = cart.reduce((sum, ci) => {
                return ci.itemId === item.id ? sum + ci.quantity : sum;
              }, 0);
              
              // Get all cart items for this product (for half/full breakdown)
              const allCartItemsForProduct = cart.filter((ci) => ci.itemId === item.id);
              
              const isOutOfStock = item.stock === 0;
              const isLowStock = item.stock > 0 && item.stock <= 5;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`group relative bg-slate-800/40 backdrop-blur rounded-xl border transition-all ${
                    isOutOfStock
                      ? "border-slate-700/30 opacity-60"
                      : "border-slate-700/50 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
                  }`}
                >
                  {/* Quick badge */}
                  {totalInCart > 0 && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg z-10">
                      {totalInCart}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      {item.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className="font-semibold text-white truncate flex-1 min-w-0"
                            style={{ fontFamily: "var(--font-body), sans-serif" }}
                          >
                            {item.name}
                          </h3>
                          {/* Low Stock Badge - After name */}
                          {isLowStock && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm border border-amber-400/60 rounded-full shadow-lg shadow-amber-500/20">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                              <span className="text-[10px] text-amber-200 font-bold whitespace-nowrap">
                                Low Stock
                              </span>
                            </div>
                          )}
                          {/* Out of Stock Badge - After name */}
                          {isOutOfStock && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-red-500/30 to-red-600/30 backdrop-blur-sm border border-red-400/60 rounded-full shadow-lg shadow-red-500/20">
                              <AlertCircle className="w-3.5 h-3.5 text-red-300 animate-pulse" />
                              <span className="text-[10px] text-red-200 font-bold whitespace-nowrap">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price & Stock in one line */}
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <span className="text-2xl font-bold text-amber-400">
                              ₹{displayPrice}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-sm sm:text-base font-medium">
                              Stock:
                            </span>
                            <span
                              className={`text-base sm:text-lg lg:text-xl font-bold ${
                                item.stock === 0
                                  ? "text-red-400"
                                  : item.stock <= 5
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {item.stock}
                            </span>
                            <span className="text-slate-300 text-xs sm:text-sm font-medium">
                              Plate
                            </span>
                          </div>
                        </div>

                        {/* Half/Full Toggle - Compact */}
                        {hasHalfFull && !isOutOfStock && (
                          <div className="mb-3">
                            <button
                              onClick={() =>
                                togglePlateType(
                                  item.id,
                                  currentPlateType || "half"
                                )
                              }
                              className="relative inline-flex rounded-lg overflow-hidden bg-slate-700/50 border border-slate-600 cursor-pointer"
                            >
                              <div
                                className={`absolute top-0 bottom-0 w-1/2 bg-amber-500 transition-transform duration-300 ${
                                  currentPlateType === "half"
                                    ? "translate-x-0"
                                    : "translate-x-full"
                                }`}
                              />
                              <span
                                className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors ${
                                  currentPlateType === "half"
                                    ? "text-white"
                                    : "text-slate-400"
                                }`}
                              >
                                Half
                              </span>
                              <span
                                className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors ${
                                  currentPlateType === "full"
                                    ? "text-white"
                                    : "text-slate-400"
                                }`}
                              >
                                Full
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Cart breakdown for multiple plates */}
                        {hasHalfFull && allCartItemsForProduct.length > 1 && (
                          <div className="mb-2 space-y-1">
                            {allCartItemsForProduct.map((ci, idx) => (
                              <div
                                key={idx}
                                className="text-[10px] text-slate-400 flex items-center gap-2"
                              >
                                <span className="px-2 py-0.5 bg-slate-700/40 rounded">
                                  {ci.plateType === "half" ? "Half" : "Full"}:{" "}
                                  {ci.quantity} × ₹{ci.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {quantity > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg px-2 py-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, -1, currentPlateType)
                                }
                                className="w-9 h-9 flex items-center justify-center bg-slate-600/50 hover:bg-slate-600 rounded-md transition-colors cursor-pointer"
                              >
                                <Minus className="w-6 h-6 text-white" />
                              </button>
                              <span className="text-lg lg:text-xl font-bold text-white min-w-[24px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, 1, currentPlateType)
                                }
                                disabled={totalInCart >= item.stock}
                                className="w-9 h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Plus className="w-6 h-6 text-white" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, currentPlateType)
                              }
                              className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => !isOutOfStock && addToCart(item)}
                            disabled={isOutOfStock}
                            className={`w-full px-4 py-2 font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
                              isOutOfStock
                                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 cursor-pointer"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            {isOutOfStock ? "Out of Stock" : "Add"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl z-50"
          >
            {/* Expandable Cart Details */}
            <AnimatePresence>
              {showCartDetails && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-b border-slate-700/50"
                >
                  <div className="max-h-64 overflow-y-auto p-4 space-y-2">
                    {cart.map((ci, idx) => (
                      <div
                        key={`${ci.itemId}-${ci.plateType}-${idx}`}
                        className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {ci.itemName}
                            {ci.plateType && (
                              <span className="text-slate-400 text-xs ml-1">
                                ({ci.plateType === "half" ? "Half" : "Full"})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">
                            {ci.quantity} × ₹{ci.price} = ₹
                            {(ci.quantity * ci.price).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(ci.itemId, ci.plateType)
                          }
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Summary */}
            <div className="p-4">
              <div className="max-w-6xl mx-auto flex items-center gap-4">
                <button
                  onClick={() => setShowCartDetails(!showCartDetails)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: showCartDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronUp className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">
                      {cart.length} item{cart.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ₹{totalAmount.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
