import {
  BarChart3,
  Brain,
  Code2,
  Database,
  Palette,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";

import type { Category, Course } from "@/services/types";

import { CatalogCourse } from "./types";

export const categories = [
  { label: "All", icon: Sparkles },
  { label: "Web Dev", icon: Code2 },
  { label: "AI & ML", icon: Brain },
  { label: "Data Science", icon: Database },
  { label: "Cybersecurity", icon: Shield },
  { label: "Design", icon: Palette },
  { label: "Mobile", icon: Smartphone },
  { label: "Business", icon: BarChart3 },
];

export const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export const catalogCourses: CatalogCourse[] = [];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop";

const LEVEL_LABEL: Record<string, CatalogCourse["level"]> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function badgeFor(difficulty: string): { badge: string; badgeStyle: string } {
  if (difficulty === "ADVANCED") {
    return { badge: "Advanced", badgeStyle: "bg-white/90 text-black backdrop-blur-md" };
  }
  if (difficulty === "INTERMEDIATE") {
    return {
      badge: "Intermediate",
      badgeStyle: "bg-white/90 text-black backdrop-blur-md",
    };
  }
  return { badge: "Beginner", badgeStyle: "bg-accent-primary text-black" };
}

export function toCatalogCourse(
  course: Course,
  cats: Category[] = [],
): CatalogCourse {
  const { badge, badgeStyle } = badgeFor(course.difficulty);
  const category =
    cats.find((c) => c.id === course.categoryId)?.name ??
    course.category?.name ??
    "General";
  return {
    id: course.id,
    title: course.title,
    description: course.shortDescription ?? course.description ?? "",
    imageUrl: course.imageUrl ?? FALLBACK_IMAGE,
    category,
    level: LEVEL_LABEL[course.difficulty] ?? "Beginner",
    badge,
    badgeStyle,
    price: "₹799",
    originalPrice: "₹2,999",
    lessons: course.unitsCount ?? 0,
    duration: course.estimatedHours ? `${course.estimatedHours}h` : "—",
    enrolled: "—",
    rating: 4.8,
    ratingCount: 0,
    instructor: course.instructor?.fullName ?? "—",
    tags: [category],
    isFeatured: course.isPublished,
  };
}
