"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { contentService } from "@/services/content.service";
import { getAssetPath } from "@/utils/assets";

import { navLinks as fallbackNavLinks } from "./data";
import type { NavLink } from "./types";

export default function Navbar() {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState<NavLink[]>(fallbackNavLinks);

  useEffect(() => {
    let cancelled = false;
    contentService
      .navigation()
      .then((nav) => {
        if (!cancelled && Array.isArray(nav.navLinks)) {
          setNavLinks(nav.navLinks);
        }
      })
      .catch(() => {
        // keep fallback
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-border-default"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all">
            <Image src={getAssetPath("/LOGO.svg")} alt="Career1Plus Logo" width={24} height={24} className="object-contain" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Career1Plus
          </span>
        </Link>

        {/* Links */}
        {!pathname.startsWith("/login") && !pathname.startsWith("/signup") && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isHashLink = link.href.startsWith("/#");
              const targetHref = (isHashLink && pathname === "/") 
                ? link.href.substring(1) 
                : link.href;

              return (
                <Link
                  key={link.label}
                  href={targetHref}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-6">
          {pathname.startsWith("/login") ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-400">
                Don&apos;t have an account?
              </span>
              <Link
                href="/signup"
                className="text-white hover:text-white/80 text-sm font-bold transition-colors"
              >
                Join Now
              </Link>
            </div>
          ) : pathname.startsWith("/signup") ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-400">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-white hover:text-white/80 text-sm font-bold transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-neutral-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-[#E5E5E5] transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
