"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // Cookies are set in the response, redirect immediately
        // The admin page will verify the session
        window.location.href = "/admin";
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md mx-4">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-amber-500/30">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent mb-2">
          Admin Portal
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">Secure access to dashboard</p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm sm:text-base"
              placeholder="admin@chinesechekar.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onKeyPress={(e) => e.key === "Enter" && handleLogin(e as any)}
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30 text-sm sm:text-base"
        >
          {loading ? "Authenticating..." : "Access Dashboard"}
        </button>
      </form>
    </div>
  );
}

