"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Item, Category } from "./types";
import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import ItemsTable from "./components/ItemsTable";
import StatsCardsSkeleton from "@/components/skeletons/StatsCardsSkeleton";
import ItemsTableSkeleton from "@/components/skeletons/ItemsTableSkeleton";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkSession();
    // Set up auto token refresh every 50 minutes (tokens expire after 1 hour)
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const checkSession = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include", // Important: include cookies
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
        fetchItems();
        fetchCategories();
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
        // Token refresh failed, redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      router.push("/login");
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

      // Ensure data is an array
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
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

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
    }
  };

  const handleToggleAvailability = async (item: Item) => {
    setTogglingItemId(item.id);
    const previousAvailability = item.isAvailable;

    // Optimistically update the UI
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
        // Revert on error
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.id === item.id ? { ...i, isAvailable: previousAvailability } : i
          )
        );
        const data = await response.json();
        alert(data.error || "Failed to update availability");
      }
    } catch (error) {
      // Revert on error
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

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  // If not authenticated, redirect will happen, but show loading as fallback
  if (!isAuthenticated) {
    return null;
  }

  const totalItems = Array.isArray(items) ? items.length : 0;
  const lowStock = Array.isArray(items)
    ? items.filter((item) => item.stock > 0 && item.stock <= 5).length
    : 0;
  const outOfStock = Array.isArray(items)
    ? items.filter((item) => item.stock === 0).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader onLogout={handleLogout} isLoggingOut={isLoggingOut} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {isLoadingItems ? (
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
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
            />
          </>
        )}
      </div>
    </div>
  );
}
