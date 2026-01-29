import SkeletonBase from "./SkeletonBase";

export default function LiveSellItemsSkeleton() {
  return (
    <div className="space-y-2 sm:space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Image */}
            <div className="flex-shrink-0">
              <SkeletonBase className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              {/* Item Name with Badge */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <SkeletonBase className="h-4 sm:h-5 w-32 sm:w-40 rounded" />
                <SkeletonBase className="h-4 w-16 rounded" />
              </div>

              {/* Price and Stock */}
              <div className="flex items-center gap-4 sm:gap-3 mb-2">
                <div>
                  <SkeletonBase className="h-2.5 sm:h-3 w-8 sm:w-10 mb-1.5 rounded" />
                  <SkeletonBase className="h-4 sm:h-5 w-14 sm:w-16 rounded" />
                </div>
                <div>
                  <SkeletonBase className="h-2.5 sm:h-3 w-8 sm:w-10 mb-1.5 rounded" />
                  <SkeletonBase className="h-4 sm:h-5 w-10 sm:w-12 rounded" />
                </div>
              </div>

              {/* Half/Full Plate Toggle - Sometimes shown */}
              {i % 2 === 0 && (
                <div className="mb-2">
                  <SkeletonBase className="h-8 sm:h-9 w-full sm:w-32 rounded-lg" />
                </div>
              )}
            </div>

            {/* Quantity Controls - Mobile: Full width, Desktop: Auto */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-center gap-2 bg-slate-700/30 rounded-lg p-1.5 sm:p-0 sm:bg-transparent">
                <SkeletonBase className="w-9 h-9 rounded-lg" />
                <SkeletonBase className="w-12 h-6 rounded" />
                <SkeletonBase className="w-9 h-9 rounded-lg" />
              </div>
              <SkeletonBase className="w-full sm:w-9 sm:h-9 h-9 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


