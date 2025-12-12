"use client";

import { useState, useEffect } from "react";
import { Home, ArrowLeft, ChefHat, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  const [particles, setParticles] = useState<
    Array<{ top: number; left: number; delay: number; duration: number }>
  >([]);

  useEffect(() => {
    // Generate particle positions on client side to avoid hydration mismatch
    setParticles(
      Array.from({ length: 6 }).map((_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: i * 0.5,
        duration: 2 + Math.random() * 2,
      }))
    );
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-64 h-64 sm:w-80 sm:h-80 bg-orange-600 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-56 h-56 sm:w-72 sm:h-72 bg-amber-600 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Chef Hat Icon with glow */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <ChefHat
                className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* 404 Number with gradient */}
        <div className="mb-6">
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black mb-2">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-500/50"></div>
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500/70" />
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-500/50"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Oops! This Dish Isn't On Our Menu
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto px-4">
            It seems you've wandered into our kitchen's storage room. The page
            you're looking for might have been taken off the menu or moved to a
            different location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
          <a
            href="/"
            className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 w-full sm:w-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Home className="w-5 h-5 relative z-10" />
            <span className="relative z-10 text-sm sm:text-base">
              Return Home
            </span>
          </a>
          <button
            onClick={handleGoBack}
            className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800/50 backdrop-blur-md border-2 border-slate-700/50 hover:border-amber-500/50 hover:bg-slate-800/70 text-slate-300 hover:text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="pt-8 sm:pt-10 border-t border-slate-700/30">
          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 sm:mb-5 uppercase tracking-wider">
            Explore Our Restaurant
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4">
            <a
              href="/"
              className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
            >
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                Home
              </span>
            </a>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <a
              href="/inventory"
              className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
            >
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                Menu
              </span>
            </a>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <a
              href="/about"
              className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
            >
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                About Us
              </span>
            </a>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-10 sm:mt-12 flex items-center justify-center gap-2 opacity-30">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        </div>
      </div>

      {/* Floating particles effect */}
      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full animate-pulse"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
