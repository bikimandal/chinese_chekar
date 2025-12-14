"use client";

import { motion } from "framer-motion";
import ReloadButton from "@/components/ReloadButton";

export default function InventoryHeader() {
  return (
    <motion.div
      className="mb-8 sm:mb-10 md:mb-12 text-center px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Live <span className="text-gold-accent">Menu</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Browse our real-time stock. Items are updated instantly.
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-2 sm:mt-0 sm:ml-2">
              <motion.span
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Updates Active
              </motion.span>
            </span>
          </p>
        </motion.div>
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ReloadButton />
        </motion.div>
      </div>
    </motion.div>
  );
}
