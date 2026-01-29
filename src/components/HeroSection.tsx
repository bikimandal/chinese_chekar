"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-900 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-red-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop"
          alt="Restaurant Ambiance"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Decorative Elements - Hidden on mobile, shown on larger screens */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 border-l-2 border-t-2 border-amber-500/30 z-10 hidden sm:block"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 border-r-2 border-b-2 border-amber-500/30 z-10 hidden sm:block"></div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-8 sm:py-12 md:py-16 lg:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "-100px" }}
      >
        {/* Premium Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full mb-4 sm:mb-6 md:mb-8"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] sm:text-xs md:text-sm text-amber-200 font-medium tracking-wider">
            AUTHENTIC CHINESE CUISINE
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-2"
          style={{ fontFamily: "var(--font-hero), serif" }}
        >
          <span className="block text-white tracking-wide">Experience the</span>
          <motion.span
            className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-wide"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontFamily: "var(--font-hero), serif" }}
          >
            Art of Flavor
          </motion.span>
        </motion.h1>

        {/* Decorative Line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-slate-300 mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-light max-w-3xl mx-auto leading-relaxed px-2 sm:px-4"
        >
          Where authentic Chinese flavors meet contemporary culinary excellence.
          <span className="block mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-slate-400">
            Explore our live menu featuring exclusive daily specials and
            seasonal delights.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-4 mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4 max-w-md sm:max-w-none mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/inventory"
              className="group relative px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto min-w-[200px] sm:min-w-0"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap">
                View Live Menu
              </span>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="shrink-0"
              >
                <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/about"
              className="group px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-amber-500/50 text-white rounded-full transition-all duration-300 hover:bg-slate-800/70 w-full sm:w-auto text-center min-w-[200px] sm:min-w-0 inline-block"
            >
              <span className="font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap">
                Our Story
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-2 sm:px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
        >
          {[
            {
              icon: (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              ),
              title: "Fresh Daily",
              description:
                "Premium ingredients sourced fresh daily for an authentic culinary experience",
            },
            {
              icon: (
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              ),
              title: "Live Updates",
              description:
                "Real-time inventory tracking ensures you always know what's available",
            },
            {
              icon: (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              title: "Authentic Recipes",
              description:
                "Time-honored traditional methods perfected through generations of expertise",
              colSpan: "sm:col-span-2 md:col-span-1",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-4 sm:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 ${
                feature.colSpan || ""
              }`}
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-50px" }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-amber-500/30 rounded-full flex items-start justify-center p-1.5 sm:p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 sm:h-2 bg-amber-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
