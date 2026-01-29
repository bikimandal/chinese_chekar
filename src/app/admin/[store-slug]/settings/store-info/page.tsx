"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Save, Loader2, Info } from "lucide-react";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";

interface Store {
  id: string;
  name: string;
  slug: string;
  invoiceName?: string | null;
  invoiceAddress?: string | null;
  invoicePhone?: string | null;
}

export default function StoreInfoPage() {
  const { currentStore, loading: storeLoading } = useStore();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    invoiceName: "",
    invoiceAddress: "",
    invoicePhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentStore && !storeLoading) {
      fetchStoreInfo();
    }
  }, [currentStore, storeLoading]);

  const fetchStoreInfo = async () => {
    if (!currentStore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/stores/${currentStore.id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setStore(data);
        setFormData({
          invoiceName: data.invoiceName || data.name,
          invoiceAddress: data.invoiceAddress || "",
          invoicePhone: data.invoicePhone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching store info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          invoiceName: formData.invoiceName,
          invoiceAddress: formData.invoiceAddress,
          invoicePhone: formData.invoicePhone,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchStoreInfo();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update store settings");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      setError("An error occurred while updating store settings");
    } finally {
      setSubmitting(false);
    }
  }, [store, formData]);

  if (storeLoading || loading) {
    return <Loader message="Loading store information..." />;
  }

  if (!currentStore || !store) {
    return null;
  }

  const settingsPath = `/admin/${currentStore.slug}/settings`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-lg sm:text-2xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Store Info
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">{currentStore.name}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <BackButton href={settingsPath} label="Back to Settings" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-blue-500/30 p-4 sm:p-6">
          <h2
            className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Invoice Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">
            Configure the name, address, and phone number that will appear on invoices for this store.
          </p>

          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs sm:text-sm">
              Store settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                Invoice Name *
              </label>
              <input
                type="text"
                value={formData.invoiceName}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceName: e.target.value })
                }
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Store Name"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                This name will appear at the top of invoices
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                Invoice Address *
              </label>
              <textarea
                value={formData.invoiceAddress}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceAddress: e.target.value })
                }
                required
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                placeholder="Store Address"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                This address will appear on invoices
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                Invoice Phone *
              </label>
              <input
                type="text"
                value={formData.invoicePhone}
                onChange={(e) =>
                  setFormData({ ...formData, invoicePhone: e.target.value })
                }
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="+91 1234567890"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-slate-500">
                This phone number will appear on invoices
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
