"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import Loader from "@/components/Loader";
import AdminDashboard from "./components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentStore, loading: storeLoading } = useStore();

  const isOnStoreRoute = pathname?.match(/^\/admin\/[^/]+/);
  const willRedirect = !storeLoading && !!currentStore && !isOnStoreRoute;

  // Redirect to store-slug route if store is available
  useEffect(() => {
    if (willRedirect) {
      router.replace(`/admin/${currentStore!.slug}`);
    }
  }, [willRedirect, currentStore, router]);

  // Keep loader until store is ready; also show loader when about to redirect to avoid flash
  if (storeLoading || willRedirect) {
    return <Loader message="Loading..." />;
  }

  return <AdminDashboard />;
}
