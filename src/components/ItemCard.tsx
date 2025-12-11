import Image from "next/image";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";

interface ItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
  isAvailable?: boolean;
}

export default function ItemCard({
  name,
  description,
  price,
  stock,
  image,
  category,
  isAvailable = true,
}: ItemCardProps) {
  const getStockStatus = () => {
    if (!isAvailable) {
      return {
        text: "Not Available",
        color: "from-gray-500 to-gray-600",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/30",
        textColor: "text-gray-400",
        icon: AlertCircle,
      };
    }
    if (stock === 0) {
      return {
        text: "Sold Out",
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-400",
        icon: AlertCircle,
      };
    } else if (stock <= 5) {
      return {
        text: "Limited",
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-400",
        icon: TrendingUp,
      };
    } else {
      return {
        text: "Available",
        color: "from-emerald-500 to-green-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-400",
        icon: Sparkles,
      };
    }
  };

  const status = getStockStatus();
  const StatusIcon = status.icon;

  return (
    <div
      className={`group relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-500 ${
        !isAvailable
          ? "border-slate-700/30 opacity-60 grayscale hover:border-slate-600/50"
          : "border-slate-700/50 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2"
      }`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              loading="eager"
              className={`object-cover transition-all duration-700 ${
                isAvailable
                  ? "group-hover:scale-110 group-hover:rotate-1"
                  : "opacity-50"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Multiple gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm text-slate-600">
            <svg
              className="w-16 h-16 mb-3 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm italic">Image coming soon</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg">
          <span className="text-xs font-medium text-slate-300">{category}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`relative px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border rounded-lg ${status.borderColor} ${status.bgColor} flex items-center gap-1.5 shadow-lg`}
          >
            <StatusIcon className={`w-3.5 h-3.5 ${status.textColor}`} />
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${status.textColor}`}
            >
              {status.text}
            </span>
            {stock > 0 && stock <= 5 && (
              <div className="relative ml-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${status.color} animate-pulse`}
                ></div>
                <div
                  className={`absolute inset-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${status.color} animate-ping`}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start gap-3">
          <h3
            className={`text-xl font-bold line-clamp-2 flex-1 transition-all duration-300 ${
              isAvailable
                ? "text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-orange-200 group-hover:bg-clip-text"
                : "text-slate-500"
            }`}
          >
            {name}
          </h3>
          <div className="flex flex-col items-end">
            <span
              className={`text-2xl font-bold ${
                isAvailable
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                  : "text-slate-600"
              }`}
            >
              ₹{price}
            </span>
            <span className="text-xs text-slate-500">per serving</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p
            className={`text-sm leading-relaxed line-clamp-2 min-h-[40px] ${
              isAvailable ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}

        {/* Stock Information */}
        {isAvailable && (
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                    status.color
                  } ${stock > 0 ? "animate-pulse" : ""}`}
                ></div>
                <span className="text-xs text-slate-500 font-medium">
                  Stock Level
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${
                    stock > 5
                      ? "text-white"
                      : stock > 0
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {stock}
                </span>
                <span className="text-xs text-slate-500">units</span>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${status.color} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
              >
                <div className="h-full w-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Hint */}
        {isAvailable && stock > 0 && (
          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center py-2 px-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg">
              <span className="text-xs text-amber-300 font-medium">
                Available for order
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"></div>
      </div>
    </div>
  );
}
