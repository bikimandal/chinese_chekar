import SkeletonBase from "./SkeletonBase";

export default function SalesListSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-3 sm:p-4"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 pb-3 border-b border-slate-700/50">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <SkeletonBase className="w-4 h-4 rounded" />
                <SkeletonBase className="h-5 w-32 sm:w-40 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <SkeletonBase className="w-3 h-3 sm:w-4 sm:h-4 rounded" />
                <SkeletonBase className="h-4 w-40 sm:w-48 rounded" />
              </div>
            </div>
            <div className="text-right">
              <SkeletonBase className="h-6 sm:h-7 w-20 sm:w-24 rounded mb-1" />
              <SkeletonBase className="h-4 w-16 sm:w-20 rounded" />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <SkeletonBase className="h-3 w-12 rounded mb-1" />
            {[1, 2].map((j) => (
              <div key={j} className="flex justify-between items-center pl-2">
                <SkeletonBase className="h-4 w-32 sm:w-40 rounded flex-1" />
                <SkeletonBase className="h-4 w-16 sm:w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

