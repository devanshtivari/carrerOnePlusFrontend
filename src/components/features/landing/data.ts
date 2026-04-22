import { BookOpen, FolderGit2, ShieldCheck, Trophy } from "lucide-react";
import { CollaborationFeature, FeaturedCourse, FeatureItem, JourneyStep } from "./types";
import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const features: FeatureItem[] = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Curated paths for every grade level, from fundamentals to advanced AI concepts.",
  },
  {
    icon: FolderGit2,
    title: "Project Submission",
    description: "Build and showcase a real-world hands-on project portfolio to the world.",
  },
  {
    icon: Trophy,
    title: "Ranking System",
    description: "Gamified environment where you compete and climb the national leaderboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Exams",
    description: "Integrity-first assessment modules with secure code-based environments.",
  },
];

export const steps: JourneyStep[] = [
  { num: "1", title: "Sign Up", desc: "Create your unique student profile" },
  { num: "2", title: "Choose Course", desc: "Pick a track from Class 6-12" },
  { num: "3", title: "Learn & Practice", desc: "Interactive lessons and coding" },
  { num: "4", title: "Submit Projects", desc: "Build your tech portfolio" },
];

export const featuredCourses: FeaturedCourse[] = [
  {
    id: "c-1",
    title: "AI & Robotics Foundation",
    description: "Learn the basics of logic, patterns, and building your first intelligent bot.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
    level: "Beginner",
    enrolled: "1.2k",
    badgeStyle: "bg-emerald-950/80 text-emerald-300",
    grade: "Class 6-8",
  },
  {
    id: "c-2",
    title: "Game Design & Development",
    description: "Master Unity and C# to bring your imagination to life in 3D worlds.",
    imageUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=600&auto=format&fit=crop",
    level: "Creative",
    enrolled: "850",
    badgeStyle: "bg-amber-950/80 text-amber-300",
    grade: "Class 6-9",
  },
  {
    id: "c-3",
    title: "Full-Stack Web Development",
    description: "Build complete applications using React, Node.js, and modern databases.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    level: "Advanced",
    enrolled: "2.1k",
    badgeStyle: "bg-white/90 text-black",
    grade: "Class 9-10",
  },
  {
    id: "c-4",
    title: "Data Science & Machine Learning",
    description: "Dive deep into data analysis and build predictive models with Python.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    level: "Expert",
    enrolled: "1.5k",
    badgeStyle: "bg-indigo-950/80 text-indigo-300",
    grade: "Class 11-12",
  },
];

export const collaborateFeatures: CollaborationFeature[] = [
  { title: "Integrated LMS", desc: "Seamlessly manage student batches and progress tracking." },
  { title: "Teacher Training", desc: "Workshops for educators to stay ahead of the tech curve." },
  { title: "Innovation Labs", desc: "Setup state-of-the-art tech labs in your campus." },
];
