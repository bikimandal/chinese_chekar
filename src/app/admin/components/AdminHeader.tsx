import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Home, LogOut } from "lucide-react";
import StoreStatusToggle from "./StoreStatusToggle";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your restaurant inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StoreStatusToggle />
            <Link
              href="/admin/controls"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-xl transition-all duration-300"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Product Templates</span>
            </Link>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-500/50 rounded-xl transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Public Site</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

