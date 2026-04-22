"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("token");
    const refreshToken = searchParams.get("refresh");

    if (accessToken) {
      sessionStorage.setItem("access_token", accessToken);
    }
    
    if (refreshToken) {
      sessionStorage.setItem("refresh_token", refreshToken);
    }

    // Small delay to ensure storage completes before redirect
    setTimeout(() => {
      if (accessToken) {
        window.location.href = "/student"; // Hard redirect to reset React state cleanly
      } else {
        router.push("/login?error=oauth_failed");
      }
    }, 100);
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0F0F0F]">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white mb-4"></div>
        <p className="text-[#A1A1AA] font-bold">Authenticating...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#0F0F0F]">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white mb-4"></div>
            <p className="text-[#A1A1AA] font-bold">Loading...</p>
          </div>
        </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
