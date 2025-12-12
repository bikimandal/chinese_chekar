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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
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

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-l-2 border-t-2 border-amber-500/30 z-10"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border-r-2 border-b-2 border-amber-500/30 z-10"></div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto py-12 sm:py-16 md:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full mb-6 sm:mb-8"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
          <span className="text-xs sm:text-sm text-amber-200 font-medium tracking-wider">
            AUTHENTIC CHINESE CUISINE
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
        >
          <span className="block text-white">Experience the</span>
          <motion.span
            className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Art of Flavor
          </motion.span>
        </motion.h1>

        {/* Decorative Line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
          <motion.div
            className="w-2 h-2 bg-amber-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-10 md:mb-12 font-light max-w-3xl mx-auto leading-relaxed px-2"
        >
          Where authentic flavors meet modern elegance.
          <span className="block mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-slate-400">
            Discover our live menu with exclusive daily specials.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 px-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/inventory"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 flex items-center gap-2 overflow-hidden w-full sm:w-auto justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative font-semibold text-sm sm:text-base md:text-lg">
                View Live Menu
              </span>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/about"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-amber-500/50 text-white rounded-full transition-all duration-300 hover:bg-slate-800/70 w-full sm:w-auto text-center"
            >
              <span className="font-semibold text-sm sm:text-base md:text-lg">
                Our Story
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2"
          variants={containerVariants}
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
              description: "Premium ingredients sourced daily for authentic taste",
            },
            {
              icon: (
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              ),
              title: "Live Updates",
              description: "Real-time inventory tracking for your convenience",
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
              title: "Authentic Recipe",
              description: "Traditional methods passed down through generations",
              colSpan: "sm:col-span-2 md:col-span-1",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-4 sm:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 ${feature.colSpan || ""}`}
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-amber-500/30 rounded-full flex items-start justify-center p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-amber-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
