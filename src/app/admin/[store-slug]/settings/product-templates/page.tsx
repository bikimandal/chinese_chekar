"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/contexts/StoreContext";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2, Package, Copy, Check, X, Building2 } from "lucide-react";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";
import ProductTemplatesSkeleton from "@/components/skeletons/ProductTemplatesSkeleton";
import { showError, showSuccess, showWarning, showConfirm } from "@/lib/toast";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: string;
  name: string;
  slug: string;
}

export default function ProductTemplatesPage() {
  const { currentStore, loading: storeLoading } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [copyMode, setCopyMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [targetStoreId, setTargetStoreId] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (copyMode && showStoreModal) {
      fetchStores();
    }
  }, [copyMode, showStoreModal]);

  // Auto-scroll to modal when it opens and prevent body scroll
  useEffect(() => {
    if (showStoreModal) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Scroll to top smoothly to ensure modal is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Focus the modal after a short delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showStoreModal]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        console.error("Failed to fetch products:", response.status);
        setProducts([]);
        return;
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid products data:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchStores = async () => {
    setIsLoadingStores(true);
    try {
      const response = await fetch("/api/stores", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Filter out current store
        const otherStores = data.filter((store: Store) => store.id !== currentStore?.id);
        setStores(otherStores);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Are you sure you want to delete this product?",
      async () => {
        setDeletingProductId(id);
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            showSuccess("Product deleted successfully");
            fetchProducts();
          } else {
            const data = await response.json();
            showError(data.error || "Failed to delete product");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          showError("An error occurred while deleting the product");
        } finally {
          setDeletingProductId(null);
        }
      }
    );
  };

  const toggleCopyMode = () => {
    setCopyMode(!copyMode);
    setSelectedProducts(new Set());
    setShowStoreModal(false);
    setTargetStoreId("");
  };

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    setSelectedProducts(new Set(products.map((p) => p.id)));
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const handleCopyClick = () => {
    if (selectedProducts.size === 0) {
      showWarning("Please select at least one product to copy");
      return;
    }
    setShowStoreModal(true);
  };

  const handleCopyProducts = async () => {
    if (!targetStoreId) {
      showWarning("Please select a target store");
      return;
    }

    if (selectedProducts.size === 0) {
      showWarning("Please select at least one product to copy");
      return;
    }

    setIsCopying(true);
    try {
      const response = await fetch("/api/products/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          targetStoreId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const message = data.message || `Successfully copied ${data.copied} product(s). ${data.skipped} duplicate(s) skipped.`;
        showSuccess(message, { autoClose: 4000 });
        // Reset copy mode
        setCopyMode(false);
        setSelectedProducts(new Set());
        setShowStoreModal(false);
        setTargetStoreId("");
      } else {
        showError(data.error || "Failed to copy products");
      }
    } catch (error) {
      console.error("Error copying products:", error);
      showError("An error occurred while copying products");
    } finally {
      setIsCopying(false);
    }
  };

  if (storeLoading) {
    return <Loader message="Loading store..." />;
  }

  if (!currentStore) {
    return null;
  }

  const settingsPath = `/admin/${currentStore.slug}/settings`;
  const storeSlug = currentStore.slug;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${copyMode && selectedProducts.size > 0 ? 'pb-24' : 'pb-6'}`}>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-lg sm:text-2xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Product Templates
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
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-amber-500/30 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h2
                className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                Product Templates
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage product templates for your inventory
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {!copyMode ? (
                <>
                  <button
                    onClick={toggleCopyMode}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20 text-xs sm:text-sm"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Copy Templates</span>
                    <span className="sm:hidden">Copy</span>
                  </button>
                  <Link
                    href={`/admin/${storeSlug}/product-templates/new`}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 text-xs sm:text-sm"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={toggleCopyMode}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all text-xs sm:text-sm"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Copy Mode Controls */}
          {copyMode && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm text-blue-400 font-medium">
                  Select products to copy ({selectedProducts.size} selected)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs px-2.5 sm:px-2 py-1.5 sm:py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/30 transition-all"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-xs px-2.5 sm:px-2 py-1.5 sm:py-1 bg-slate-700/50 border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-all"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Store Selection Modal */}
          {showStoreModal && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowStoreModal(false);
                  setTargetStoreId("");
                }
              }}
            >
              <div 
                ref={modalRef}
                tabIndex={-1}
                className="bg-slate-800 rounded-lg sm:rounded-xl border border-slate-700 p-4 sm:p-6 max-w-md w-full max-h-[90vh] flex flex-col my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3
                    className="text-base sm:text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-body), sans-serif" }}
                  >
                    Select Target Store
                  </h3>
                  <button
                    onClick={() => {
                      setShowStoreModal(false);
                      setTargetStoreId("");
                    }}
                    className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                  Choose the store where you want to copy {selectedProducts.size} product(s)
                </p>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {isLoadingStores ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  ) : stores.length === 0 ? (
                    <p className="text-xs sm:text-sm text-slate-400 text-center py-8">
                      No other stores available
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stores.map((store) => (
                        <label
                          key={store.id}
                          className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                            targetStoreId === store.id
                              ? "bg-blue-500/20 border-blue-500/50"
                              : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="targetStore"
                            value={store.id}
                            checked={targetStoreId === store.id}
                            onChange={(e) => setTargetStoreId(e.target.value)}
                            className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 focus:ring-blue-500 flex-shrink-0"
                          />
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{store.name}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 truncate">{store.slug}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {stores.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-slate-700">
                    <button
                      onClick={handleCopyProducts}
                      disabled={!targetStoreId || isCopying}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isCopying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Copying...</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Products</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowStoreModal(false);
                        setTargetStoreId("");
                      }}
                      className="px-4 py-2.5 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {isLoadingProducts ? (
            <ProductTemplatesSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">No products found</p>
              <Link
                href={`/admin/${storeSlug}/product-templates/new`}
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all text-xs sm:text-sm"
              >
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-slate-900/50 border rounded-lg sm:rounded-xl p-3 sm:p-6 transition-all ${
                    copyMode
                      ? selectedProducts.has(product.id)
                        ? "border-blue-500/50 bg-blue-500/10 cursor-pointer"
                        : "border-slate-700/50 hover:border-blue-500/30 cursor-pointer"
                      : "border-slate-700/50 hover:border-amber-500/50"
                  }`}
                  onClick={copyMode ? () => toggleProductSelection(product.id) : undefined}
                >
                  {copyMode && (
                    <div className="mb-2 sm:mb-3 flex items-center justify-end">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedProducts.has(product.id)
                            ? "bg-blue-500 border-blue-500"
                            : "bg-transparent border-slate-600"
                        }`}
                      >
                        {selectedProducts.has(product.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  {product.image && (
                    <div className="mb-3 sm:mb-4 relative w-full h-40 sm:h-48 rounded-lg overflow-hidden bg-slate-800/50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        quality={60}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <h3
                    className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 line-clamp-1"
                    style={{ fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/${storeSlug}/product-templates/edit/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-lg transition-all text-xs sm:text-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      disabled={deletingProductId === product.id}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={deletingProductId === product.id ? "Deleting..." : "Delete"}
                    >
                      {deletingProductId === product.id ? (
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sticky Bottom Bar for Copy Mode */}
          {copyMode && selectedProducts.size > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-3 sm:p-4 z-40">
              <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm text-slate-300">
                    <span className="font-semibold text-blue-400">{selectedProducts.size}</span> product(s) selected
                  </p>
                </div>
                <button
                  onClick={handleCopyClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/30 text-sm"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Copy Selected</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
