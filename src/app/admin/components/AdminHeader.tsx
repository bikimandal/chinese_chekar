"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/contexts/StoreContext";
import { LogOut, ShoppingCart, Receipt, Loader2, Settings, Shield, User } from "lucide-react";
import StoreStatusToggle from "./StoreStatusToggle";
import StoreSwitcher from "./StoreSwitcher";

interface AdminHeaderProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export default function AdminHeader({
  onLogout,
  isLoggingOut = false,
}: AdminHeaderProps) {
  const { currentStore } = useStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<"ADMIN" | "USER" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/users/me", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.role === "ADMIN");
        setUserRole(userData.role);
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="shrink-0">
            <h1 
              className="text-xl sm:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-body), sans-serif" }}
            >
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1 min-h-[22px]">
              <p className="text-slate-400 text-xs sm:text-sm">
                Manage your restaurant inventory
              </p>
              {/* Reserve space to avoid layout shift when role loads */}
              {loading ? (
                <div className="w-16 h-5 rounded-full bg-slate-700/30 animate-pulse" aria-hidden />
              ) : userRole ? (
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === "ADMIN"
                    ? "bg-red-500/10 border border-red-500/30 text-red-400"
                    : "bg-slate-500/10 border border-slate-500/30 text-slate-400"
                }`}>
                  {userRole === "ADMIN" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  <span>{userRole}</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto order-1 sm:order-none">
              <StoreStatusToggle />
            </div>
            <div className="w-full sm:w-auto order-2 sm:order-none">
              <StoreSwitcher />
            </div>
            <Link
              href={currentStore ? `/admin/${currentStore.slug}/live-sell` : "/admin/live-sell"}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Live Sell</span>
              <span className="sm:hidden">Sell</span>
            </Link>
            <Link
              href={currentStore ? `/admin/${currentStore.slug}/sales` : "/admin/sales"}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Sales</span>
              <span className="sm:hidden">Sales</span>
            </Link>
            <Link
              href={currentStore ? `/admin/${currentStore.slug}/settings` : "/admin/settings"}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500/50 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </Link>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Logging out...</span>
                  <span className="sm:hidden">Exiting...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
