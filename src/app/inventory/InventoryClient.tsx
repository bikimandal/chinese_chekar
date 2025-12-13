"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "@/components/ItemCard";
import InventoryItemsSkeleton from "@/components/skeletons/InventoryItemsSkeleton";

interface Item {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  categoryId?: string | null;
  isAvailable: boolean;
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

  // Handle refresh
  const refreshData = async () => {
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
  };

  // Listen for refresh event from ReloadButton
  useEffect(() => {
    const handleRefresh = () => {
      refreshData();
    };

    window.addEventListener("inventory-refresh", handleRefresh);
    return () => {
      window.removeEventListener("inventory-refresh", handleRefresh);
    };
  }, []);

  // Show skeleton while loading
  if (isLoading) {
    // Show skeleton matching the current number of items, or default to 4
    const skeletonCount = items.length > 0 ? items.length : 4;
    return <InventoryItemsSkeleton count={skeletonCount} />;
  }

  // Create item variants with alternating entrance directions - refined and optimized
  const getItemVariants = (index: number) => {
    const isEven = index % 2 === 0;
    return {
      hidden: {
        opacity: 0,
        x: isEven ? 60 : -60, // Reduced distance for smoother entrance
        scale: 0.92,
        rotateY: isEven ? 8 : -8, // More subtle 3D effect
        filter: "blur(4px)", // Subtle blur for depth
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1], // Smooth, refined easing (easeOutExpo-like)
          delay: index * 0.06, // Optimized stagger timing
          opacity: { duration: 0.4 }, // Faster opacity fade
          filter: { duration: 0.5 }, // Slightly faster blur
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        filter: "blur(2px)",
        transition: {
          duration: 0.25,
          ease: [0.4, 0, 1, 1], // Quick exit
        },
      },
    };
  };

  return (
    <>
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
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={getItemVariants(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }} // Trigger earlier for smoother entry
                exit="exit"
                layout
                whileHover={{ 
                  y: -5, 
                  scale: 1.02,
                  transition: { 
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  } 
                }}
                style={{ 
                  perspective: 1000,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity" // Performance optimization
                }}
              >
                <ItemCard
                  id={item.id}
                  name={item.name}
                  description={item.description || ""}
                  price={item.price}
                  stock={item.stock}
                  image={item.image ?? undefined}
                  category={item.categoryId || ""}
                  isAvailable={item.isAvailable}
                  product={item.product ?? undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

