"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/contexts/StoreContext";
import Loader from "@/components/Loader";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStore, loading } = useStore();

  useEffect(() => {
    if (!loading && currentStore) {
      router.replace(`/admin/${currentStore.slug}/live-sell/checkout`);
    }
  }, [currentStore, loading, router]);

  if (loading) {
    return <Loader />;
  }

  return null;
}
