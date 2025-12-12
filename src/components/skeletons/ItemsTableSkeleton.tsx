import SkeletonBase from "./SkeletonBase";

export default function ItemsTableSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/50">
        <div className="flex-1">
          <SkeletonBase className="h-6 sm:h-7 w-32 sm:w-40 mb-2 rounded" />
          <SkeletonBase className="h-4 w-24 sm:w-32 rounded" />
        </div>
        <SkeletonBase className="h-10 sm:h-12 w-full sm:w-40 rounded-xl" />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              {["Name", "Category", "Price", "Stock", "Status", "Availability", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    <SkeletonBase className="h-4 w-16 rounded" />
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <SkeletonBase className="h-5 w-32 rounded" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBase className="h-6 w-20 rounded-lg" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBase className="h-5 w-16 rounded" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBase className="h-5 w-12 rounded" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBase className="h-6 w-20 rounded-lg" />
                </td>
                <td className="px-6 py-4">
                  <SkeletonBase className="h-6 w-11 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <SkeletonBase className="h-8 w-8 rounded-lg" />
                    <SkeletonBase className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 sm:p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <SkeletonBase className="h-5 w-3/4 mb-2 rounded" />
                <SkeletonBase className="h-4 w-1/2 rounded" />
              </div>
              <SkeletonBase className="h-6 w-20 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <SkeletonBase className="h-3 w-12 mb-1 rounded" />
                <SkeletonBase className="h-4 w-16 rounded" />
              </div>
              <div>
                <SkeletonBase className="h-3 w-12 mb-1 rounded" />
                <SkeletonBase className="h-4 w-16 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <SkeletonBase className="h-6 w-20 rounded-lg" />
              <div className="flex items-center gap-2">
                <SkeletonBase className="h-6 w-11 rounded-full" />
                <SkeletonBase className="h-8 w-8 rounded-lg" />
                <SkeletonBase className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

