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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Live <span className="text-gold-accent">Inventory</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Browse our real-time stock. Items are updated instantly.
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-1 sm:mt-0">
              <motion.span
                className="text-primary-red font-semibold"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ● Live Updates Active
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

