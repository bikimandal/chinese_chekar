import { ChefHat } from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  message = "Loading...",
  size = "md",
}: LoaderProps) {
  const sizeClasses = {
    sm: {
      container: "h-12 w-12",
      icon: "h-5 w-5",
      ring: "h-14 w-14",
      dot: "w-1.5 h-1.5",
    },
    md: {
      container: "h-16 w-16",
      icon: "h-7 w-7",
      ring: "h-20 w-20",
      dot: "w-2 h-2",
    },
    lg: {
      container: "h-24 w-24",
      icon: "h-10 w-10",
      ring: "h-28 w-28",
      dot: "w-2.5 h-2.5",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative text-center">
        {/* Multi-layered Loader Animation */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Outer spinning ring */}
          <div className={`absolute ${currentSize.ring}`}>
            <div className="w-full h-full border-2 border-transparent border-t-amber-500 border-r-amber-500 rounded-full animate-spin"></div>
          </div>

          {/* Middle spinning ring - opposite direction */}
          <div
            className={`absolute ${currentSize.ring}`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-full h-full border-2 border-transparent border-b-orange-500 border-l-orange-500 rounded-full animate-spin-reverse"></div>
          </div>

          {/* Center icon container */}
          <div
            className={`relative ${currentSize.container} bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-pulse-slow`}
          >
            <ChefHat className={`${currentSize.icon} text-white`} />

            {/* Pulsing glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          </div>

          {/* Orbiting dots */}
          <div className={`absolute ${currentSize.ring}`}>
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${currentSize.dot} bg-amber-400 rounded-full animate-orbit-1`}
            ></div>
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${currentSize.dot} bg-orange-400 rounded-full animate-orbit-2`}
            ></div>
            <div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${currentSize.dot} bg-amber-300 rounded-full animate-orbit-3`}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <p className="text-xl font-semibold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent animate-pulse-slow">
            {message}
          </p>

          {/* Animated dots */}
          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Subtle hint text */}
        <p
          className="text-slate-500 text-sm mt-6 animate-pulse-slow"
          style={{ animationDelay: "0.5s" }}
        >
          Preparing your experience...
        </p>
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

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes orbit-1 {
          0% {
            transform: rotate(0deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(0deg);
          }
          100% {
            transform: rotate(360deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(-360deg);
          }
        }

        @keyframes orbit-2 {
          0% {
            transform: rotate(120deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(-120deg);
          }
          100% {
            transform: rotate(480deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(-480deg);
          }
        }

        @keyframes orbit-3 {
          0% {
            transform: rotate(240deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(-240deg);
          }
          100% {
            transform: rotate(600deg)
              translateX(
                ${size === "sm" ? "28px" : size === "md" ? "40px" : "56px"}
              )
              rotate(-600deg);
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-orbit-1 {
          animation: orbit-1 3s linear infinite;
        }

        .animate-orbit-2 {
          animation: orbit-2 3s linear infinite;
        }

        .animate-orbit-3 {
          animation: orbit-3 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
