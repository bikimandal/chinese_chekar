"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Upload } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
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
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          description: formData.description || "",
          image: imageUrl,
        }),
      });

      if (response.ok) {
        // Success - redirect to controls page
        router.push("/admin/controls");
      } else {
        const data = await response.json();
        const errorMessage = data.details
          ? `${data.error}${data.message ? `: ${data.message}` : ""}`
          : data.error || "Failed to create product. Please try again.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("An error occurred while creating the product. Please try again.");
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/admin/controls"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Product Templates</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
            Add New Product
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
            Fill in the details below to create a new product template
          </p>
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
              <Loader message="Saving product..." />
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
                {loading ? "Saving..." : "Save Product"}
              </button>
              <Link
                href="/admin/controls"
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

