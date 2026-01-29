"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface ReloadButtonProps {
  onRefresh?: () => void;
}

export default function ReloadButton({ onRefresh }: ReloadButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleReload = async () => {
    // If already refreshing or in cooldown, don't do anything
    if (isRefreshing || timeRemaining > 0) {
      return;
    }

    setIsRefreshing(true);

    try {
      // Call the onRefresh callback if provided, otherwise dispatch custom event
      if (onRefresh) {
        onRefresh();
      } else {
        // Fallback to event system for backward compatibility
        window.dispatchEvent(new CustomEvent("inventory-refresh"));
      }
      
      // Wait a bit for the refresh to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      
      // Start 5-second cooldown timer
      setTimeRemaining(5);
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Start countdown
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleReload}
      disabled={isRefreshing || timeRemaining > 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isRefreshing || timeRemaining > 0
          ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
          : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer"
      }`}
      title={
        timeRemaining > 0
          ? `Please wait ${timeRemaining} second${timeRemaining > 1 ? "s" : ""} before refreshing again`
          : "Reload inventory data"
      }
    >
      <RefreshCw
        className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span className="text-sm sm:text-base">
        {isRefreshing
          ? "Refreshing..."
          : timeRemaining > 0
          ? `Wait ${timeRemaining}s`
          : "Reload"}
      </span>
    </button>
  );
}

