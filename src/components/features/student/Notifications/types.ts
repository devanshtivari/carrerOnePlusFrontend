export interface NotificationItem {
  id: string;
  type: "course" | "achievement" | "feedback" | "alert" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}
