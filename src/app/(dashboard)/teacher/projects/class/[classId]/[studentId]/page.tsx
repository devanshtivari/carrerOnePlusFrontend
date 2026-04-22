import { StudentProjectDetailsView } from "@/components/features/teacher/ProjectsLab";

export default async function StudentProjectPage({
  params,
}: {
  params: Promise<{ classId: string; studentId: string }>;
}) {
  const p = await params;
  return <StudentProjectDetailsView classId={p.classId} studentId={p.studentId} />;
}
