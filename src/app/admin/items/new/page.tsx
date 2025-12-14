"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import BackButton from "../../components/BackButton";
import ItemForm from "../components/ItemForm";

export default function NewItemPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-body), sans-serif" }}
              >
                Add New Item
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2">
                Fill in the details below to add a new item to your inventory
              </p>
            </div>
            <BackButton href="/admin" />
          </div>
        </div>

        {/* Form */}
        <ItemForm mode="new" />
      </div>
    </div>
  );
}

