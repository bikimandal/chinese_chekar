import { Item } from "../types";

interface AvailabilityToggleProps {
  item: Item;
  isToggling: boolean;
  onToggle: () => void;
}

export default function AvailabilityToggle({
  item,
  isToggling,
  onToggle,
}: AvailabilityToggleProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isToggling}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
        item.isAvailable ? "bg-emerald-500" : "bg-gray-600"
      }`}
      title={
        item.isAvailable
          ? "Click to mark as Not Available"
          : "Click to mark as Available"
      }
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          item.isAvailable ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

