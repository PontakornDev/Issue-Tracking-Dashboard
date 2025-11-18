"use client";

import React, { useState, useMemo, useEffect } from "react";
import moment from "moment";
import {
  Statistic,
  Row,
  Col,
  ConfigProvider,
  Empty,
  Spin,
  message,
  Button,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Issue, PRIORITY_LEVELS } from "@/types/issue";
import { Card, Badge, IssueTable } from "@/components/common";
import { FilterBar } from "@/components/FilterBar";
import { IssueDetailDrawer } from "@/components/IssueDetailDrawer";
import { AddIssueModal } from "@/components/AddIssueModal";
import { issueAPI } from "@/api/issueAPI";

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalData, setUseLocalData] = useState(false);
  const [addIssueModalOpen, setAddIssueModalOpen] = useState(false);

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await issueAPI.getIssues();
        setIssues(data);
        setFilteredIssues(data);
        setUseLocalData(false);
      } catch (err) {
        console.error("Failed to fetch from API", err);
        setUseLocalData(true);
        setError("Could not connect to backend API");
        message.warning("Backend API unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      open: issues.filter((i) => i.status?.status_code === "open").length,
      inProgress: issues.filter((i) => i.status?.status_code === "in-progress")
        .length,
      resolved: issues.filter(
        (i) =>
          i.status?.status_code === "resolved" ||
          i.status?.status_code === "closed"
      ).length,
    };
  }, [issues]);

  const tableColumns = [
    {
      title: "Issue ID",
      dataIndex: "issue_id",
      key: "issue_id",
      width: 100,
      render: (id: number) => (
        <span className="font-semibold text-blue-600">ISS-{id}</span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (title: string) => <span className="line-clamp-2">{title}</span>,
    },
    {
      title: "Status",
      dataIndex: ["status", "display_name"],
      key: "status",
      width: 140,
      render: (displayName: string, record: Issue) => {
        const color = record.status?.color;
        return color ? (
          <Badge label={displayName} color={color} />
        ) : (
          <span>{displayName}</span>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: string) => {
        const priorityConfig =
          PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS];
        return priorityConfig ? (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: priorityConfig.color }}
          >
            {priorityConfig.label}
          </span>
        ) : (
          <span>{priority}</span>
        );
      },
    },
    {
      title: "Reporter",
      dataIndex: ["reporter", "full_name"],
      key: "reporter",
      width: 140,
      render: (name: string) => (
        <span className="text-sm text-gray-700">{name || "—"}</span>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 150,
      render: (date: string) => (
        <span className="text-xs text-gray-600">
          {moment(date).format("MMMM Do YYYY, h:mm:ss")}
        </span>
      ),
    },
  ];

  const handleRowClick = (record: Issue) => {
    setSelectedIssue(record);
    setDrawerOpen(true);
  };

  const handleStatusUpdate = (updatedIssue: Issue) => {
    setSelectedIssue(updatedIssue);
    // Update issues list
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.issue_id === updatedIssue.issue_id ? updatedIssue : issue
      )
    );
    setFilteredIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.issue_id === updatedIssue.issue_id ? updatedIssue : issue
      )
    );

    // Refresh issue list from API to get latest data
    const refreshIssues = async () => {
      try {
        const data = await issueAPI.getIssues();
        setIssues(data);
        setFilteredIssues(data);
      } catch (error) {
        console.error("Failed to refresh issues:", error);
      }
    };

    // Call refresh after a short delay to ensure drawer closes first
    setTimeout(() => {
      refreshIssues();
    }, 600);
  };

  const handleIssueCreated = () => {
    // Refresh issues list after new issue created
    setLoading(true);
    issueAPI
      .getIssues()
      .then((data) => {
        setIssues(data);
        setFilteredIssues(data);
        message.success("Issue created and list updated!");
      })
      .catch((err) => {
        console.error("Failed to refresh issues:", err);
        message.error("Failed to refresh issue list");
      })
      .finally(() => setLoading(false));
  };

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Issue Tracking Dashboard
                </h1>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddIssueModalOpen(true)}
                size="large"
              >
                Add Issue
              </Button>
            </div>
            {useLocalData && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <ExclamationCircleOutlined className="text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  Backend API (port 8080) is unavailable. Showing local mock
                  data.
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <Spin size="large" tip="Loading issues..." />
            </div>
          ) : (
            <>
              {/* Statistics */}
              <Row gutter={16} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Issues"
                      value={stats.total}
                      prefix={<FileTextOutlined />}
                      valueStyle={{ color: "#1677ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Open Issues"
                      value={stats.open}
                      prefix={<ExclamationCircleOutlined />}
                      valueStyle={{ color: "#d4380d" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="In Progress"
                      value={stats.inProgress}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Resolved"
                      value={stats.resolved}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Filter Bar */}
              <FilterBar issues={issues} onFilterChange={setFilteredIssues} />

              {/* Issues Table */}
              <div className="mb-6">
                {filteredIssues.length > 0 ? (
                  <IssueTable
                    columns={tableColumns}
                    dataSource={filteredIssues}
                    onRow={(record: Issue) => ({
                      onClick: () => handleRowClick(record),
                      className: "cursor-pointer hover:bg-gray-50",
                    })}
                  />
                ) : (
                  <Card>
                    <Empty description="No issues found" />
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Issue Detail Drawer */}
      <IssueDetailDrawer
        issue={selectedIssue}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Add Issue Modal */}
      <AddIssueModal
        visible={addIssueModalOpen}
        onClose={() => setAddIssueModalOpen(false)}
        onSuccess={handleIssueCreated}
        reporterId={1}
      />
    </ConfigProvider>
  );
}
