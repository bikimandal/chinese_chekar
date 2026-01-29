"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import { Store, Plus, Edit2, Trash2, Loader2, Check, X, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
  isActive: boolean;
}

export default function StoresPage() {
  const router = useRouter();
  const { currentStore, refreshStores, loading: storeLoading } = useStore();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminAccess();
    fetchStores();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/users/me", {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.role === "ADMIN");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else if (response.status === 403) {
        const accessibleResponse = await fetch("/api/stores/accessible", {
          credentials: "include",
          cache: "no-store",
        });
        if (accessibleResponse.ok) {
          const data = await accessibleResponse.json();
          setStores(data);
        }
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingStore ? `/api/stores/${editingStore.id}` : "/api/stores";
      const method = editingStore ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingStore(null);
        setFormData({ name: "", slug: "", isDefault: false });
        await fetchStores();
        await refreshStores();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save store");
      }
    } catch (error) {
      console.error("Error saving store:", error);
      setError("An error occurred while saving store");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (store: StoreData) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      isDefault: store.isDefault,
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (storeId: string) => {
    if (!confirm("Are you sure you want to delete this store? This will delete all associated data.")) return;

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchStores();
        await refreshStores();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete store");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("An error occurred while deleting store");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStore(null);
    setFormData({ name: "", slug: "", isDefault: false });
    setError("");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingStore ? formData.slug : generateSlug(name),
    });
  };

  if (storeLoading || loading) {
    return <Loader message="Loading stores..." />;
  }

  if (!currentStore) {
    return null;
  }

  const settingsPath = `/admin/${currentStore.slug}/settings`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-lg sm:text-2xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  {isAdmin ? "Store Management" : "My Stores"}
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
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-purple-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                {isAdmin ? "Store Management" : "My Stores"}
              </h2>
              <p className="text-sm text-slate-400">
                {isAdmin
                  ? "Manage your stores and switch between them"
                  : "View stores you have access to"}
              </p>
            </div>
            {!showForm && isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-5 h-5" />
                <span>Create Store</span>
              </button>
            )}
            {!isAdmin && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-400">View Only</span>
              </div>
            )}
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  {editingStore ? "Edit Store" : "Create New Store"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="e.g., Store 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="e.g., store-2"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    URL-friendly identifier (lowercase, hyphens only)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 bg-slate-900 border-slate-700 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isDefault" className="text-sm text-slate-300">
                    Set as default store (for public frontend)
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingStore ? "Save Changes" : "Create Store"}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border transition-all ${
                  currentStore?.id === store.id
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-slate-700/50 hover:border-purple-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-white text-lg"
                        style={{ fontFamily: "var(--font-body), sans-serif" }}
                      >
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{store.slug}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(store)}
                        className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                        title="Edit store"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!store.isDefault && (
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {store.isDefault && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                      <Check className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">
                        Default Store
                      </span>
                    </div>
                  )}
                  {!store.isActive && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                      <span className="text-xs text-red-400 font-medium">
                        Inactive
                      </span>
                    </div>
                  )}
                  {currentStore?.id === store.id && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full">
                      <span className="text-xs text-purple-400 font-medium">
                        Current Store
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {stores.length === 0 && !showForm && (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No stores found</p>
              {isAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Store</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
