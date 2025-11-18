"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Drawer,
  Divider,
  Button,
  Space,
  Select,
  Input,
  message,
  Spin,
  Modal,
} from "antd";
import { Issue, PRIORITY_LEVELS, Officer } from "@/types/issue";
import { Tag } from "@/components/common";
import { issueAPI } from "@/api/issueAPI";

interface IssueDetailDrawerProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate?: (updatedIssue: Issue) => void;
}

export const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({
  issue,
  open,
  onClose,
  onStatusUpdate,
}) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(
    null
  );

  // Fetch officers when drawer opens - MUST be before null check
  useEffect(() => {
    if (open && issue) {
      const fetchOfficers = async () => {
        try {
          const data = await issueAPI.getOfficers();
          setOfficers(data);
        } catch (error) {
          console.error("Failed to fetch officers:", error);
        }
      };
      fetchOfficers();
    }
  }, [open, issue]);

  if (!issue) return null;

  //   const statusConfig = issue.status
  //     ? ISSUE_STATUSES[issue.status.status_code as keyof typeof ISSUE_STATUSES]
  //     : undefined;
  const priorityConfig =
    PRIORITY_LEVELS[issue.priority as keyof typeof PRIORITY_LEVELS];

  // Map status display names to IDs (you may need to adjust this based on your backend)
  const statusToIdMap: Record<string, number> = {
    open: 1,
    "in-progress": 2,
    closed: 3,
  };

  const handleStatusChange = async (newStatusCode: string) => {
    if (newStatusCode === issue.status?.status_code) return;

    // Check if transitioning from "open" to "in-progress"
    if (
      issue.status?.status_code === "open" &&
      newStatusCode === "in-progress"
    ) {
      // Show officer selection modal
      setPendingStatusChange(newStatusCode);
      setShowOfficerModal(true);
      return;
    }

    // For other transitions, update normally
    try {
      setLoading(true);
      const newStatusId = statusToIdMap[newStatusCode] || 1;
      const updatedIssue = await issueAPI.updateIssueStatusWithOfficer(
        issue.issue_id,
        newStatusId
      );
      message.success(`Issue status updated to ${newStatusCode}`);
      if (onStatusUpdate) {
        onStatusUpdate(updatedIssue);
      }
      // Close drawer after successful status update
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      message.error("Failed to update issue status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerSelect = async () => {
    if (!selectedOfficer) {
      message.warning("Please select an officer");
      return;
    }

    if (!pendingStatusChange) return;

    try {
      setLoading(true);
      const newStatusId = statusToIdMap[pendingStatusChange] || 1;
      const updatedIssue = await issueAPI.updateIssueStatusWithOfficer(
        issue.issue_id,
        newStatusId,
        selectedOfficer
      );
      message.success(
        `Issue status updated to ${pendingStatusChange} and assigned to officer`
      );
      setShowOfficerModal(false);
      setSelectedOfficer(null);
      setPendingStatusChange(null);
      if (onStatusUpdate) {
        onStatusUpdate(updatedIssue);
      }
      // Close drawer after successful status update
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      message.error("Failed to update issue status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    try {
      setLoading(true);
      await issueAPI.addComment(issue.issue_id, comment);
      message.success("Comment added successfully");
      setComment("");
    } catch (error) {
      message.error("Failed to add comment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>
            ISS-{issue.issue_id} - {issue.title}
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
    >
      <Spin spinning={loading}>
        <div className="space-y-6">
          {/* Status and Priority */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Status & Priority
            </h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Select
                value={issue.status?.status_code}
                onChange={handleStatusChange}
                style={{ width: 150 }}
                options={[
                  { label: "Open", value: "open" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Closed", value: "closed" },
                ]}
              />
              {priorityConfig && (
                <Tag
                  label={priorityConfig.label}
                  color="#fff"
                  backgroundColor={priorityConfig.color}
                />
              )}
            </div>
          </div>

          <Divider />

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {issue.description}
            </p>
          </div>

          <Divider />

          {/* Reporter Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Reporter
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {issue.reporter?.full_name || "—"}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Assignee
              </h3>
              <p className="text-gray-700 text-sm font-medium">
                {issue.assignee?.full_name || "—"}
              </p>
            </div>
          </div>

          <Divider />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Created
              </h3>
              <p className="text-gray-600 text-sm">
                {moment(issue.created_at).format("MMMM Do YYYY, h:mm:ss")}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Updated
              </h3>
              <p className="text-gray-600 text-sm">
                {moment(issue.updated_at).format("MMMM Do YYYY, h:mm:ss")}
              </p>
            </div>
          </div>

          <Divider />

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Comments ({issue.comments?.length || 0})
            </h3>
            {issue.comments && issue.comments.length > 0 ? (
              <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
                {issue.comments.map((cmt) => (
                  <div key={cmt.comment_id} className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 font-semibold">
                      {cmt.user?.full_name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-700">{cmt.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {moment(cmt.created_at).format("MMMM Do YYYY, h:mm:ss")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No comments yet</p>
            )}

            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Add Comment
            </h4>
            <div className="space-y-2">
              <Input.TextArea
                placeholder="Enter your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                disabled={loading}
              />
              <Button
                type="primary"
                onClick={handleAddComment}
                disabled={!comment.trim() || loading}
                loading={loading}
              >
                Submit Comment
              </Button>
            </div>
          </div>

          <Divider />

          {/* Actions */}
          <div className="flex gap-2">
            <Space>
              <Button>Edit Issue</Button>
              <Button danger onClick={onClose}>
                Close
              </Button>
            </Space>
          </div>
        </div>
      </Spin>

      {/* Officer Selection Modal */}
      <Modal
        title="Assign Officer"
        open={showOfficerModal}
        onOk={handleOfficerSelect}
        onCancel={() => {
          setShowOfficerModal(false);
          setSelectedOfficer(null);
          setPendingStatusChange(null);
        }}
        loading={loading}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please select an officer to assign to this issue when moving to{" "}
            &quot;In Progress&quot;
          </p>
          <Select
            placeholder="Select Officer"
            value={selectedOfficer}
            onChange={setSelectedOfficer}
            options={officers.map((officer) => ({
              label: officer.full_name,
              value: officer.officer_id,
            }))}
            style={{ width: "100%" }}
            size="large"
          />
        </div>
      </Modal>
    </Drawer>
  );
};
