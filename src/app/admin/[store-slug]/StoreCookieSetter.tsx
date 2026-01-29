"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/contexts/StoreContext";

interface StoreCookieSetterProps {
  storeId: string;
}

export default function StoreCookieSetter({ storeId }: StoreCookieSetterProps) {
  const { refreshStores } = useStore();
  const hasSetCookie = useRef(false);
  
  useEffect(() => {
    // Prevent multiple calls
    if (hasSetCookie.current) return;
    
    // Set the store cookie via API route (client-side)
    const setStoreCookie = async () => {
      try {
        // Check if cookie is already set to this store
        const currentStoreId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("current-store-id="))
          ?.split("=")[1];

        // Only set if different
        if (currentStoreId !== storeId) {
          hasSetCookie.current = true;
          const response = await fetch("/api/stores/select", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ storeId }),
          });
          
          if (!response.ok) {
            hasSetCookie.current = false; // Reset on error
          }
          // Don't call refreshStores here - it causes infinite loop
          // The context will update from the URL slug
        } else {
          // Cookie already matches, just mark as done
          hasSetCookie.current = true;
        }
      } catch (error) {
        console.error("Error setting store cookie:", error);
        hasSetCookie.current = false; // Reset on error
      }
    };

    setStoreCookie();
  }, [storeId]); // Remove refreshStores from dependencies to prevent loop

  return null; // This component doesn't render anything
}
