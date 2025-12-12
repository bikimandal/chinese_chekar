"use client";

import { useState, useEffect } from "react";
import { ChefHat, Sparkles } from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

interface SparklePosition {
  top: number;
  left: number;
  duration: number;
}

export default function Loader({
  message = "Loading...",
  size = "md",
}: LoaderProps) {
  const [sparklePositions, setSparklePositions] = useState<SparklePosition[]>(
    []
  );

  // Generate random positions only on client side to avoid hydration mismatch
  useEffect(() => {
    const positions = Array.from({ length: 8 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 2,
    }));
    setSparklePositions(positions);
  }, []);
  const sizeClasses = {
    sm: {
      container: "h-14 w-14",
      icon: "h-6 w-6",
      ring: "h-16 w-16",
      outerRing: "h-20 w-20",
      dot: "w-1.5 h-1.5",
      glow: "h-20 w-20",
    },
    md: {
      container: "h-20 w-20",
      icon: "h-9 w-9",
      ring: "h-24 w-24",
      outerRing: "h-32 w-32",
      dot: "w-2 h-2",
      glow: "h-32 w-32",
    },
    lg: {
      container: "h-28 w-28",
      icon: "h-12 w-12",
      ring: "h-32 w-32",
      outerRing: "h-44 w-44",
      dot: "w-3 h-3",
      glow: "h-44 w-44",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-64 h-64 sm:w-80 sm:h-80 bg-orange-600 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-56 h-56 sm:w-72 sm:h-72 bg-amber-600 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparklePositions.map((pos, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${pos.duration}s`,
            }}
          >
            <Sparkles
              className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 opacity-30"
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <div className="relative text-center z-10">
        {/* Brand Name */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            Chinese Chekar
          </h1>
        </div>

        {/* Multi-layered Loader Animation */}
        <div className="relative inline-flex items-center justify-center mb-8 sm:mb-10">
          {/* Pulsing background glow */}
          <div className={`absolute ${currentSize.glow}`}>
            <div className="w-full h-full bg-linear-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-2xl animate-pulse-glow"></div>
          </div>

          {/* Center icon container with enhanced styling */}
          <div
            className={`relative ${currentSize.container} bg-linear-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-pulse-scale`}
          >
            <ChefHat
              className={`${currentSize.icon} text-white drop-shadow-lg`}
              strokeWidth={2}
            />

            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-2xl"></div>

            {/* Outer pulsing glow */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-60 animate-pulse-glow"></div>
          </div>
        </div>

        {/* Loading Text with better styling */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent animate-pulse-slow drop-shadow-sm">
            {message}
          </h2>

          {/* Enhanced animated dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-linear-to-r from-amber-400 to-amber-500 rounded-full animate-bounce-smooth shadow-lg shadow-amber-400/50"></div>
            <div
              className="w-2.5 h-2.5 bg-linear-to-r from-amber-500 to-orange-500 rounded-full animate-bounce-smooth shadow-lg shadow-orange-400/50"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="w-2.5 h-2.5 bg-linear-to-r from-orange-400 to-orange-500 rounded-full animate-bounce-smooth shadow-lg shadow-orange-400/50"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
        </div>

        {/* Enhanced hint text */}
        <div className="mt-8 space-y-2">
          <p className="text-slate-400 text-sm sm:text-base animate-pulse-slow font-medium">
            Preparing your culinary experience
          </p>
          <div className="flex items-center justify-center gap-2 opacity-40">
            <div className="h-px w-8 sm:w-12 bg-linear-to-r from-transparent to-amber-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-amber-500"></div>
            <div className="h-px w-8 sm:w-12 bg-linear-to-l from-transparent to-amber-500/50"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes bounce-smooth {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-smooth {
          animation: bounce-smooth 1s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
