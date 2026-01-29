"use client";

import { useEffect } from "react";

export default function DisableZoom() {
  useEffect(() => {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent pinch zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent wheel zoom (Ctrl + scroll)
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("touchend", preventZoom, { passive: false });
    document.addEventListener("touchstart", preventPinchZoom, { passive: false });
    document.addEventListener("touchmove", preventPinchZoom, { passive: false });
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    // Set viewport meta tag programmatically as fallback
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    return () => {
      document.removeEventListener("touchend", preventZoom);
      document.removeEventListener("touchstart", preventPinchZoom);
      document.removeEventListener("touchmove", preventPinchZoom);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  return null;
}

