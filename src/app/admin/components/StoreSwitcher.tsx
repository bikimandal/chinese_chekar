"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Store as StoreIcon, ChevronDown, Loader2 } from "lucide-react";

export default function StoreSwitcher() {
  const { currentStore, stores, loading, setCurrentStore } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [switchingStoreId, setSwitchingStoreId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".store-switcher")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleStoreSwitch = async (store: typeof currentStore) => {
    if (!store || store.id === currentStore?.id) {
      setIsOpen(false);
      return;
    }

    setSwitchingStoreId(store.id);
    try {
      await setCurrentStore(store);
      setIsOpen(false);
    } catch (error) {
      console.error("Error switching store:", error);
    } finally {
      setSwitchingStoreId(null);
    }
  };

  if (loading || !currentStore || stores.length <= 1) {
    return null; // Don't show switcher if loading, no store, or only one store
  }

  return (
    <div className="relative store-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-xl transition-all duration-300 text-sm sm:text-base"
        disabled={switchingStoreId !== null}
      >
        <StoreIcon className="w-4 h-4" />
        <span className="hidden sm:inline max-w-[120px] truncate">
          {currentStore.name}
        </span>
        <span className="sm:hidden max-w-[80px] truncate">
          {currentStore.name}
        </span>
        {currentStore.isDefault && (
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
            Default
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 mt-2 w-56 sm:w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-xs text-slate-400 px-3 py-2 mb-1">
              Switch Store
            </div>
            <div className="max-h-64 overflow-y-auto">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSwitch(store)}
                  disabled={switchingStoreId !== null}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                    store.id === currentStore.id
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <StoreIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate font-medium">{store.name}</span>
                    {store.isDefault && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  {switchingStoreId === store.id && (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  )}
                  {store.id === currentStore.id && switchingStoreId !== store.id && (
                    <span className="text-xs text-amber-400 shrink-0">Current</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
