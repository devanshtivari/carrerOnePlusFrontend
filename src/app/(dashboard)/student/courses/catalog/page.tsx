import { redirect } from "next/navigation";

/**
 * The global "Browse Catalog" view was retired once the course listing became
 * class-scoped — every student now only sees the courses intended for their
 * grade on `/student/courses`. We keep this route as a permanent redirect so
 * any bookmarks, old emails, or stray links don't land on a 404.
 */
export default function CatalogRedirect() {
  redirect("/student/courses");
}
