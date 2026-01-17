"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import { Item, Category } from "../types";
import AdminHeader from "./AdminHeader";
import StatsCards from "./StatsCards";
import ItemsTable from "./ItemsTable";
import StatsCardsSkeleton from "@/components/skeletons/StatsCardsSkeleton";
import ItemsTableSkeleton from "@/components/skeletons/ItemsTableSkeleton";
import Loader from "@/components/Loader";

export default function AdminDashboard() {
  const pathname = usePathname();
  const { currentStore, loading: storeLoading } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);

  // Detect route changes to show loader immediately
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathnameRef.current = pathname;
      checkSession();
    } else if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      // Route changed - show loader immediately and reset items to trigger fresh fetch
      setIsNavigating(true);
      setItems([]); // Reset items to trigger fresh fetch and show loader
      prevPathnameRef.current = pathname;
      // Don't re-check session on navigation - user is already authenticated
      // Items will be fetched automatically when items.length === 0
    }
  }, [pathname]);

  useEffect(() => {
    // Set up auto token refresh every 50 minutes (tokens expire after 1 hour)
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000); // 50 minutes

    // Listen for navigation events
    const handleNavigationStart = () => {
      setIsNavigating(true);
    };

    window.addEventListener("navigation-start", handleNavigationStart);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener("navigation-start", handleNavigationStart);
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
        console.error("Session check failed with status:", response.status);
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (data.user) {
        setIsAuthenticated(true);
        // Items will be fetched in useEffect when store is loaded
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

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });
      if (!response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      window.location.href = "/login";
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
  };

  const fetchItems = useCallback(async () => {
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
        setItems(data);
      } else {
        console.error("Invalid items data:", data);
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Fetch items when store is loaded (must be after fetchItems and fetchCategories are defined)
  useEffect(() => {
    if (isAuthenticated && !storeLoading && currentStore && !isCheckingAuth) {
      // Always fetch items when items array is empty (initial load or after navigation reset)
      if (items.length === 0) {
        fetchItems();
        fetchCategories();
      }
    }
  }, [isAuthenticated, storeLoading, currentStore?.id, isCheckingAuth, items.length, fetchItems, fetchCategories]);

  // Clear navigation state when items are loaded
  useEffect(() => {
    if (isAuthenticated && !storeLoading && currentStore && !isLoadingItems && items.length > 0) {
      // Clear navigation state once data is loaded
      setIsNavigating(false);
    }
  }, [isAuthenticated, storeLoading, currentStore, isLoadingItems, items.length]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setDeletingItemId(id);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchItems();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item");
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleToggleAvailability = async (item: Item) => {
    setTogglingItemId(item.id);
    const previousAvailability = item.isAvailable;

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
      )
    );

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAvailable: !item.isAvailable,
        }),
      });

      if (!response.ok) {
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.id === item.id ? { ...i, isAvailable: previousAvailability } : i
          )
        );
        const data = await response.json();
        alert(data.error || "Failed to update availability");
      }
    } catch (error) {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id ? { ...i, isAvailable: previousAvailability } : i
        )
      );
      console.error("Error toggling availability:", error);
      alert("An error occurred while updating availability");
    } finally {
      setTogglingItemId(null);
    }
  };

  // Optimized: Single pass through items array using reduce (O(n) instead of O(3n))
  const { totalItems, lowStock, outOfStock } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return { totalItems: 0, lowStock: 0, outOfStock: 0 };
    }
    
    // Single pass algorithm - O(n) time complexity
    const stats = items.reduce(
      (acc, item) => {
        acc.totalItems++;
        if (item.stock === 0) {
          acc.outOfStock++;
        } else if (item.stock > 0 && item.stock <= 5) {
          acc.lowStock++;
        }
        return acc;
      },
      { totalItems: 0, lowStock: 0, outOfStock: 0 }
    );
    
    return stats;
  }, [items]);

  // Show full-page loader during initial auth check, store loading, navigation, or initial data fetch
  // Priority: navigation > auth check > store loading > initial data fetch
  const shouldShowLoader = 
    isNavigating || 
    isCheckingAuth || 
    storeLoading || 
    (isAuthenticated && !storeLoading && currentStore && (isLoadingItems || items.length === 0));

  if (shouldShowLoader) {
    return <Loader message="Loading dashboard..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {isLoadingItems && items.length > 0 ? (
          // Show skeleton only if we have existing items (refresh scenario)
          <>
            <StatsCardsSkeleton />
            <ItemsTableSkeleton />
          </>
        ) : (
          <>
            <StatsCards
              totalItems={totalItems}
              lowStock={lowStock}
              outOfStock={outOfStock}
            />

            <ItemsTable
              items={items}
              togglingItemId={togglingItemId}
              deletingItemId={deletingItemId}
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
            />
          </>
        )}
      </div>
    </div>
  );
}
