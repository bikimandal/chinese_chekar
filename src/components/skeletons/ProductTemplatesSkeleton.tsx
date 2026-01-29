import SkeletonBase from "./SkeletonBase";

export default function ProductTemplatesSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 sm:p-6"
          >
            {/* Image Skeleton */}
            <div className="mb-3 sm:mb-4">
              <SkeletonBase className="w-full h-40 sm:h-48 rounded-lg" />
            </div>

            {/* Title */}
            <SkeletonBase className="h-5 sm:h-6 w-3/4 mb-2 rounded" />

            {/* Description */}
            <div className="mb-3 sm:mb-4 space-y-1.5">
              <SkeletonBase className="h-3 sm:h-4 w-full rounded" />
              <SkeletonBase className="h-3 sm:h-4 w-5/6 rounded" />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <SkeletonBase className="flex-1 h-9 sm:h-10 rounded-lg" />
              <SkeletonBase className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

