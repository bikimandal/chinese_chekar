import SkeletonBase from "./SkeletonBase";

export default function SalesSummarySkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SkeletonBase className="h-3 sm:h-4 w-20 sm:w-24 mb-2 rounded" />
          <SkeletonBase className="h-8 sm:h-10 w-16 sm:w-20 rounded" />
        </div>
        <div>
          <SkeletonBase className="h-3 sm:h-4 w-24 sm:w-28 mb-2 rounded" />
          <SkeletonBase className="h-8 sm:h-10 w-20 sm:w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

