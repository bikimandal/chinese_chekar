import { Clock, ChefHat, Moon, Sun } from "lucide-react";

interface ShopClosedProps {
  message?: string;
}

export default function ShopClosed({ message }: ShopClosedProps) {
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-30"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationName: "float1",
          }}
        ></div>
        <div
          className="absolute top-20 right-20 w-3 h-3 bg-orange-400 rounded-full opacity-40"
          style={{
            animation: "float 7s ease-in-out infinite",
            animationName: "float2",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-2 h-2 bg-amber-300 rounded-full opacity-30"
          style={{
            animation: "float 8s ease-in-out infinite",
            animationName: "float3",
          }}
        ></div>
        <div
          className="absolute bottom-32 right-1/3 w-2.5 h-2.5 bg-orange-300 rounded-full opacity-40"
          style={{
            animation: "float 6.5s ease-in-out infinite",
            animationName: "float4",
          }}
        ></div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10 px-2">
        {/* Main Icon with Animation */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 border-2 border-slate-700/50 shadow-2xl relative group">
            {/* Pulsing background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>

            {/* Icon */}
            <Clock
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-amber-400 relative z-10"
              style={{ animation: "pulse 3s ease-in-out infinite" }}
            />

            {/* Corner accents */}
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 leading-tight px-2">
            <span className="text-white">We're </span>
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
              Closed
            </span>
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Chef Hat Icon */}
          <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl"></div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-slate-800/50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-700/50">
              <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400/70" />
            </div>
          </div>

          {/* Message */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-4 sm:mb-6 leading-relaxed relative z-10 px-2">
            {message ||
              "We are currently closed. Please check back during our business hours!"}
          </p>

          {/* Operating Hours Preview */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-slate-900/50 rounded-lg sm:rounded-xl border border-slate-700/50 mb-4 sm:mb-6">
            {isNight ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
            )}
            <div className="text-left">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Business Hours
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                Mon-Fri: 11 AM - 10 PM
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6"></div>

          {/* Footer Text */}
          <div className="space-y-2 relative z-10">
            <p className="text-slate-400 text-sm font-medium">
              Thank you for visiting Chinese Chekar
            </p>
            <p className="text-slate-500 text-xs">
              We'll be back soon with delicious food and fresh ingredients!
            </p>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-700/50">
            <div className="relative">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-slate-400">Currently Closed</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Check back later for our live inventory</span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-6 border-t border-slate-800/50">
          <p className="text-slate-500 text-xs mb-3">Stay connected with us</p>
          <div className="flex justify-center gap-3">
            <button className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 flex items-center justify-center group">
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 flex items-center justify-center group">
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 flex items-center justify-center group">
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
