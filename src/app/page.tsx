"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { footerConfig } from "@/config/footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <HeroSection />
      
      {/* Google Maps Section */}
      <motion.section
        className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 md:py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent mb-2">
              {footerConfig.maps.title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {footerConfig.maps.subtitle}
            </p>
          </motion.div>
          <motion.div
            className="w-full rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-slate-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <iframe
              src={footerConfig.maps.embedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
