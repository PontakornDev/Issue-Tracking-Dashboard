import axios, { AxiosInstance } from "axios";
import { Issue, IssueStatus, Officer } from "@/types/issue";

const API_BASE_URL = "http://localhost:8080/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const issueAPI = {
  // Get all issues or filter by status
  getIssues: async (status?: IssueStatus): Promise<Issue[]> => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get<{ data: Issue[] }>("/issues", {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      throw error;
    }
  },

  // Get single issue by ID
  getIssueById: async (id: number): Promise<Issue> => {
    try {
      const response = await axiosInstance.get<Issue>(`/issues/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch issue ${id}:`, error);
      throw error;
    }
  },

  // Create new issue
  createIssue: async (
    issueData: Omit<
      Issue,
      | "issue_id"
      | "created_at"
      | "updated_at"
      | "reporter"
      | "status"
      | "comments"
    >
  ): Promise<Issue> => {
    try {
      const response = await axiosInstance.post<Issue>("/issues", issueData);
      return response.data;
    } catch (error) {
      console.error("Failed to create issue:", error);
      throw error;
    }
  },

  // Update issue status
  updateIssueStatus: async (id: number, status_id: number): Promise<Issue> => {
    try {
      const response = await axiosInstance.patch<Issue>(
        `/issues/${id}/status`,
        { status_id }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update issue ${id} status:`, error);
      throw error;
    }
  },

  // Add comment to issue
  addComment: async (
    id: number,
    comment: string
  ): Promise<{ id: number; message: string }> => {
    try {
      const response = await axiosInstance.post<{
        id: number;
        message: string;
      }>(`/issues/${id}/comment`, { content: comment });
      return response.data;
    } catch (error) {
      console.error(`Failed to add comment to issue ${id}:`, error);
      throw error;
    }
  },

  // Get officers for progress assignment
  getOfficers: async (): Promise<Officer[]> => {
    try {
      const response = await axiosInstance.get<{ data: Officer[] }>(
        "/officers"
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch officers:", error);
      throw error;
    }
  },

  // Update issue status with officer assignment
  updateIssueStatusWithOfficer: async (
    id: number,
    new_status_id: number,
    assignee_id?: number
  ): Promise<Issue> => {
    try {
      const payload: any = { new_status_id };
      if (assignee_id) {
        payload.assignee_id = assignee_id;
      }
      const response = await axiosInstance.patch<Issue>(
        `/issues/${id}/status`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update issue ${id} status:`, error);
      throw error;
    }
  },
};

export default axiosInstance;
