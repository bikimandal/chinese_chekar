"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface Store {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
}

interface StoreContextType {
  currentStore: Store | null;
  stores: Store[];
  loading: boolean;
  setCurrentStore: (store: Store) => void;
  refreshStores: () => Promise<void>;
  /** Hydrate from server (e.g. [store-slug] layout) to avoid loading flicker */
  hydrateFromServer: (store: Store) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      // Fetch accessible stores (not all stores)
      const response = await fetch("/api/stores/accessible", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
        
        // Get current store from URL slug first (most reliable after redirect)
        const pathname = window.location.pathname;
        const slugMatch = pathname.match(/^\/admin\/([^\/]+)/);
        let store: Store | undefined;
        
        if (slugMatch) {
          // Find store by slug from URL
          const slug = slugMatch[1];
          store = data.find((s: Store) => s.slug === slug);
        }
        
        // Fallback to cookie if URL doesn't have slug
        if (!store) {
          const currentStoreId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("current-store-id="))
            ?.split("=")[1];

          if (currentStoreId) {
            store = data.find((s: Store) => s.id === currentStoreId);
          }
        }
        
        // Final fallback: use default or first store
        if (!store && data.length > 0) {
          store = data.find((s: Store) => s.isDefault) || data[0];
        }
        
        if (store) {
          setCurrentStoreState(store);
        }
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentStore = async (store: Store) => {
    try {
      // Set store in cookie via API
      const response = await fetch("/api/stores/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ storeId: store.id }),
      });

      if (response.ok) {
        setCurrentStoreState(store);
        // Redirect to admin with store slug in URL
        const currentPath = window.location.pathname;
        // Extract the current route (remove /admin or /admin/[store-slug])
        const routePath = currentPath.replace(/^\/admin(\/[^\/]+)?/, "") || "/";
        const newPath = `/admin/${store.slug}${routePath === "/" ? "" : routePath}`;
        window.location.href = newPath;
      }
    } catch (error) {
      console.error("Error setting current store:", error);
    }
  };

  const refreshStores = useCallback(async () => {
    await fetchStores();
  }, []);

  const hydrateFromServer = useCallback((store: Store) => {
    setCurrentStoreState(store);
    setStores((prev) => (prev.some((s) => s.id === store.id) ? prev : [store, ...prev]));
    setLoading(false);
  }, []);

  // Update current store based on URL slug when pathname changes
  useEffect(() => {
    if (stores.length > 0 && pathname) {
      const slugMatch = pathname.match(/^\/admin\/([^\/]+)/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const store = stores.find((s: Store) => s.slug === slug);
        if (store && currentStore?.id !== store.id) {
          setCurrentStoreState(store);
        }
      }
    }
  }, [pathname, stores, currentStore]);

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        stores,
        loading,
        setCurrentStore,
        refreshStores,
        hydrateFromServer,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
