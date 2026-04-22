import { ClassWorkspace } from "@/components/features/teacher/ProjectsLab";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const p = await params;
  return <ClassWorkspace classId={p.classId} />;
}
