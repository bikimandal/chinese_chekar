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
  product?: {
    hasHalfFullPlate?: boolean;
    halfPlatePrice?: number | null;
    fullPlatePrice?: number | null;
  } | null;
}

export default function ItemCard({
  name,
  description,
  price,
  stock,
  image,
  category,
  isAvailable = true,
  product,
}: ItemCardProps) {
  // Determine display price and full plate price
  const hasHalfFull = product?.hasHalfFullPlate ?? false;
  const displayPrice =
    hasHalfFull && product?.halfPlatePrice
      ? product.halfPlatePrice
      : product?.fullPlatePrice ?? price;
  const fullPlatePrice =
    hasHalfFull && product?.fullPlatePrice ? product.fullPlatePrice : null;
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
      className={`group relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 flex flex-row sm:flex-col ${
        !isAvailable
          ? "border-slate-700/30 opacity-60 grayscale hover:border-slate-600/50"
          : "border-slate-700/50 hover:border-amber-500/50 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 sm:hover:-translate-y-2"
      }`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full hidden sm:block"></div>

      {/* Image Container */}
      <div className="relative w-32 h-32 sm:w-full sm:h-48 md:h-56 overflow-hidden bg-slate-900 shrink-0">
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

        {/* Ribbon Badge on Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden z-10">
          <div
            className={`absolute w-28 sm:w-32 h-5 sm:h-6 flex items-center justify-center shadow-lg ${
              !isAvailable
                ? "bg-gradient-to-r from-gray-600 to-gray-700"
                : stock === 0
                ? "bg-gradient-to-r from-red-600 to-red-700"
                : stock <= 5
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-500 to-green-500"
            }`}
            style={{
              transform: "rotate(45deg)",
              transformOrigin: "center",
              top: "14px",
              right: "-32px",
            }}
          >
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap drop-shadow-md">
              {!isAvailable
                ? "Not Available"
                : stock === 0
                ? "Sold Out"
                : stock <= 5
                ? "Limited"
                : "Available"}
            </span>
          </div>
        </div>

        {/* Category Badge - Hidden on mobile, shown on desktop */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-md sm:rounded-lg hidden sm:block">
          <span className="text-[10px] sm:text-xs font-medium text-slate-300">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-1.5 sm:space-y-2 md:space-y-2.5 flex flex-col">
        {/* Title and Price */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 ${
                isAvailable
                  ? "text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-orange-200 group-hover:bg-clip-text"
                  : "text-slate-500"
              }`}
            >
              {name}
            </h3>
            {/* Category on mobile */}
            <span className="text-[9px] text-slate-500 sm:hidden mt-0.5 block">
              {category}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span
              className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${
                isAvailable
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                  : "text-slate-600"
              }`}
            >
              ₹{displayPrice}
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-500">
              {hasHalfFull ? "half plate" : "per serving"}
            </span>
            {hasHalfFull && fullPlatePrice && (
              <div className="mt-1.5 sm:mt-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <span
                  className={`text-[10px] sm:text-xs font-semibold ${
                    isAvailable
                      ? "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                      : "text-slate-600"
                  }`}
                >
                  Full plate: Rs {fullPlatePrice}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description - Shown on all screen sizes */}
        {description && (
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              isAvailable ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}

        {/* Stock Information */}
        {isAvailable && (
          <div className="pt-1.5 sm:pt-2 md:pt-2.5 border-t border-slate-700/50 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${
                    status.color
                  } ${stock > 0 ? "animate-pulse" : ""}`}
                ></div>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 font-medium">
                  Stock
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    stock > 5
                      ? "text-white"
                      : stock > 0
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {stock}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-500">
                  units
                </span>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="mt-1.5 sm:mt-2 md:mt-3 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
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
          <div className="pt-1.5 sm:pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
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
