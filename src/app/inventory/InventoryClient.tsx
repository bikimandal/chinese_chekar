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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
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
        <motion.div
          className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
        </motion.div>
      )}
    </>
  );
}

