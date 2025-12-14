"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";

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

interface ItemFormData {
  name: string;
  description: string;
  price: string;
  halfPlatePrice: string;
  fullPlatePrice: string;
  stock: string;
  productId: string;
  isAvailable: boolean;
  hasHalfFullPlate: boolean;
}

interface ItemFormProps {
  mode: "new" | "edit";
  itemId?: string;
  initialData?: Item;
}

export default function ItemForm({ mode, itemId, initialData }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [existingItems, setExistingItems] = useState<any[]>([]);
  // Track the last product name we used to populate the Item Name field
  const lastSyncedProductNameRef = useRef<string>("");

  const [formData, setFormData] = useState<ItemFormData>({
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
    fetchProducts();
    if (mode === "new") {
      fetchExistingItems();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && itemId && !initialData) {
      fetchItem();
    } else if (initialData) {
      loadInitialData(initialData);
    }
  }, [mode, itemId, initialData]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchExistingItems = async () => {
    try {
      const response = await fetch("/api/items?admin=true");
      if (response.ok) {
        const data = await response.json();
        setExistingItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching existing items:", error);
    }
  };

  const fetchItem = async () => {
    if (!itemId) return;
    setFetchingItem(true);
    try {
      const response = await fetch(`/api/items/${itemId}`);
      if (!response.ok) {
        setError("Item not found");
        return;
      }

      const item: Item = await response.json();
      loadInitialData(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      setError("Failed to load item data");
    } finally {
      setFetchingItem(false);
    }
  };

  const loadInitialData = (item: Item) => {
    const product = item.product;
    const hasHalfFull = product?.hasHalfFullPlate ?? false;

    // If item name matches product name, track it as synced
    if (product && item.name === product.name) {
      lastSyncedProductNameRef.current = product.name;
    } else if (product) {
      // If item name doesn't match product name, check if it matches any product name
      // This handles the case where product was updated but item wasn't
      lastSyncedProductNameRef.current = "";
    }

    setFormData({
      name: item.name,
      description: item.description || "",
      price: !hasHalfFull && product?.fullPlatePrice
        ? product.fullPlatePrice.toString()
        : !hasHalfFull
        ? item.price.toString()
        : "",
      halfPlatePrice:
        hasHalfFull && product?.halfPlatePrice
          ? product.halfPlatePrice.toString()
          : "",
      fullPlatePrice: product?.fullPlatePrice
        ? product.fullPlatePrice.toString()
        : "",
      stock: item.stock.toString(),
      productId: item.productId || item.product?.id || "",
      isAvailable: item.isAvailable,
      hasHalfFullPlate: hasHalfFull,
    });
  };

  // Filter out products that are already used in items (only for new mode)
  const availableProducts =
    mode === "new"
      ? products.filter((product) => {
          return !existingItems.some((item) => item.productId === product.id);
        })
      : products;

  // Update form when product is selected or product data changes
  useEffect(() => {
    if (formData.productId && products.length > 0) {
      const selectedProduct = products.find(
        (p) => p.id === formData.productId
      );
      if (selectedProduct) {
        const hasHalfFull = selectedProduct.hasHalfFullPlate ?? false;
        setFormData((prev) => {
          // In edit mode: Check if item name was synced with product name
          // If the current item name matches what we tracked as the synced name,
          // or if it matches the product name, update it
          let shouldUpdateName = false;
          
          if (mode === "edit") {
            // If item name matches the last synced product name, it means it was synced
            if (prev.name === lastSyncedProductNameRef.current && lastSyncedProductNameRef.current !== "") {
              shouldUpdateName = true;
            }
            // If item name matches the current product name, it's already synced
            else if (prev.name === selectedProduct.name) {
              shouldUpdateName = true;
            }
            // If we don't have a tracked synced name, check if item name matches product name
            // This handles the case where product was updated via API
            else if (lastSyncedProductNameRef.current === "" && prev.name !== "" && prev.name === selectedProduct.name) {
              shouldUpdateName = true;
            }
          } else {
            // In new mode: always update if empty or matches product name
            shouldUpdateName =
              prev.name === "" ||
              prev.name === lastSyncedProductNameRef.current ||
              prev.name === selectedProduct.name;
          }

          // Update the ref if we're updating the name
          if (shouldUpdateName) {
            lastSyncedProductNameRef.current = selectedProduct.name;
          }

          return {
            ...prev,
            // Update name only if it's still synced with product name
            name: shouldUpdateName ? selectedProduct.name : prev.name,
            description: selectedProduct.description || "",
            hasHalfFullPlate: hasHalfFull,
            halfPlatePrice:
              hasHalfFull && selectedProduct.halfPlatePrice
                ? selectedProduct.halfPlatePrice.toString()
                : "",
            fullPlatePrice: selectedProduct.fullPlatePrice
              ? selectedProduct.fullPlatePrice.toString()
              : "",
            price:
              !hasHalfFull && selectedProduct.fullPlatePrice
                ? selectedProduct.fullPlatePrice.toString()
                : hasHalfFull
                ? ""
                : prev.price,
          };
        });
      }
    }
  }, [formData.productId, products, mode]);

  // In edit mode, when products update, check if item name should be synced with product name
  useEffect(() => {
    if (mode === "edit" && formData.productId && products.length > 0 && formData.name) {
      const selectedProduct = products.find((p) => p.id === formData.productId);
      if (selectedProduct) {
        // If item name was synced with product name (tracked in ref), update it to new product name
        if (
          lastSyncedProductNameRef.current !== "" &&
          formData.name === lastSyncedProductNameRef.current &&
          selectedProduct.name !== lastSyncedProductNameRef.current
        ) {
          // Product name changed, update item name
          setFormData((prev) => ({
            ...prev,
            name: selectedProduct.name,
          }));
          lastSyncedProductNameRef.current = selectedProduct.name;
        }
        // If item name matches product name but ref is empty, sync it
        else if (
          lastSyncedProductNameRef.current === "" &&
          formData.name === selectedProduct.name
        ) {
          lastSyncedProductNameRef.current = selectedProduct.name;
        }
      }
    }
  }, [products, mode, formData.productId, formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    if (formData.hasHalfFullPlate) {
      if (
        !formData.halfPlatePrice ||
        parseFloat(formData.halfPlatePrice) <= 0
      ) {
        setError("Please enter a valid half plate price");
        setLoading(false);
        return;
      }
      if (
        !formData.fullPlatePrice ||
        parseFloat(formData.fullPlatePrice) <= 0
      ) {
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
      const url = mode === "edit" ? `/api/items/${itemId}` : "/api/items";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.hasHalfFullPlate
            ? parseFloat(formData.fullPlatePrice)
            : parseFloat(formData.price),
          stock: parseInt(formData.stock),
          productId: formData.productId,
          isAvailable: formData.isAvailable,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const data = await response.json();
        setError(
          data.error ||
            `Failed to ${mode === "edit" ? "update" : "create"} item. Please try again.`
        );
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} item:`, error);
      setError(
        `An error occurred while ${mode === "edit" ? "updating" : "creating"} the item. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching item data (edit mode)
  if (fetchingItem && mode === "edit") {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-2xl">
        <Loader message="Loading item data..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6">
          <Loader
            message={
              mode === "edit" ? "Saving changes..." : "Saving item..."
            }
          />
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
            onChange={(e) => {
              const productId = e.target.value;
              if (!productId) {
                setFormData({
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
              } else {
                setFormData({ ...formData, productId });
              }
            }}
            required
            disabled={loading}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-900 text-slate-300">
              Select a product
            </option>
            {availableProducts.map((product) => (
              <option
                key={product.id}
                value={product.id}
                className="bg-slate-900 text-white"
              >
                {product.name}
              </option>
            ))}
          </select>
          {availableProducts.length === 0 && (
            <p className="text-sm text-amber-400 mt-2">
              {products.length === 0
                ? "No products available. "
                : mode === "new"
                ? "All products have been added. "
                : "No products available. "}
              <Link
                href="/admin/product-templates"
                className="underline hover:text-amber-300"
              >
                {products.length === 0
                  ? "Create products in Product Templates"
                  : "Create more products"}
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
            style={{ fontFamily: "var(--font-body), sans-serif" }}
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
        )}

        {/* Stock Quantity */}
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
          {/* Quick Add Stock Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[10, 20, 30, 50, 100].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  const currentStock = parseInt(formData.stock) || 0;
                  setFormData({
                    ...formData,
                    stock: (currentStock + amount).toString(),
                  });
                }}
                disabled={loading}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-amber-500/50 hover:text-amber-400 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                +{amount}
              </button>
            ))}
          </div>
        </div>

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
            <div
              className={`w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 ${
                loading ? "opacity-50" : ""
              }`}
            ></div>
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
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Save Item"}
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
  );
}

