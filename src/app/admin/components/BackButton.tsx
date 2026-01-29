"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
  mobileLabel?: string;
  className?: string;
}

export default function BackButton({
  href,
  label = "Back to Dashboard",
  mobileLabel = "Back",
  className = "",
}: BackButtonProps) {
  const handleClick = () => {
    // Dispatch navigation event to show loader during navigation
    window.dispatchEvent(new Event("navigation-start"));
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-medium flex-shrink-0 cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{mobileLabel}</span>
    </Link>
  );
}

