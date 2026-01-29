"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-body), sans-serif" }}
          >
            Access Denied
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            You don't have access to this store. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2.5 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
            >
              Switch Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
