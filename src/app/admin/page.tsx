"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import Loader from "@/components/Loader";
import AdminDashboard from "./components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const { currentStore, loading: storeLoading } = useStore();

  // Redirect to store-slug route if store is available
  useEffect(() => {
    if (!storeLoading && currentStore) {
      const isOnStoreRoute = window.location.pathname.match(/^\/admin\/[^\/]+/);
      if (!isOnStoreRoute) {
        router.replace(`/admin/${currentStore.slug}`);
      }
    }
  }, [currentStore, storeLoading, router]);

  if (storeLoading) {
    return <Loader />;
  }

  return <AdminDashboard />;
}
