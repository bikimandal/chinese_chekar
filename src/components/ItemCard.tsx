import Image from "next/image";
import { useState } from "react";
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
  isAboveFold?: boolean; // For LCP optimization
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
  isAboveFold = false,
  product,
}: ItemCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  // Determine if item is disabled or out of stock
  const isDisabled = !isAvailable;
  const isOutOfStock = isAvailable && stock === 0;

  return (
    <div
      className={`group relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 flex flex-row sm:flex-col h-full ${
        isDisabled
          ? "border-slate-700/30 opacity-60 grayscale hover:border-slate-600/50"
          : isOutOfStock
          ? "border-slate-700/30 opacity-70 sepia hover:border-slate-600/50"
          : "border-slate-700/50 hover:border-amber-500/50 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 sm:hover:-translate-y-2"
      }`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full hidden sm:block"></div>

      {/* Image Container */}
      <div className="relative w-32 h-32 sm:w-full sm:h-48 md:h-56 overflow-hidden bg-slate-900 shrink-0">
        {/* Image Skeleton Loader - Matches exact image dimensions */}
        {!imageLoaded && !imageError && image && (
          <div className="absolute inset-0 w-full h-full z-10">
            <div className="relative w-full h-full bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 animate-shimmer overflow-hidden">
              {/* Enhanced shiny overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              {/* Secondary shimmer layer for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 animate-shimmer-slow opacity-75" />
            </div>
          </div>
        )}

        {image && !imageError ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              loading={isAboveFold ? "eager" : "lazy"}
              priority={isAboveFold}
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              className={`object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${
                isDisabled
                  ? "!opacity-50"
                  : isOutOfStock
                  ? "!opacity-60"
                  : "group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
              }`}
              sizes="(max-width: 640px) 128px, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={60}
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
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden z-10">
          <div
            className={`absolute w-28 sm:w-32 h-5 sm:h-6 flex items-center justify-center shadow-lg ${
              isDisabled
                ? "bg-gradient-to-r from-gray-600 to-gray-700"
                : isOutOfStock
                ? "bg-gradient-to-r from-purple-600 to-indigo-700"
                : stock <= 5
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-emerald-700 to-green-700"
            }`}
            style={{
              transform: "rotate(-45deg)",
              transformOrigin: "center",
              top: "14px",
              left: "-32px",
            }}
          >
            <span
              className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap"
              style={{
                textShadow:
                  "0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5), 1px 1px 2px rgba(0,0,0,1)",
              }}
            >
              {isDisabled
                ? "Not Available"
                : isOutOfStock
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
      <div className="flex-1 p-2.5 sm:p-3 md:p-4 lg:p-5 flex flex-col min-h-0">
        {/* Title and Price */}
        <div className="flex justify-between items-start gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 md:mb-2.5">
          <div className="flex-1 min-w-0 pr-1 sm:pr-1.5">
            <h3
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-semibold transition-all duration-300 font-sans leading-tight ${
                isDisabled
                  ? "text-slate-500"
                  : isOutOfStock
                  ? "text-purple-300"
                  : "text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-orange-200 group-hover:bg-clip-text"
              }`}
              style={{ fontFamily: "var(--font-body), sans-serif" }}
            >
              {name}
            </h3>
            {/* Category on mobile */}
            <span className="text-[9px] text-slate-500 sm:hidden mt-0.5 block">
              {category}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0 min-w-fit">
            <span
              className={`text-lg sm:text-lg md:text-xl lg:text-2xl font-bold ${
                isDisabled
                  ? "text-slate-600"
                  : isOutOfStock
                  ? "bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
              }`}
            >
              ₹{displayPrice}
            </span>
            <span className="text-[10px] sm:text-[10px] md:text-xs text-slate-500 mt-0.5">
              {hasHalfFull ? "half plate" : "per serving"}
            </span>
            {/* Full plate price with Low Stock badge - Better mobile design */}
            {hasHalfFull && fullPlatePrice && (
              <div className="mt-2 sm:mt-1.5 flex items-center gap-2 sm:gap-1.5 flex-wrap">
                {/* Low Stock Badge - To the left of Full Plate */}
                {stock > 0 && stock <= 5 && isAvailable && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-2.5 py-1.5 sm:py-1.5 md:py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm border border-amber-400/60 rounded-full shadow-lg shadow-amber-500/20">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 text-amber-300 animate-pulse" />
                    <span className="text-[10px] sm:text-xs md:text-[10px] text-amber-200 font-bold whitespace-nowrap">
                      Low Stock
                    </span>
                  </div>
                )}
                {/* Full Plate Price */}
                <div
                  className={`flex items-center gap-1.5 sm:gap-1 px-2.5 sm:px-2 py-1.5 sm:py-1 rounded-lg sm:rounded-md ${
                    isDisabled
                      ? "bg-slate-700/30 border border-slate-600/30"
                      : isOutOfStock
                      ? "bg-purple-500/15 border border-purple-500/30"
                      : "bg-amber-500/15 border border-amber-500/30"
                  }`}
                >
                  <span className="text-[10px] sm:text-[10px] md:text-xs text-slate-400 font-medium">
                    Full Plate:
                  </span>
                  <span className="text-sm sm:text-xs font-bold text-white">
                    ₹{fullPlatePrice}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description - Shown on all screen sizes, with consistent min-height */}
        <div className="mb-1.5 sm:mb-2 md:mb-2.5 min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem]">
          {description ? (
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                isDisabled
                  ? "text-slate-600"
                  : isOutOfStock
                  ? "text-purple-300/70"
                  : "text-slate-400"
              }`}
            >
              {description}
            </p>
          ) : (
            <div className="h-full"></div>
          )}
        </div>

        {/* Stock Information - Always show section, content varies */}
        <div className="mt-auto">
          {/* Low Stock Badge - Show above stock section if no Full Plate option */}
          {stock > 0 &&
            stock <= 5 &&
            isAvailable &&
            (!hasHalfFull || !fullPlatePrice) && (
              <div className="mb-2 sm:mb-1.5 flex justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-2.5 py-1.5 sm:py-1.5 md:py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm border border-amber-400/60 rounded-full shadow-lg shadow-amber-500/20">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 text-amber-300 animate-pulse" />
                  <span className="text-[10px] sm:text-xs md:text-[10px] text-amber-200 font-bold whitespace-nowrap">
                    Low Stock
                  </span>
                </div>
              </div>
            )}
          <div
            className={`pt-2 sm:pt-2 md:pt-2.5 border-t ${
              stock > 0 && stock <= 5 && isAvailable
                ? "border-amber-500/50"
                : "border-slate-700/50"
            }`}
          >
            {isAvailable ? (
              <>
                {stock > 0 && stock <= 5 ? (
                  /* Low Stock Display - "Only x plates available" */
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5 sm:w-4 sm:h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span className="text-base sm:text-sm font-semibold text-amber-300 text-center">
                      Only{" "}
                      <span className="text-white font-bold text-lg sm:text-base">
                        {stock}
                      </span>{" "}
                      {stock === 1 ? "plate" : "plates"} available
                    </span>
                  </div>
                ) : (
                  /* Normal Stock Display */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-1.5 md:gap-2">
                      <div
                        className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${
                          status.color
                        } ${stock > 0 ? "animate-pulse" : ""}`}
                      ></div>
                      <span className="text-base sm:text-sm text-slate-400 font-semibold">
                        Stock
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-1.5 md:gap-2">
                      <span
                        className={`text-lg sm:text-base font-bold ${
                          stock > 5
                            ? "text-white"
                            : stock > 0
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {stock}
                      </span>
                      <span className="text-base sm:text-sm text-slate-400 font-medium">
                        plates
                      </span>
                    </div>
                  </div>
                )}

                {/* Stock Progress Bar - Show for all stock levels */}
                {stock > 0 && (
                  <div className="mt-1.5 sm:mt-2 md:mt-3 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        status.color
                      } transition-all duration-500 rounded-full ${
                        stock <= 5 ? "animate-pulse" : ""
                      }`}
                      style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
                    >
                      <div className="h-full w-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-2 sm:h-2 rounded-full bg-slate-600"></div>
                <span className="text-xs sm:text-[10px] md:text-xs text-slate-400 font-semibold">
                  {isDisabled ? "Not Available" : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent"></div>
      </div>
    </div>
  );
}
