import { ChapterDetail } from "@/components/features/courses";

export default async function ChapterDetailRoute({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; chapterId: string }>;
}) {
  const { courseId, unitId, chapterId } = await params;
  return <ChapterDetail courseId={courseId} unitId={unitId} chapterId={chapterId} />;
}
