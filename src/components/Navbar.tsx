"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-500/50">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span
                className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-wide hover:from-amber-300 hover:via-amber-500 hover:to-orange-400 transition-all duration-300"
                style={{ fontFamily: 'var(--font-branding), cursive' }}
              >
                Chinese Chekar
              </span>
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
              <ContactScrollLink />
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 overflow-hidden"
          >
            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink
                href="/inventory"
                onClick={() => setIsOpen(false)}
                withIndicator
              >
                Live Inventory
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
                About Us
              </MobileNavLink>
              <MobileContactScrollLink onClick={() => setIsOpen(false)} />
              <motion.div
                variants={{
                  closed: { opacity: 0, x: -20 },
                  open: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3 }}
                className="mt-2 mx-3"
              >
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium transition-all duration-200 text-center block shadow-lg shadow-amber-500/30"
                >
                  Admin
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function ContactScrollLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="text-slate-300 hover:text-amber-400 hover:scale-105 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group"
    >
      Contact
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

function MobileContactScrollLink({ onClick }: { onClick: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
    // Small delay to allow mobile menu to close first
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <motion.div
      variants={{
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      <a
        href="#contact"
        onClick={handleClick}
        className="text-slate-300 hover:bg-slate-800/50 hover:text-amber-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
      >
        Contact
      </a>
    </motion.div>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
  withIndicator = false,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  withIndicator?: boolean;
}) {
  return (
    <motion.div
      variants={{
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="text-slate-300 hover:bg-slate-800/50 hover:text-amber-400 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-2"
      >
        <span>{children}</span>
        {withIndicator && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </Link>
    </motion.div>
  );
}
