import { UnitOverview } from "@/components/features/courses";

export default async function UnitOverviewRoute({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string }>;
}) {
  const { courseId, unitId } = await params;
  return <UnitOverview courseId={courseId} unitId={unitId} />;
}
