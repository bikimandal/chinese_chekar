"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathnameRef = useRef<string>(pathname);

  // Function to start the progress bar
  const startProgress = useCallback(() => {
    // Clean up any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Reset and show progress bar immediately
    setIsVisible(true);
    setProgress(0);

    // Simulate progress (YouTube-style: fast start, slow middle, fast end)
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      if (currentProgress >= 90) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      // Variable speed: faster at start, slower in middle
      let increment;
      if (currentProgress < 30) {
        increment = Math.random() * 20 + 10; // Fast start
      } else if (currentProgress < 70) {
        increment = Math.random() * 5 + 2; // Slow middle
      } else {
        increment = Math.random() * 8 + 4; // Medium speed
      }

      currentProgress = Math.min(currentProgress + increment, 90);
      setProgress(currentProgress);
    }, 150);
  }, []);

  // Complete the progress when route change is done
  const completeProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  // Listen for clicks on navigation elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Find the closest link that might trigger navigation
      const link = target.closest("a[href]") as HTMLAnchorElement | null;

      if (link) {
        const href = link.getAttribute("href");

        // Check if it's an internal link (starts with /) and not the same page
        if (href && href.startsWith("/") && href !== pathname) {
          // Check if it's not an external link or special protocol
          if (!href.startsWith("//") && !href.startsWith("http")) {
            startProgress();
          }
        }
      }

      // Also check for buttons that might trigger navigation
      const button = target.closest(
        "button[data-navigate]"
      ) as HTMLButtonElement | null;
      if (button) {
        const navigateTo = button.getAttribute("data-navigate");
        if (
          navigateTo &&
          navigateTo.startsWith("/") &&
          navigateTo !== pathname
        ) {
          startProgress();
        }
      }
    };

    // Listen for custom navigation events (for programmatic navigation)
    const handleNavigation = () => {
      startProgress();
    };

    // Use capture phase to catch clicks early, before navigation
    document.addEventListener("click", handleClick, true);
    window.addEventListener("navigation-start", handleNavigation);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("navigation-start", handleNavigation);
    };
  }, [pathname, startProgress]);

  // Complete progress when pathname changes and page is actually loaded
  useEffect(() => {
    // Only complete if pathname actually changed and progress bar is visible
    if (!isVisible || pathname === previousPathnameRef.current) {
      previousPathnameRef.current = pathname;
      return;
    }

    previousPathnameRef.current = pathname;

    // Wait for the page to actually be ready, not just pathname change
    const checkPageReady = () => {
      // Check if document is ready
      if (document.readyState === "complete") {
        // Wait for React to hydrate and render (double RAF ensures next paint)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Additional small delay to ensure page is fully interactive
            setTimeout(() => {
              completeProgress();
            }, 150);
          });
        });
      } else if (document.readyState === "interactive") {
        // Page is loading but interactive, wait a bit more
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              completeProgress();
            }, 300);
          });
        });
      } else {
        // Page still loading, wait for load event
        const handleLoad = () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                completeProgress();
              }, 150);
            });
          });
        };
        window.addEventListener("load", handleLoad, { once: true });
        return () => window.removeEventListener("load", handleLoad);
      }
    };

    // Small delay to ensure pathname change has processed and navigation started
    const timeout = setTimeout(() => {
      checkPageReady();
    }, 200);

    return () => clearTimeout(timeout);
  }, [pathname, isVisible, completeProgress]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow:
            "0 0 8px rgba(245, 158, 11, 0.6), 0 0 4px rgba(245, 158, 11, 0.4)",
        }}
      />
    </div>
  );
}
