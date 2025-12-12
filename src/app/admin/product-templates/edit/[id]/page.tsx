"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, X, Upload } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import BackButton from "../../../components/BackButton";
import CustomToggle from "@/components/CustomToggle";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  hasHalfFullPlate?: boolean;
  halfPlatePrice?: number | null;
  fullPlatePrice?: number | null;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    hasHalfFullPlate: true,
    halfPlatePrice: "",
    fullPlatePrice: "",
    price: "", // Single price when hasHalfFullPlate is false
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        await fetchProduct();
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

  const fetchProduct = async () => {
    setFetchingProduct(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        setError("Product not found");
        return;
      }

      const product: Product = await response.json();
      const hasHalfFull = product.hasHalfFullPlate ?? true;
      setFormData({
        name: product.name,
        description: product.description || "",
        image: product.image || "",
        hasHalfFullPlate: hasHalfFull,
        halfPlatePrice: product.halfPlatePrice?.toString() || "",
        fullPlatePrice: product.fullPlatePrice?.toString() || "",
        price: hasHalfFull ? "" : (product.fullPlatePrice?.toString() || ""), // Use fullPlatePrice as price when checkbox is off
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product data");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Store the file for later upload
    setSelectedImageFile(file);
    setError("");

    // Create preview using FileReader
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
      if (!formData.halfPlatePrice || parseFloat(formData.halfPlatePrice) <= 0) {
        setError("Half plate price is required and must be greater than 0");
        setLoading(false);
        return;
      }
      if (!formData.fullPlatePrice || parseFloat(formData.fullPlatePrice) <= 0) {
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

    // Upload image if a new file was selected
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
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          description: formData.description || "",
          image: imageUrl,
          hasHalfFullPlate: formData.hasHalfFullPlate,
          halfPlatePrice: formData.hasHalfFullPlate && formData.halfPlatePrice ? parseFloat(formData.halfPlatePrice) : null,
          fullPlatePrice: formData.hasHalfFullPlate && formData.fullPlatePrice ? parseFloat(formData.fullPlatePrice) : (formData.price ? parseFloat(formData.price) : null),
        }),
      });

      if (response.ok) {
        // Success - redirect to controls page
        router.push("/admin/product-templates");
      } else {
        const data = await response.json();
        const errorMessage = data.details
          ? `${data.error}${data.message ? `: ${data.message}` : ""}`
          : data.error || "Failed to update product. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("An error occurred while updating the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || fetchingProduct) {
    return <Loader message={isCheckingAuth ? "Checking authentication..." : "Loading product data..."} />;
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
                Edit Product
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                Update the details below to modify this product template
              </p>
            </div>
            <BackButton href="/admin/product-templates" label="Back" />
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
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
                value={formData.description ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, description: e.target.value }));
                }}
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none disabled:opacity-50"
                placeholder="Brief description of the product..."
              />
            </div>

            {/* Half/Full Plate Option */}
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
              <CustomToggle
                checked={formData.hasHalfFullPlate}
                onChange={(isChecked) => {
                  setFormData((prev) => ({
                    ...prev,
                    hasHalfFullPlate: isChecked,
                    // When unchecking, populate price with fullPlatePrice if it exists
                    price: !isChecked && prev.fullPlatePrice ? prev.fullPlatePrice : prev.price,
                    // When checking, clear price field
                    ...(isChecked ? { price: "" } : {}),
                  }));
                }}
                disabled={loading}
                label="Half plate / Full plate segregation available"
                description="If enabled, customers can order this product in both half and full plate sizes"
              />

              {formData.hasHalfFullPlate ? (
                <div className="mt-4 ml-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Half Plate Price <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.halfPlatePrice ?? ""}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, halfPlatePrice: e.target.value }));
                      }}
                      required={formData.hasHalfFullPlate}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                      placeholder="e.g., 120.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Plate Price <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.fullPlatePrice ?? ""}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, fullPlatePrice: e.target.value }));
                      }}
                      required={formData.hasHalfFullPlate}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                      placeholder="e.g., 200.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 ml-8">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price ?? ""}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, price: e.target.value }));
                    }}
                    required={!formData.hasHalfFullPlate}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50"
                    placeholder="e.g., 200.00"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    This price will be used as the full plate price
                  </p>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Image
              </label>
              <div className="space-y-4">
                <label className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-amber-500/50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <Upload className="w-5 h-5" />
                  <span>Select Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={loading || uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400">
                  Supported formats: JPG, PNG, GIF, WebP (Max 5MB). Image will be uploaded when you save the product.
                </p>
                {(imagePreview || formData.image) && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || formData.image || ""}
                      alt="Preview"
                      className="w-full sm:max-w-xs max-h-48 sm:max-h-48 rounded-xl border border-slate-700 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageFile(null);
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      disabled={loading}
                      className="mt-2 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
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
                href="/admin/product-templates"
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

