import Link from "next/link";
import { Package, LogOut, ShoppingCart, Receipt, Loader2 } from "lucide-react";
import StoreStatusToggle from "./StoreStatusToggle";

interface AdminHeaderProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export default function AdminHeader({
  onLogout,
  isLoggingOut = false,
}: AdminHeaderProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage your restaurant inventory
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto order-1 sm:order-none">
              <StoreStatusToggle />
            </div>
            <Link
              href="/admin/live-sell"
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Live Sell</span>
              <span className="sm:hidden">Sell</span>
            </Link>
            <Link
              href="/admin/sales"
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Sales</span>
              <span className="sm:hidden">Sales</span>
            </Link>
            <Link
              href="/admin/product-templates"
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-xl transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Product Templates</span>
              <span className="sm:hidden">Products</span>
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
