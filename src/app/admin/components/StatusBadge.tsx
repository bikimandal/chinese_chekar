import { Item } from "../types";

interface StatusBadgeProps {
  item: Item;
  isToggling: boolean;
}

export default function StatusBadge({ item, isToggling }: StatusBadgeProps) {
  if (isToggling) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-700/50 border border-slate-600/30">
        <div className="h-3 w-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-300">Updating...</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
        !item.isAvailable
          ? "bg-gray-500/10 text-gray-400 border border-gray-500/30"
          : item.stock === 0
          ? "bg-red-500/10 text-red-400 border border-red-500/30"
          : item.stock <= 5
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          !item.isAvailable
            ? "bg-gray-400"
            : item.stock === 0
            ? "bg-red-400"
            : item.stock <= 5
            ? "bg-amber-400 animate-pulse"
            : "bg-emerald-400"
        }`}
      ></div>
      {!item.isAvailable
        ? "Not Available"
        : item.stock === 0
        ? "Out of Stock"
        : item.stock <= 5
        ? "Low Stock"
        : "Available"}
    </span>
  );
}

