"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import ProductTemplatesSkeleton from "@/components/skeletons/ProductTemplatesSkeleton";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductTemplatesTab() {
  const { currentStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingProductId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const storeSlug = currentStore?.slug || "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Product Templates
          </h2>
          <p className="text-sm text-slate-400">
            Manage product templates for your inventory
          </p>
        </div>
        <Link
          href={storeSlug ? `/admin/${storeSlug}/product-templates/new` : "/admin/product-templates/new"}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {isLoadingProducts ? (
        <ProductTemplatesSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No products found</p>
          <Link
            href={storeSlug ? `/admin/${storeSlug}/product-templates/new` : "/admin/product-templates/new"}
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-amber-500/50 transition-all"
            >
              {product.image && (
                <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden bg-slate-800/50">
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
                className="text-lg font-semibold text-white mb-2 line-clamp-1"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="flex gap-2">
                <Link
                  href={storeSlug ? `/admin/${storeSlug}/product-templates/edit/${product.id}` : `/admin/product-templates/edit/${product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-lg transition-all text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingProductId === product.id}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title={deletingProductId === product.id ? "Deleting..." : "Delete"}
                >
                  {deletingProductId === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
