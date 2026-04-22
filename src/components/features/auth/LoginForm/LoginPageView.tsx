import React from "react";
import { LoginForm } from "@/components/features/auth";
import AuthPageLayout from "../AuthPageLayout";

const loginImage = {
  src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  alt: "Students collaborating",
};

const loginAvatars = [
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    alt: "User 1",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    alt: "User 2",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    alt: "User 3",
  },
];

export default function LoginPageView() {
  return (
    <AuthPageLayout
      dividerText="Or continue with"
      image={loginImage}
      avatars={loginAvatars}
      leftTitle="Welcome back to Career1Plus"
      leftDescription="Continue your learning journey. Access your courses, track progress, and compete on the class leaderboard."
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
