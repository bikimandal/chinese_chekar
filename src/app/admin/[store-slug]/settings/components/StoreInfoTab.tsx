"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Save, Loader2 } from "lucide-react";

interface Store {
  id: string;
  name: string;
  slug: string;
  invoiceName?: string | null;
  invoiceAddress?: string | null;
  invoicePhone?: string | null;
}

interface StoreInfoTabProps {
  store: Store;
}

export default function StoreInfoTab({ store }: StoreInfoTabProps) {
  const [formData, setFormData] = useState({
    invoiceName: store.invoiceName || store.name,
    invoiceAddress: store.invoiceAddress || "",
    invoicePhone: store.invoicePhone || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Optimized: Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
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
  }, [store.id, formData]);

  return (
    <div>
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
  );
}
