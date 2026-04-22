import React, { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm";
import AuthPageLayout from "../AuthPageLayout";

const verifyImage = {
  src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
  alt: "Communication connection",
};

const verifyAvatars = [
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    alt: "User A",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?q=80&w=100&auto=format&fit=crop",
    alt: "User B",
  },
];

export default function VerifyEmailPageView() {
  return (
    <AuthPageLayout
      dividerText=""
      image={verifyImage}
      avatars={verifyAvatars}
      leftTitle="Secure Your Account"
      leftDescription="We just sent a 6-digit verification code to your email. Enter it here so we can confirm your identity."
      showSocialAuth={false}
    >
      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthPageLayout>
  );
}
