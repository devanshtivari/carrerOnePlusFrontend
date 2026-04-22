import { StudentRoster } from "@/components/features/teacher/StudentPerformance";

export default async function ClassRosterPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const p = await params;
  return <StudentRoster classId={p.classId} />;
}
