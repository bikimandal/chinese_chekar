"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ItemCard from "@/components/ItemCard";
import InventoryItemsSkeleton from "@/components/skeletons/InventoryItemsSkeleton";
import InventoryItemSkeleton from "@/components/skeletons/InventoryItemSkeleton";
import InventoryHeader from "./InventoryHeader";
import { supabase } from "@/lib/supabase-client";

interface Item {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  categoryId?: string | null;
  isAvailable: boolean;
  isVisible?: boolean;
  product?: {
    hasHalfFullPlate?: boolean;
    halfPlatePrice?: number | null;
    fullPlatePrice?: number | null;
  } | null;
}

interface InventoryClientProps {
  initialItems: Item[];
}

export default function InventoryClient({ initialItems }: InventoryClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Optimized: Memoize refresh function
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch fresh data (public items only)
      const response = await fetch("/api/items", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setItems(data);
        }
      }
      
      // Also refresh the router to update server-side data
      router.refresh();
    } catch (error) {
      console.error("Error refreshing inventory:", error);
    } finally {
      // Add a small delay to show skeleton
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [router]);

  // Optimized: Memoize handleItemChange function
  const handleItemChange = useCallback(async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const itemId = newRecord?.id || oldRecord?.id;

    if (!itemId) return;

    try {
      if (eventType === "DELETE") {
        // Remove item from list
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        return;
      }

      if (eventType === "INSERT" || eventType === "UPDATE") {
        // Only process if item is visible
        if (!newRecord.isVisible) {
          // If item became invisible, remove it from the list
          setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
          return;
        }

        // Mark item as updating
        setUpdatingItems((prev) => new Set(prev).add(itemId));

        // Fetch the single item with relations (product data)
        const response = await fetch(`/api/items/${itemId}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const updatedItem: Item = await response.json();

          // Double-check item is visible before adding/updating
          if (!updatedItem.isAvailable || !updatedItem.isVisible) {
            // Remove if not visible
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setUpdatingItems((prev) => {
              const next = new Set(prev);
              next.delete(itemId);
              return next;
            });
          } else {
            setItems((prevItems) => {
              if (eventType === "INSERT") {
                // Check if item already exists (avoid duplicates)
                const exists = prevItems.some((item) => item.id === itemId);
                if (exists) {
                  // Update if exists
                  return prevItems.map((item) =>
                    item.id === itemId ? updatedItem : item
                  );
                }
                // Add new item at the beginning
                return [updatedItem, ...prevItems];
              } else {
                // Update existing item
                return prevItems.map((item) =>
                  item.id === itemId ? updatedItem : item
                );
              }
            });
            // Remove from updating set
            setUpdatingItems((prev) => {
              const next = new Set(prev);
              next.delete(itemId);
              return next;
            });
          }
        } else if (response.status === 404) {
          // Item not found, remove from list
          setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        } else {
          // If fetch fails, fallback to full refresh
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
          refreshData();
        }
      }
    } catch (error) {
      // Remove from updating set on error
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      // Fallback to full refresh on error
      refreshData();
    }
  }, [refreshData]);

  // Listen for refresh event from ReloadButton - Commented out, using real-time updates instead
  // useEffect(() => {
  //   const handleRefresh = () => {
  //     refreshData();
  //   };

  //   window.addEventListener("inventory-refresh", handleRefresh);
  //   return () => {
  //     window.removeEventListener("inventory-refresh", handleRefresh);
  //   };
  // }, []);

  // Supabase Real-time subscription for Item table changes
  useEffect(() => {
    // Only subscribe if Supabase client is available
    if (!supabase) {
      setIsRealtimeConnected(false);
      return;
    }
    
    // Subscribe to changes on the Item table
    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events: INSERT, UPDATE, DELETE
          schema: "public",
          table: "Item",
          filter: "isVisible=eq.true", // Only listen to visible items
        },
        (payload) => {
          // Optimized: Update only the specific item that changed
          handleItemChange(payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsRealtimeConnected(true);
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Real-time subscription error. Make sure Realtime is enabled for the 'Item' table in Supabase.");
          console.error("Run this SQL in Supabase SQL Editor: ALTER PUBLICATION supabase_realtime ADD TABLE \"Item\";");
          setIsRealtimeConnected(false);
        } else if (status === "TIMED_OUT") {
          setIsRealtimeConnected(false);
        } else if (status === "CLOSED") {
          setIsRealtimeConnected(false);
        } else {
          setIsRealtimeConnected(false);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      setIsRealtimeConnected(false);
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Optimized: Memoize item variants function
  const getItemVariants = useCallback((index: number): Variants => {
    return {
      hidden: { 
        opacity: 0, 
        y: 20 // Simple slide up from bottom
      },
      visible: {
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut",
          delay: index < 6 ? index * 0.1 : 0, // Stagger first few, subsequent ones appear as you scroll
        },
      },
      exit: { 
        opacity: 0, 
        scale: 0.95, 
        transition: { duration: 0.2 } 
      },
    };
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    // Show skeleton matching the current number of items, or default to 4
    const skeletonCount = items.length > 0 ? items.length : 4;
    return <InventoryItemsSkeleton count={skeletonCount} />;
  }



  return (
    <>
      <InventoryHeader 
        isRealtimeConnected={isRealtimeConnected} 
        onRefresh={refreshData}
      />
      {items.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-gray-500">
            No items currently available.
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const isUpdating = updatingItems.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  variants={getItemVariants(index)}
                  initial="hidden"
                  // For first 6 items, animate immediately. For others, wait until in view.
                  animate={index < 6 ? "visible" : undefined}
                  whileInView={index >= 6 ? "visible" : undefined}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  exit="exit"
                  layout
                  whileHover={!isUpdating ? { 
                    y: -5, 
                    scale: 1.02,
                    transition: { 
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
                    } 
                  } : {}}
                  style={{ 
                    perspective: 1000,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity" // Performance optimization
                  }}
                >
                  {isUpdating ? (
                    <InventoryItemSkeleton />
                  ) : (
                    <ItemCard
                      id={item.id}
                      name={item.name}
                      description={item.description || ""}
                      price={item.price}
                      stock={item.stock}
                      image={item.image ?? undefined}
                      category={item.categoryId || ""}
                      isAvailable={item.isAvailable}
                      isAboveFold={index < 8} // First 8 items are likely above the fold
                      product={item.product ?? undefined}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

