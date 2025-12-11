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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
        </div>
        <h3 className="text-slate-400 text-xs sm:text-sm mb-1">Total Items</h3>
        <p className="text-3xl sm:text-4xl font-bold text-white">{totalItems}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-slate-400 text-xs sm:text-sm mb-1">Low Stock</h3>
        <p className="text-3xl sm:text-4xl font-bold text-amber-400">{lowStock}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-slate-400 text-xs sm:text-sm mb-1">Out of Stock</h3>
        <p className="text-3xl sm:text-4xl font-bold text-red-400">{outOfStock}</p>
      </div>
    </div>
  );
}

