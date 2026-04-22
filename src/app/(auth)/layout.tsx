"use client";

import { Navbar } from "@/components/shared/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-bg font-sans text-[#F2F2F2] antialiased min-h-screen flex flex-col selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-brand-bg pt-20">
        {/* Decorative blur backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        {children}
      </main>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-20"></div>
    </div>
  );
}
