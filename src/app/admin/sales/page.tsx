"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import Loader from "@/components/Loader";

export default function SalesPage() {
  const router = useRouter();
  const { currentStore, loading } = useStore();

  useEffect(() => {
    if (!loading && currentStore) {
      router.replace(`/admin/${currentStore.slug}/sales`);
    }
  }, [currentStore, loading, router]);

  if (loading) {
    return <Loader />;
  }

  return null;
}
