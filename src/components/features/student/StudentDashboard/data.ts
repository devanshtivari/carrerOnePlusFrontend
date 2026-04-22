/**
 * NOTE: This file used to export hardcoded `dashboardData` and `announcementBanners`.
 * All data now flows from the backend (`GET /dashboard/student`, `GET /announcements`).
 *
 * The file is intentionally left empty (only re-exports types) so any leftover imports
 * still type-check during the migration period. Components should import directly from
 * `@/services/dashboard.service` and `@/services/announcements.service`.
 */
export type { StudentDashboardData, AnnouncementBannerData } from "./types";
