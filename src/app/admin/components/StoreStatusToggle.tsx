"use client";

import { useState, useEffect } from "react";
import { Store, Clock } from "lucide-react";

interface StoreStatus {
  id: string;
  isOpen: boolean;
  message?: string;
  updatedAt: string;
}

export default function StoreStatusToggle() {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/store-status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching store status:", errorData);
        // Set default status if API fails
        setStatus({
          id: "default",
          isOpen: true,
          message: "We are currently closed. Please check back later!",
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching store status:", error);
      // Set default status if fetch fails
      setStatus({
        id: "default",
        isOpen: true,
        message: "We are currently closed. Please check back later!",
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleToggle = async () => {
    if (!status) return;
    
    setIsToggling(true);
    try {
      const response = await fetch("/api/store-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isOpen: !status.isOpen,
        }),
      });

      if (response.ok) {
        const updatedStatus = await response.json();
        setStatus(updatedStatus);
      } else {
        alert("Failed to update store status");
      }
    } catch (error) {
      console.error("Error updating store status:", error);
      alert("An error occurred while updating store status");
    } finally {
      setIsToggling(false);
    }
  };

  if (!status) {
    return (
      <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
      <div className="flex items-center gap-2">
        <Store className={`w-4 h-4 ${status.isOpen ? "text-emerald-400" : "text-gray-400"}`} />
        <span className="text-sm font-medium text-slate-300">
          {status.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
          status.isOpen ? "bg-emerald-500" : "bg-gray-600"
        }`}
        title={
          status.isOpen
            ? "Click to mark as Closed"
            : "Click to mark as Open"
        }
      >
        {isToggling ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </span>
        ) : (
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              status.isOpen ? "translate-x-6" : "translate-x-1"
            }`}
          />
        )}
      </button>
    </div>
  );
}

