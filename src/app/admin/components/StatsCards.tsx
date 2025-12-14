import { Package, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
}

export default function StatsCards({
  totalItems,
  lowStock,
  outOfStock,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-1.5 sm:mb-3 md:mb-4">
          <div className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Package className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
          </div>
          <BarChart3 className="w-2.5 h-2.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-600 hidden sm:block" />
        </div>
        <h3
          className="text-slate-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1 leading-tight"
          style={{ fontFamily: "var(--font-body), sans-serif" }}
        >
          Total Items
        </h3>
        <p className="text-lg sm:text-3xl md:text-4xl font-bold text-white">
          {totalItems}
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-1.5 sm:mb-3 md:mb-4">
          <div className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg sm:rounded-xl flex items-center justify-center">
            <TrendingDown className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400" />
          </div>
          <div className="w-1 h-1 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <h3
          className="text-slate-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1 leading-tight"
          style={{ fontFamily: "var(--font-body), sans-serif" }}
        >
          Low Stock
        </h3>
        <p className="text-lg sm:text-3xl md:text-4xl font-bold text-amber-400">
          {lowStock}
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-1.5 sm:mb-3 md:mb-4">
          <div className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg sm:rounded-xl flex items-center justify-center">
            <AlertCircle className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
          </div>
          <div className="w-1 h-1 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
        </div>
        <h3
          className="text-slate-400 text-[10px] sm:text-xs mb-0.5 sm:mb-1 leading-tight"
          style={{ fontFamily: "var(--font-body), sans-serif" }}
        >
          Out of Stock
        </h3>
        <p className="text-lg sm:text-3xl md:text-4xl font-bold text-red-400">
          {outOfStock}
        </p>
      </div>
    </div>
  );
}
