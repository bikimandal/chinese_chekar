"use client";

import { Check, X } from "lucide-react";

interface CustomToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export default function CustomToggle({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = "",
}: CustomToggleProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      {/* Custom Toggle Switch */}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out ${
            checked
              ? "bg-gradient-to-r from-amber-600 to-orange-600"
              : "bg-slate-700"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
            !disabled && "group-hover:shadow-lg group-hover:shadow-amber-500/20"
          }`}
        >
          {/* Toggle Circle */}
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
              checked ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {/* Inner glow effect */}
            <div
              className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                checked
                  ? "bg-gradient-to-br from-amber-400/30 to-orange-400/30 opacity-100"
                  : "opacity-0"
              }`}
            ></div>
            {/* Checkmark icon when checked - centered inside the white circle */}
            {checked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
              </div>
            )}
            {/* X icon when unchecked - centered inside the white circle */}
            {!checked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Label and Description */}
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}

