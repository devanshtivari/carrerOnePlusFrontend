import React from "react";
import { SignupForm } from "@/components/features/auth";
import AuthPageLayout from "../AuthPageLayout";

const signupImage = {
  src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  alt: "Programming environment",
};

const signupAvatars = [
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    alt: "User 1",
  },
  {
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    alt: "User 2",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    alt: "User 3",
  },
];

export default function SignupPageView() {
  return (
    <AuthPageLayout
      dividerText="Or sign up with"
      image={signupImage}
      avatars={signupAvatars}
      leftTitle="Start your journey with Career1Plus"
      leftDescription="Join thousands of students mastering real-world skills through hands-on courses, projects, and assessments."
    >
      <SignupForm />

      <div className="mt-8 text-center md:hidden">
        <p className="text-[#A1A1AA] text-xs font-medium">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthPageLayout>
  );
}
