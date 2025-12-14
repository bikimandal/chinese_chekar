import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { Item } from "../types";
import StatusBadge from "./StatusBadge";
import AvailabilityToggle from "./AvailabilityToggle";

interface ItemsTableProps {
  items: Item[];
  togglingItemId: string | null;
  deletingItemId: string | null;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: Item) => void;
}

export default function ItemsTable({
  items,
  togglingItemId,
  deletingItemId,
  onDelete,
  onToggleAvailability,
}: ItemsTableProps) {
  // Helper function to render price display
  // Shows both half and full plate prices when segregation is enabled
  const renderPrice = (item: Item) => {
    const hasHalfFull = item.product?.hasHalfFullPlate ?? false;

    // When segregation is disabled, show only full plate price
    if (!hasHalfFull) {
      const price = item.product?.fullPlatePrice ?? item.price;
      return <span className="text-amber-400 font-semibold">₹{price}</span>;
    }

    // When segregation is enabled, show both prices
    const halfPrice = item.product?.halfPlatePrice ?? 0;
    const fullPrice = item.product?.fullPlatePrice ?? item.price;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Half:</span>
          <span className="text-amber-400 font-semibold">₹{halfPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Full:</span>
          <span className="text-amber-400 font-semibold">₹{fullPrice}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/50">
        <div>
          <h2
            className="text-lg sm:text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Inventory Items
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {items.length} total items
          </p>
        </div>
        <Link
          href="/admin/items/new"
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-amber-500/30 text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:hidden">Add Item</span>
          <span className="hidden sm:inline">Add New Item</span>
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {Array.isArray(items) &&
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span
                        className="text-white font-medium text-sm sm:text-base"
                        style={{ fontFamily: "var(--font-body), sans-serif" }}
                      >
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    {item.category ? (
                      <span className="px-2 sm:px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs sm:text-sm">
                        {item.category.name}
                      </span>
                    ) : item.product ? (
                      <span className="px-2 sm:px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs sm:text-sm">
                        {item.product.name}
                      </span>
                    ) : (
                      <span className="px-2 sm:px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs sm:text-sm">
                        No category
                      </span>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm sm:text-base">
                    {renderPrice(item)}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 text-white text-sm sm:text-base">
                    {item.stock}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <StatusBadge
                      item={item}
                      isToggling={togglingItemId === item.id}
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <AvailabilityToggle
                      item={item}
                      isToggling={togglingItemId === item.id}
                      onToggle={() => onToggleAvailability(item)}
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/items/edit/${item.id}`}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(item.id)}
                        disabled={deletingItemId === item.id}
                        className="p-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          deletingItemId === item.id ? "Deleting..." : "Delete"
                        }
                      >
                        {deletingItemId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden p-4 sm:p-6 space-y-4">
        {Array.isArray(items) && items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No items found</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 sm:p-5 space-y-4"
            >
              {/* Header with Image and Name */}
              <div className="flex items-start gap-3 sm:gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base sm:text-lg font-semibold text-white mb-1 truncate"
                    style={{ fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {item.category ? (
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs">
                        {item.category.name}
                      </span>
                    ) : item.product ? (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">
                        {item.product.name}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-xs">
                        No category
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Price</p>
                  <div className="text-lg sm:text-xl font-bold">
                    {(() => {
                      const hasHalfFull =
                        item.product?.hasHalfFullPlate ?? false;
                      if (!hasHalfFull) {
                        const price =
                          item.product?.fullPlatePrice ?? item.price;
                        return <span className="text-amber-400">₹{price}</span>;
                      }
                      const halfPrice = item.product?.halfPlatePrice ?? 0;
                      const fullPrice =
                        item.product?.fullPlatePrice ?? item.price;
                      return (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 font-normal">
                              Half:
                            </span>
                            <span className="text-amber-400">₹{halfPrice}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 font-normal">
                              Full:
                            </span>
                            <span className="text-amber-400">₹{fullPrice}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Stock</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {item.stock}
                  </p>
                </div>
              </div>

              {/* Status and Availability */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-700/50">
                <div className="flex-1 min-w-[120px]">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <StatusBadge
                    item={item}
                    isToggling={togglingItemId === item.id}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="text-xs text-slate-500 mb-1">Availability</p>
                  <AvailabilityToggle
                    item={item}
                    isToggling={togglingItemId === item.id}
                    onToggle={() => onToggleAvailability(item)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                <Link
                  href={`/admin/items/edit/${item.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={deletingItemId === item.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingItemId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deletingItemId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
