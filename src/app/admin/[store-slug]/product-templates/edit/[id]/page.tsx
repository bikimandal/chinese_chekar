"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import BackButton from "../../../../components/BackButton";
import ProductForm from "../../components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const storeSlug = params["store-slug"] as string;
  const productId = params.id as string;

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

  if (isCheckingAuth) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
              Edit Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 truncate">
              Update product template
            </p>
          </div>
          <BackButton href={`/admin/${storeSlug}/settings/product-templates`} label="Back" />
        </div>

        {/* Form Card */}
        <ProductForm mode="edit" productId={productId} />
      </div>
    </div>
  );
}

