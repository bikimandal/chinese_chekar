"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold font-serif bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-wider hover:from-amber-300 hover:via-amber-500 hover:to-orange-400 transition-all duration-300">
              CHINESE CHEKAR
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8">
              <NavLink href="/">Home</NavLink>
              <Link
                href="/inventory"
                className="text-slate-300 hover:text-amber-400 hover:scale-105 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Live Inventory</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </Link>
              <NavLink href="/about">About Us</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <Link
            href="/inventory"
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:bg-slate-800/50 hover:text-amber-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-2"
          >
            <span>Live Inventory</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </Link>
          <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="mt-2 mx-3 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium transition-all duration-200 text-center block shadow-lg shadow-amber-500/30"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-300 hover:text-amber-400 hover:scale-105 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-slate-300 hover:bg-slate-800/50 hover:text-amber-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
    >
      {children}
    </Link>
  );
}
