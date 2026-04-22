import { CourseOverview } from "@/components/features/courses";

export default async function CourseOverviewRoute({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <CourseOverview courseId={courseId} />;
}
