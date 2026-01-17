"use client";

import { ToastContainer as ReactToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      toastClassName="!bg-slate-800/95 !backdrop-blur-sm !border !border-slate-700/50 !rounded-lg !shadow-lg !font-sans !text-sm sm:!text-sm !min-w-[280px] sm:!min-w-[320px] !max-w-[90vw] sm:!max-w-[420px] !p-3 sm:!p-4"
      progressClassName="!bg-gradient-to-r !from-blue-500 !to-cyan-500 !h-1 sm:!h-1.5"
      style={{
        fontFamily: "var(--font-body), sans-serif",
      }}
    />
  );
}
