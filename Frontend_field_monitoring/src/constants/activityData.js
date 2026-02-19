import {
  CheckCircle,
  CircleAlert,
  Clock,
} from "lucide-react";

export const recentActivities = [
  {
    Icon: CheckCircle,
    title: "Survey completed",
    description: "DHS - 980/1200 targets reached",
    time: "2 hours ago",
    variant: "activity-success",
  },
  {
    Icon: CircleAlert,
    title: "Data quality issue detected",
    description: "GPS coordinates outside sector boundaries - Grace Mukamana",
    time: "2 hours ago",
    variant: "activity-danger",
  },
  {
    Icon: Clock,
    title: "Survey paused for review",
    description: "SAS",
    time: "24 hours ago",
    variant: "activity-neutral",
  },
];
