import SkeletonBase from "./SkeletonBase";

export default function LiveSellItemsSkeleton() {
  return (
    <div className="space-y-2 sm:space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3 sm:p-4"
        >
          <div className="flex items-center gap-3">
            {/* Image */}
            <SkeletonBase className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <SkeletonBase className="h-4 sm:h-5 w-3/4 mb-2 rounded" />
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <SkeletonBase className="h-3 w-10 mb-1 rounded" />
                  <SkeletonBase className="h-4 sm:h-5 w-12 sm:w-16 rounded" />
                </div>
                <div>
                  <SkeletonBase className="h-3 w-10 mb-1 rounded" />
                  <SkeletonBase className="h-4 sm:h-5 w-12 sm:w-16 rounded" />
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <SkeletonBase className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg" />
              <SkeletonBase className="w-8 sm:w-10 h-6 rounded" />
              <SkeletonBase className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg" />
              <SkeletonBase className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

