"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  return (
    <>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No items currently available.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
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
          ))}
        </div>
      )}
    </>
  );
}

