"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Settings, Store, Users, Package, Building2, Info } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";
import BackButton from "../../components/BackButton";

interface SettingOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: {
    bg: string;
    border: string;
    text: string;
    hover: string;
    iconBg: string;
  };
  adminOnly?: boolean;
}

export default function SettingsPage() {
  const { currentStore, loading } = useStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/users/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.role === "ADMIN");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (loading || checkingAdmin) {
    return <Loader />;
  }

  if (!currentStore) {
    return null;
  }

  const settingsOptions: SettingOption[] = [
    {
      id: "store-info",
      label: "Store Info",
      description: "Configure invoice details and store information",
      icon: Info,
      href: `/admin/${currentStore.slug}/settings/store-info`,
      color: {
        bg: "from-blue-500/10 to-indigo-600/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        hover: "hover:from-blue-500/20 hover:to-indigo-600/20 hover:border-blue-500/50",
        iconBg: "from-blue-500/20 to-indigo-600/20",
      },
    },
    ...(isAdmin
      ? [
          {
            id: "stores",
            label: "Stores",
            description: "Manage all stores and their settings",
            icon: Building2,
            href: `/admin/${currentStore.slug}/settings/stores`,
            color: {
              bg: "from-purple-500/10 to-pink-600/10",
              border: "border-purple-500/30",
              text: "text-purple-400",
              hover: "hover:from-purple-500/20 hover:to-pink-600/20 hover:border-purple-500/50",
              iconBg: "from-purple-500/20 to-pink-600/20",
            },
            adminOnly: true,
          } as SettingOption,
          {
            id: "users",
            label: "Users",
            description: "Manage user accounts and permissions",
            icon: Users,
            href: `/admin/${currentStore.slug}/settings/users`,
            color: {
              bg: "from-emerald-500/10 to-teal-600/10",
              border: "border-emerald-500/30",
              text: "text-emerald-400",
              hover: "hover:from-emerald-500/20 hover:to-teal-600/20 hover:border-emerald-500/50",
              iconBg: "from-emerald-500/20 to-teal-600/20",
            },
            adminOnly: true,
          } as SettingOption,
        ]
      : []),
    {
      id: "product-templates",
      label: "Product Templates",
      description: "Manage product templates and configurations",
      icon: Package,
      href: `/admin/${currentStore.slug}/settings/product-templates`,
      color: {
        bg: "from-amber-500/10 to-orange-600/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        hover: "hover:from-amber-500/20 hover:to-orange-600/20 hover:border-amber-500/50",
        iconBg: "from-amber-500/20 to-orange-600/20",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-4">
      <div className="container mx-auto px-2.5 sm:px-4 py-2.5 sm:py-6 max-w-6xl">
        {/* Header - Compact for Mobile */}
        <div className="mb-3 sm:mb-8">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 mb-2 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-base sm:text-2xl font-bold text-white truncate"
                  style={{ fontFamily: "var(--font-body), sans-serif" }}
                >
                  Settings
                </h1>
                <p className="text-[9px] sm:text-xs text-slate-400 truncate">{currentStore.name}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <BackButton href={`/admin/${currentStore.slug}`} />
            </div>
          </div>
        </div>

        {/* Settings List - Compact Horizontal Layout for Mobile */}
        <div className="space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:gap-6 sm:space-y-0">
          {settingsOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                href={option.href}
                className={`group relative bg-gradient-to-br ${option.color.bg} backdrop-blur-sm rounded-lg sm:rounded-xl border ${option.color.border} p-2.5 sm:p-6 transition-all duration-300 ${option.color.hover} cursor-pointer flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-0`}
              >
                {/* Mobile: Horizontal Layout */}
                <div className="flex items-center gap-2.5 flex-1 sm:flex-col sm:items-start sm:flex-none">
                  <div className={`w-9 h-9 sm:w-14 sm:h-14 bg-gradient-to-br ${option.color.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 sm:w-7 sm:h-7 ${option.color.text}`} />
                  </div>
                  <div className="flex-1 min-w-0 sm:flex-none sm:w-full sm:mt-4">
                    <h3
                      className={`text-sm sm:text-xl font-bold ${option.color.text} mb-0.5 sm:mb-2 truncate`}
                      style={{ fontFamily: "var(--font-body), sans-serif" }}
                    >
                      {option.label}
                    </h3>
                    <p className="text-[10px] sm:text-sm text-slate-400 line-clamp-1 sm:line-clamp-none sm:flex-1 hidden sm:block">
                      {option.description}
                    </p>
                  </div>
                </div>
                {/* Arrow for Mobile */}
                <div className="flex-shrink-0 sm:hidden">
                  <span className={`text-xs ${option.color.text} group-hover:translate-x-0.5 transition-transform`}>→</span>
                </div>
                {/* Desktop: Configure Text */}
                <div className="hidden sm:flex items-center gap-2 mt-4 text-xs sm:text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                  <span>Configure</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
