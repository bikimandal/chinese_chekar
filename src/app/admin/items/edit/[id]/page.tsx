"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, X } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  hasHalfFullPlate?: boolean;
  halfPlatePrice?: number | null;
  fullPlatePrice?: number | null;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  productId?: string;
  product?: Product;
  isAvailable: boolean;
}

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    halfPlatePrice: "",
    fullPlatePrice: "",
    stock: "",
    productId: "",
    isAvailable: true,
    hasHalfFullPlate: false,
  });

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
        await Promise.all([fetchProducts(), fetchItem()]);
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
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchItem = async () => {
    setFetchingItem(true);
    try {
      const response = await fetch(`/api/items/${itemId}`);
      if (!response.ok) {
        setError("Item not found");
        return;
      }

      const item: Item = await response.json();
      const product = item.product;
      const hasHalfFull = product?.hasHalfFullPlate ?? false;
      
      setFormData({
        name: item.name,
        description: item.description || "",
        // When segregation is disabled, use fullPlatePrice as the single price
        // When enabled, clear price field (will use halfPlatePrice and fullPlatePrice)
        price: !hasHalfFull && product?.fullPlatePrice
          ? product.fullPlatePrice.toString()
          : !hasHalfFull
          ? item.price.toString()
          : "",
        // Only populate halfPlatePrice when segregation is enabled
        halfPlatePrice: hasHalfFull && product?.halfPlatePrice
          ? product.halfPlatePrice.toString()
          : "",
        // Always populate fullPlatePrice if it exists
        fullPlatePrice: product?.fullPlatePrice
          ? product.fullPlatePrice.toString()
          : "",
        stock: item.stock.toString(),
        productId: item.productId || item.product?.id || "",
        isAvailable: item.isAvailable,
        hasHalfFullPlate: hasHalfFull,
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      setError("Failed to load item data");
    } finally {
      setFetchingItem(false);
    }
  };

  // Update form when product is selected
  useEffect(() => {
    if (formData.productId && products.length > 0) {
      const selectedProduct = products.find(
        (p) => p.id === formData.productId
      );
      if (selectedProduct) {
        const hasHalfFull = selectedProduct.hasHalfFullPlate ?? false;
        setFormData((prev) => ({
          ...prev,
          name: selectedProduct.name,
          description: selectedProduct.description || "",
          hasHalfFullPlate: hasHalfFull,
          // If product has half/full plate, populate both prices and clear single price
          halfPlatePrice: hasHalfFull && selectedProduct.halfPlatePrice
            ? selectedProduct.halfPlatePrice.toString()
            : "",
          fullPlatePrice: selectedProduct.fullPlatePrice
            ? selectedProduct.fullPlatePrice.toString()
            : "",
          // If product doesn't have half/full plate, use fullPlatePrice as single price
          // Clear price field when switching to half/full plate mode
          price: !hasHalfFull && selectedProduct.fullPlatePrice
            ? selectedProduct.fullPlatePrice.toString()
            : hasHalfFull
            ? ""
            : prev.price,
        }));
      }
    }
  }, [formData.productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Item name is required");
      setLoading(false);
      return;
    }

    if (!formData.productId) {
      setError("Please select a product");
      setLoading(false);
      return;
    }

    // Validate prices based on half/full plate option
    if (formData.hasHalfFullPlate) {
      if (!formData.halfPlatePrice || parseFloat(formData.halfPlatePrice) <= 0) {
        setError("Please enter a valid half plate price");
        setLoading(false);
        return;
      }
      if (!formData.fullPlatePrice || parseFloat(formData.fullPlatePrice) <= 0) {
        setError("Please enter a valid full plate price");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Please enter a valid price");
        setLoading(false);
        return;
      }
    }

    if (formData.stock === "" || parseInt(formData.stock) < 0) {
      setError("Please enter a valid stock quantity");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.hasHalfFullPlate
            ? parseFloat(formData.halfPlatePrice)
            : parseFloat(formData.price),
          stock: parseInt(formData.stock),
          productId: formData.productId,
          isAvailable: formData.isAvailable,
        }),
      });

      if (response.ok) {
        // Success - redirect to admin page
        router.push("/admin");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setError("An error occurred while updating the item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || fetchingItem) {
    return <Loader message={isCheckingAuth ? "Checking authentication..." : "Loading item data..."} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Edit Item
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                Update the details below to modify this item
              </p>
            </div>
            <BackButton href="/admin" />
          </div>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-6">
              <Loader message="Saving changes..." />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Product Selection - At the top */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-900 text-slate-300">
                  Select a product
                </option>
                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    className="bg-slate-900 text-white"
                  >
                    {product.name}
                  </option>
                ))}
              </select>
              {products.length === 0 && (
                <p className="text-sm text-amber-400 mt-2">
                  No products available.{" "}
                  <Link
                    href="/admin/product-templates"
                    className="underline hover:text-amber-300"
                  >
                    Create products in Product Templates
                  </Link>
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                placeholder="e.g., Chicken Manchurian"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none disabled:opacity-50"
                placeholder="Brief description of the item..."
              />
            </div>

            {/* Price Fields - Dynamic based on product selection */}
            {formData.hasHalfFullPlate ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Half Plate Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.halfPlatePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, halfPlatePrice: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Plate Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fullPlatePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, fullPlatePrice: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {/* Stock Quantity - Show separately when half/full plate is enabled */}
            {formData.hasHalfFullPlate && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stock Quantity <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                  placeholder="0"
                />
              </div>
            )}

            {/* Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Available
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Item is available for order
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAvailable: e.target.checked,
                    })
                  }
                  disabled={loading}
                  className="sr-only peer disabled:opacity-50"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 disabled:opacity-50"></div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30 text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

