"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sidebar } from "@/components/shared/Sidebar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { authService } from "@/services/auth.service";
import { getAssetPath } from "@/utils/assets";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{fullName: string; role: string} | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  return (
    <AuthGuard>
      <div className="bg-brand-bg font-sans text-[#F2F2F2] antialiased h-screen overflow-hidden flex selection:bg-white selection:text-black">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto ml-0 lg:ml-64 relative">
          {/* Mobile Top Bar */}
          <div className="sticky top-0 z-30 lg:hidden pointer-events-none">
            {/* Backdrop with stronger blur for premium feel */}
            <div className="absolute inset-0 bg-brand-bg/75 backdrop-blur-xl pointer-events-auto" />

            {/* Subtle gradient bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between px-5 py-3 pointer-events-auto">
              {/* Left: Logo */}
              <Link 
                href={user?.role === "TEACHER" ? "/teacher" : "/student"}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <div className="size-6 flex items-center justify-center bg-white rounded shrink-0">
                  <Image src={getAssetPath("/LOGO.svg")} alt="Career1Plus Logo" width={16} height={16} className="object-contain" />
                </div>
                <span className="text-[#F2F2F2] text-base font-bold tracking-tight">
                  Career1Plus
                </span>
              </Link>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Mini User Avatar */}
                <Link
                  href={user?.role === "TEACHER" ? "/teacher/profile" : "/student/profile"}
                  className="size-8 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:border-white/20 transition-colors"
                >
                  {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : "U"}
                </Link>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="size-9 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-surface-300 transition-all cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
