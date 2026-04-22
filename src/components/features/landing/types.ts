import { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface JourneyStep {
  num: string;
  title: string;
  desc: string;
}

export interface FeaturedCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  enrolled: string;
  badgeStyle: string;
  grade: string;
}

export interface CollaborationFeature {
  title: string;
  desc: string;
}
