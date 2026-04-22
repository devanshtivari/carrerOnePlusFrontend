import type { ClassItem } from "@/services/classes.service";
import type { LabItem } from "@/services/types";

import type {
  ClassDetail,
  ClassRoster,
  LabStatus,
  ProjectsLabData,
} from "./types";

export const projectsLabData: ProjectsLabData = {
  stats: [],
  projectProgress: [],
  labStatus: [],
  classes: [],
};

export const classRosters: Record<string, ClassRoster> = {};

export function toLabStatus(item: LabItem): LabStatus {
  const status: LabStatus["status"] =
    item.status === "OPERATIONAL"
      ? "Available"
      : item.status === "MAINTENANCE"
        ? "Maintenance"
        : "High Traffic";
  return {
    id: item.id,
    serverName: item.name,
    status,
    uptime: item.uptimeNote ?? (status === "Available" ? "Running smoothly" : "Needs attention"),
  };
}

export function toClassDetail(cls: ClassItem, activeProjects = 0): ClassDetail {
  return {
    id: cls.id,
    className: cls.name,
    activeProjects,
  };
}
