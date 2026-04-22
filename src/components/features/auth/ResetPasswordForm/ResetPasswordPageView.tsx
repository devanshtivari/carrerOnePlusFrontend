import React, { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import AuthPageLayout from "../AuthPageLayout";

const resetImage = {
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  alt: "Keyboard and code focus",
};

const verifyAvatars = [
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    alt: "User",
  },
];

export default function ResetPasswordPageView() {
  return (
    <AuthPageLayout
      dividerText=""
      image={resetImage}
      avatars={verifyAvatars}
      leftTitle="Create New Password"
      leftDescription="Enter the OTP you received in your email, along with your secure new password."
      showSocialAuth={false}
    >
      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
