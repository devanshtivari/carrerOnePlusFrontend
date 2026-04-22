import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import AuthPageLayout from "../AuthPageLayout";

const forgotImage = {
  src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  alt: "Keyboard and code",
};

const verifyAvatars = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    alt: "User 1",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    alt: "User 2",
  },
];

export default function ForgotPasswordPageView() {
  return (
    <AuthPageLayout
      dividerText=""
      image={forgotImage}
      avatars={verifyAvatars}
      leftTitle="Reset Password"
      leftDescription="Lost your password? Don't worry, happens to the best of us. Enter your email and we'll send you recovery instructions."
      showSocialAuth={false}
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
