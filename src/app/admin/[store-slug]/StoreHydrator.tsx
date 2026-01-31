"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/contexts/StoreContext";

interface StoreHydratorProps {
  store: { id: string; name: string; slug: string; isDefault: boolean };
}

/** Hydrates StoreContext with server-side store to avoid loading flicker on [store-slug] routes */
export default function StoreHydrator({ store }: StoreHydratorProps) {
  const { hydrateFromServer } = useStore();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrateFromServer(store);
  }, [store, hydrateFromServer]);

  return null;
}
