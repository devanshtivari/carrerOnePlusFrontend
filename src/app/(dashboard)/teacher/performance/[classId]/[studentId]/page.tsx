import { StudentDetail } from "@/components/features/teacher/StudentPerformance";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ classId: string; studentId: string }>;
}) {
  const p = await params;
  return <StudentDetail studentId={p.studentId} classId={p.classId} />;
}
