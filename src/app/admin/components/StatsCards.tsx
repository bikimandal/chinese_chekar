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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <BarChart3 className="w-5 h-5 text-slate-600" />
        </div>
        <h3 className="text-slate-400 text-sm mb-1">Total Items</h3>
        <p className="text-4xl font-bold text-white">{totalItems}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-amber-400" />
          </div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-slate-400 text-sm mb-1">Low Stock</h3>
        <p className="text-4xl font-bold text-amber-400">{lowStock}</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-slate-400 text-sm mb-1">Out of Stock</h3>
        <p className="text-4xl font-bold text-red-400">{outOfStock}</p>
      </div>
    </div>
  );
}

