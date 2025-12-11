import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Item } from "../types";
import StatusBadge from "./StatusBadge";
import AvailabilityToggle from "./AvailabilityToggle";

interface ItemsTableProps {
  items: Item[];
  togglingItemId: string | null;
  onDelete: (id: string) => void;
  onToggleAvailability: (item: Item) => void;
}

export default function ItemsTable({
  items,
  togglingItemId,
  onDelete,
  onToggleAvailability,
}: ItemsTableProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
      <div className="p-6 flex justify-between items-center border-b border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold text-white">Inventory Items</h2>
          <p className="text-slate-400 text-sm mt-1">
            {items.length} total items
          </p>
        </div>
        <Link
          href="/admin/items/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-amber-500/30"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="text-white font-medium">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.category ? (
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                        {item.category.name}
                      </span>
                    ) : item.product ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                        {item.product.name}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg text-sm">
                        No category
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-amber-400 font-semibold">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 text-white">{item.stock}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      item={item}
                      isToggling={togglingItemId === item.id}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <AvailabilityToggle
                      item={item}
                      isToggling={togglingItemId === item.id}
                      onToggle={() => onToggleAvailability(item)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/items/edit/${item.id}`}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

