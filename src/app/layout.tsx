import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetCode Clone | Engineering Excellence",
  description:
    "A high-performance LeetCode clone built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        {children}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0F0F0F',
              color: '#FFFFFF',
              border: '1px solid #2A2A2A',
              boxShadow: '0 0 15px rgba(255,255,255,0.1)'
            }
          }}
        />
      </body>
    </html>
  );
}
