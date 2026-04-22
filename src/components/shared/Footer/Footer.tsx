"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Twitter, Linkedin, Instagram } from "lucide-react";

import { contentService } from "@/services/content.service";
import type { FooterContent } from "@/services/types";
import { getAssetPath } from "@/utils/assets";

import { footerLinks as fallbackLinks } from "./data";

const FALLBACK_FOOTER: FooterContent = {
  columns: Object.entries(fallbackLinks).map(([title, links]) => ({ title, links })),
  legal: `© ${new Date().getFullYear()} Career1Plus EdTech Pvt Ltd. All rights reserved.`,
};

export default function Footer() {
  const [footer, setFooter] = useState<FooterContent>(FALLBACK_FOOTER);

  useEffect(() => {
    let cancelled = false;
    contentService
      .footer()
      .then((res) => {
        if (!cancelled) setFooter(res);
      })
      .catch(() => {
        // keep fallback
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-surface-100 border-t border-border-default pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src={getAssetPath("/LOGO.svg")}
                  alt="Career1Plus Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Career1Plus</span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed pr-8">
              Empowering the youth with tech skills that matter. India&apos;s favorite platform for
              school innovators.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/Career1Plus"
                target="_blank"
                className="p-2 bg-surface-300 rounded-full text-neutral-400 hover:text-white hover:bg-surface-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/career1plus-edtech/?viewAsMember=true"
                target="_blank"
                className="p-2 bg-surface-300 rounded-full text-neutral-400 hover:text-white hover:bg-surface-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.instagram.com/career1plus?igsh=OGlrb3h5M3I3YmZi"
                target="_blank"
                className="p-2 bg-surface-300 rounded-full text-neutral-400 hover:text-white hover:bg-surface-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-bold mb-6">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border-default flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">{footer.legal}</p>
          <p className="text-xs text-neutral-500 flex items-center gap-1">
            Made with <span className="text-accent-critical">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
