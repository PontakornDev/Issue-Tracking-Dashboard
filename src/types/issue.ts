// Status types
export type IssueStatus = "open" | "in-progress" | "closed" | "resolved";
export type Priority = "low" | "medium" | "high" | "critical";

// User interface
export interface User {
  user_id: number;
  full_name: string;
  created_at: string;
  updated_at: string;
}

// Officer interface
export interface Officer {
  officer_id: number;
  full_name: string;
  created_at: string;
  updated_at: string;
}

// Status interface
export interface Status {
  status_id: number;
  status_code: string;
  display_name: string;
  description: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// Comment interface
export interface Comment {
  comment_id: number;
  issue_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: User; // Optional user details
}

// Main Issue interface (matches backend API)
export interface Issue {
  issue_id: number;
  reporter_id: number;
  status_id: number;
  title: string;
  description: string;
  priority: Priority;
  created_at: string;
  updated_at: string;
  reporter: User;
  status: Status;
  comments: Comment[];
  assignee?: Officer; // Optional assignee (officer)
}

// Legacy/UI Status mapping (for color coding)
export const ISSUE_STATUSES: Record<string, { label: string; color: string }> =
  {
    open: { label: "Open", color: "#d4380d" },
    "in-progress": { label: "In Progress", color: "#faad14" },
    closed: { label: "Closed", color: "#1677ff" },
    resolved: { label: "Resolved", color: "#52c41a" },
  };

// Priority levels with colors
export const PRIORITY_LEVELS: Record<
  Priority,
  { label: string; color: string }
> = {
  low: { label: "Low", color: "#1677ff" },
  medium: { label: "Medium", color: "#faad14" },
  high: { label: "High", color: "#ff7a45" },
  critical: { label: "Critical", color: "#d4380d" },
};
