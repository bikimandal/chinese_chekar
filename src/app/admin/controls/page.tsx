"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Loader from "@/components/Loader";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminControlsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (data.user) {
        setIsAuthenticated(true);
        fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        console.error("Failed to fetch products:", response.status);
        setProducts([]);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid products data:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

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
    }
  };


  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Admin Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Product Templates
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                Manage product templates for your inventory
              </p>
            </div>
            <Link
              href="/admin/controls/new"
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-amber-500/30 text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sm:hidden">Add Product</span>
              <span className="hidden sm:inline">Add Product</span>
            </Link>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-6 border-b border-slate-700/50">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Product Templates ({products.length})
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              These products can be used when adding items to inventory
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-slate-400 mb-4 text-sm sm:text-base">No products found</p>
              <Link
                href="/admin/controls/new"
                className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 text-sm sm:text-base"
              >
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.isArray(products) && products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-amber-500/50 transition-all"
                  >
                    {product.image && (
                      <div className="mb-3 sm:mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 sm:h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/controls/edit/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-lg transition-all text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

