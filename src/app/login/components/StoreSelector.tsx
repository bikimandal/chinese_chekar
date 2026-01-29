"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Store {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
}

export default function StoreSelector() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingStoreId, setSelectingStoreId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      // Fetch stores that user has access to (filtered by backend)
      const response = await fetch("/api/stores/accessible", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);

        // Check if there's already a selected store in cookie
        const currentStoreId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("current-store-id="))
          ?.split("=")[1];

        // If only one store and no store is selected, auto-select it for convenience
        if (data.length === 1 && !currentStoreId) {
          handleStoreSelect(data[0].id);
        }
      } else {
        setError("Failed to load stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setError("An error occurred while loading stores");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = async (storeId: string) => {
    setSelectingStoreId(storeId);
    setError("");

    try {
      const response = await fetch("/api/stores/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ storeId }),
      });

      if (response.ok) {
        // Get store slug for URL
        const selectedStore = stores.find((s) => s.id === storeId);
        if (selectedStore) {
          // Redirect to admin panel with store slug
          router.push(`/admin/${selectedStore.slug}`);
        } else {
          router.push("/admin");
        }
      } else {
        const data = await response.json();
        setError(data.error || "Failed to select store");
        setSelectingStoreId(null);
      }
    } catch (error) {
      console.error("Error selecting store:", error);
      setError("An error occurred while selecting store");
      setSelectingStoreId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-300 text-sm">Loading stores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 shadow-2xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-red-400 font-semibold">No stores available</p>
            <p className="text-slate-400 text-sm">
              Please contact an administrator to create a store.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full mb-4">
            <Store className="w-8 h-8 text-amber-400" />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Select Store
          </h2>
          <p className="text-slate-400 text-sm">
            Choose which store you want to manage
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {stores.map((store) => {
            const isSelecting = selectingStoreId === store.id;
            // Get current store from cookie
            const currentStoreId = document.cookie
              .split("; ")
              .find((row) => row.startsWith("current-store-id="))
              ?.split("=")[1];
            const isCurrentStore = currentStoreId === store.id;
            
            return (
              <motion.button
                key={store.id}
                onClick={() => handleStoreSelect(store.id)}
                disabled={selectingStoreId !== null}
                className={`w-full p-4 rounded-xl transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrentStore
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500/50"
                    : "bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-slate-700/70 hover:to-slate-800/70 border border-slate-600/50 hover:border-amber-500/50"
                }`}
                whileHover={selectingStoreId === null ? { scale: 1.02 } : {}}
                whileTap={selectingStoreId === null ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-orange-600/30 transition-colors">
                      <Store className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-white group-hover:text-amber-400 transition-colors"
                        style={{ fontFamily: "var(--font-body), sans-serif" }}
                      >
                        {store.name}
                      </h3>
                      {store.isDefault && (
                        <p className="text-xs text-amber-400/70 mt-0.5">
                          Default Store
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelecting ? (
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  ) : isCurrentStore ? (
                    <Check className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Check className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
