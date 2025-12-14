"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import CustomToggle from "@/components/CustomToggle";

interface ProductFormData {
  name: string;
  description: string;
  image: string;
  hasHalfFullPlate: boolean;
  halfPlatePrice: string;
  fullPlatePrice: string;
  price: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  hasHalfFullPlate?: boolean;
  halfPlatePrice?: number | null;
  fullPlatePrice?: number | null;
}

interface ProductFormProps {
  mode: "new" | "edit";
  productId?: string;
  initialData?: Product;
}

export default function ProductForm({
  mode,
  productId,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    image: "",
    hasHalfFullPlate: true,
    halfPlatePrice: "",
    fullPlatePrice: "",
    price: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && productId && !initialData) {
      fetchProduct();
    } else if (initialData) {
      loadInitialData(initialData);
    }
  }, [mode, productId, initialData]);

  const fetchProduct = async () => {
    if (!productId) return;
    setFetchingProduct(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        setError("Product not found");
        return;
      }

      const product: Product = await response.json();
      loadInitialData(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product data");
    } finally {
      setFetchingProduct(false);
    }
  };

  const loadInitialData = (product: Product) => {
    const hasHalfFull = product.hasHalfFullPlate ?? true;
    setFormData({
      name: product.name,
      description: product.description || "",
      image: product.image || "",
      hasHalfFullPlate: hasHalfFull,
      halfPlatePrice: product.halfPlatePrice?.toString() || "",
      fullPlatePrice: product.fullPlatePrice?.toString() || "",
      price: hasHalfFull ? "" : (product.fullPlatePrice?.toString() || ""),
    });
    if (product.image) {
      setImagePreview(product.image);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedImageFile(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const productName = String(formData.name || "").trim();

    if (!productName) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (formData.hasHalfFullPlate) {
      if (
        !formData.halfPlatePrice ||
        parseFloat(formData.halfPlatePrice) <= 0
      ) {
        setError("Half plate price is required and must be greater than 0");
        setLoading(false);
        return;
      }
      if (
        !formData.fullPlatePrice ||
        parseFloat(formData.fullPlatePrice) <= 0
      ) {
        setError("Full plate price is required and must be greater than 0");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Price is required and must be greater than 0");
        setLoading(false);
        return;
      }
    }

    let imageUrl = formData.image || "";

    if (selectedImageFile) {
      setUploadingImage(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedImageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok && uploadData.url) {
          imageUrl = uploadData.url;
        } else {
          const errorMessage = uploadData.details
            ? `${uploadData.error}: ${uploadData.details}`
            : uploadData.error || "Failed to upload image";
          setError(errorMessage);
          setLoading(false);
          setUploadingImage(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("An error occurred while uploading the image");
        setLoading(false);
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    try {
      const url =
        mode === "edit"
          ? `/api/products/${productId}`
          : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          description: formData.description || "",
          image: imageUrl,
          hasHalfFullPlate: formData.hasHalfFullPlate,
          halfPlatePrice:
            formData.hasHalfFullPlate && formData.halfPlatePrice
              ? parseFloat(formData.halfPlatePrice)
              : null,
          fullPlatePrice:
            formData.hasHalfFullPlate && formData.fullPlatePrice
              ? parseFloat(formData.fullPlatePrice)
              : formData.price
              ? parseFloat(formData.price)
              : null,
        }),
      });

      if (response.ok) {
        // Wait a brief moment to ensure DB save is complete before redirecting
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push("/admin/product-templates");
      } else {
        const data = await response.json();
        const errorMessage = data.details
          ? `${data.error}${data.message ? `: ${data.message}` : ""}`
          : data.error ||
            `Failed to ${mode === "edit" ? "update" : "create"} product. Please try again.`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} product:`, error);
      setError(
        `An error occurred while ${mode === "edit" ? "updating" : "creating"} the product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching product data (edit mode)
  if (fetchingProduct && mode === "edit") {
    return (
      <div className="bg-slate-800/40 backdrop-blur rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden p-8">
        <Loader message="Loading product data..." />
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden">
      {error && (
        <div className="p-3 sm:p-4 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-4 sm:p-6">
          <Loader message={mode === "edit" ? "Saving changes..." : "Saving product..."} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Image Section - Full width on mobile, left column on desktop */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2 sm:mb-3">
              Product Image
            </label>

            {imagePreview || formData.image ? (
              <div className="relative group">
                <img
                  src={imagePreview || formData.image || ""}
                  alt="Preview"
                  className="w-full aspect-square sm:aspect-square rounded-lg sm:rounded-xl border border-slate-700 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Mobile: Show button below image */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImageFile(null);
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  disabled={loading}
                  className="mt-2 w-full sm:w-auto sm:absolute sm:top-2 sm:right-2 p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-all sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sm:hidden">Remove Image</span>
                </button>
              </div>
            ) : (
              <label className="block w-full aspect-square border-2 border-dashed border-slate-700 rounded-lg sm:rounded-xl hover:border-amber-500/50 transition-all cursor-pointer bg-slate-900/30 flex flex-col items-center justify-center gap-2 sm:gap-3 group active:scale-[0.98]">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500/10 transition-all">
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-amber-500 transition-all" />
                </div>
                <div className="text-center px-4">
                  <p className="text-xs sm:text-sm font-medium text-slate-400 group-hover:text-white transition-all">
                    Tap to upload
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                    Max 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={loading || uploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                placeholder="e.g., Chicken Manchurian"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                rows={3}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none disabled:opacity-50"
                placeholder="Brief description..."
              />
            </div>

            {/* Pricing Section */}
            <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-3 sm:p-4">
              <CustomToggle
                checked={formData.hasHalfFullPlate}
                onChange={(isChecked) => {
                  setFormData((prev) => ({
                    ...prev,
                    hasHalfFullPlate: isChecked,
                    price:
                      !isChecked && prev.fullPlatePrice
                        ? prev.fullPlatePrice
                        : prev.price,
                    ...(isChecked ? { price: "" } : {}),
                  }));
                }}
                disabled={loading}
                label="Half/Full Plate Options"
                description="Allow customers to choose plate size"
              />

              <div className="mt-3 sm:mt-4 pl-0 sm:pl-8">
                {formData.hasHalfFullPlate ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                        Half Plate <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.halfPlatePrice ?? ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              halfPlatePrice: e.target.value,
                            }));
                          }}
                          required={formData.hasHalfFullPlate}
                          disabled={loading}
                          className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                          placeholder="120.00"
                        />
                      </div>
                      {/* Quick Add Price Buttons */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[30, 40, 50, 100].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              const currentPrice = parseFloat(formData.halfPlatePrice) || 0;
                              setFormData({
                                ...formData,
                                halfPlatePrice: (currentPrice + amount).toString(),
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
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                        Full Plate <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fullPlatePrice ?? ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              fullPlatePrice: e.target.value,
                            }));
                          }}
                          required={formData.hasHalfFullPlate}
                          disabled={loading}
                          className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                          placeholder="200.00"
                        />
                      </div>
                      {/* Quick Add Price Buttons */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[30, 40, 50, 100].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              const currentPrice = parseFloat(formData.fullPlatePrice) || 0;
                              setFormData({
                                ...formData,
                                fullPlatePrice: (currentPrice + amount).toString(),
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
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price ?? ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }));
                        }}
                        required={!formData.hasHalfFullPlate}
                        disabled={loading}
                        className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                        placeholder="200.00"
                      />
                    </div>
                    {/* Quick Add Price Buttons */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[30, 40, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            const currentPrice = parseFloat(formData.price) || 0;
                            setFormData({
                              ...formData,
                              price: (currentPrice + amount).toString(),
                            });
                          }}
                          disabled={loading}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-amber-500/50 hover:text-amber-400 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          +{amount}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-2">
                      Single price for this product
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Stack on mobile, side by side on desktop */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 text-sm sm:text-base active:scale-[0.98]"
          >
            {loading || uploadingImage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading || uploadingImage
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Save Product"}
          </button>
          <Link
            href="/admin/product-templates"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all text-sm sm:text-base active:scale-[0.98]"
          >
            <X className="w-4 h-4" />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

