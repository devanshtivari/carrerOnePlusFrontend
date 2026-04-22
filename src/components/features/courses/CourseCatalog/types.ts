export interface CatalogCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  badge: string;
  badgeStyle: string;
  price: string;
  originalPrice?: string;
  lessons: number;
  duration: string;
  enrolled: string;
  rating: number;
  ratingCount: number;
  instructor: string;
  tags: string[];
  isFeatured?: boolean;
}
