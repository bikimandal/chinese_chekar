import SkeletonBase from "./SkeletonBase";

export default function InventoryItemSkeleton() {
  return (
    <SkeletonBase className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/50">
      <div className="flex flex-row sm:flex-col">
        {/* Image Skeleton - Mobile: 128px, Desktop: Full width */}
        <div className="w-32 h-32 sm:w-full sm:h-48 md:h-56 shrink-0">
          <SkeletonBase className="w-full h-full" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-2.5 sm:p-3 md:p-4 lg:p-5 space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4 flex flex-col">
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0 space-y-1">
              <SkeletonBase className="h-4 sm:h-5 w-3/4 rounded" />
              <SkeletonBase className="h-3 w-1/2 rounded sm:hidden" />
            </div>
            <div className="shrink-0 space-y-1">
              <SkeletonBase className="h-5 sm:h-6 md:h-7 w-16 sm:w-20 rounded" />
              <SkeletonBase className="h-2.5 sm:h-3 w-12 sm:w-14 rounded" />
            </div>
          </div>

          {/* Description - Hidden on mobile */}
          <div className="hidden sm:block space-y-1">
            <SkeletonBase className="h-3 w-full rounded" />
            <SkeletonBase className="h-3 w-5/6 rounded" />
          </div>

          {/* Stock Information */}
          <div className="pt-1.5 sm:pt-2 md:pt-3 lg:pt-4 border-t border-slate-700/50 mt-auto space-y-2">
            <div className="flex items-center justify-between">
              <SkeletonBase className="h-3 sm:h-4 w-20 sm:w-24 rounded" />
              <SkeletonBase className="h-3 sm:h-4 w-12 sm:w-16 rounded" />
            </div>
            {/* Progress Bar */}
            <SkeletonBase className="h-1.5 sm:h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
    </SkeletonBase>
  );
}

