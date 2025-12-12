import SkeletonBase from "./SkeletonBase";

export default function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <SkeletonBase className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
            <SkeletonBase className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
          </div>
          <SkeletonBase className="h-3 sm:h-4 w-20 sm:w-24 mb-2 rounded" />
          <SkeletonBase className="h-8 sm:h-10 w-16 sm:w-20 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

