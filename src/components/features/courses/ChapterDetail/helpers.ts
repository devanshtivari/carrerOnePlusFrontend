import { Lesson } from "./types";

export function getLessonTypeBadge(type: Lesson["type"]) {
  switch (type) {
    case "Quiz":
      return "bg-amber-950/80 text-amber-300";
    case "Lab":
      return "bg-emerald-950/80 text-emerald-300";
    case "Case Study":
      return "bg-white/10 text-white";
    default:
      return "";
  }
}
