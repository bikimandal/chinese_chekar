"use client";

import { useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import Loader from "@/components/Loader";
import AdminDashboard from "../components/AdminDashboard";

export default function StoreAdminPage() {
  const { currentStore, loading: storeLoading } = useStore();

  // Show loader while store is loading
  if (storeLoading) {
    return <Loader message="Loading store..." />;
  }

  return <AdminDashboard />;
}
