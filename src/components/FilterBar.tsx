"use client";

import React, { useState, useMemo } from "react";
import { Select, Button, Space, Input } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Issue } from "@/types/issue";

interface FilterBarProps {
  issues: Issue[];
  onFilterChange: (filtered: Issue[]) => void;
  onAddIssue?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  issues,
  onFilterChange,
  onAddIssue,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Filter issues based on selected filters
  useMemo(() => {
    let filtered = issues;

    if (selectedPriority) {
      filtered = filtered.filter(
        (issue) => issue.priority === selectedPriority
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (issue) => issue.status?.status_code === selectedStatus
      );
    }

    if (searchText) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
          String(issue.issue_id).includes(searchText.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchText.toLowerCase()) ||
          issue.reporter?.full_name
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    onFilterChange(filtered);
  }, [selectedPriority, selectedStatus, searchText, issues, onFilterChange]);

  const handleReset = () => {
    setSelectedPriority(null);
    setSelectedStatus(null);
    setSearchText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <Input.Search
          placeholder="Search issues by title, ID, description, or reporter..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<FilterOutlined />}
          size="large"
          allowClear
        />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <Select
            placeholder="Select Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
            options={[
              { label: "All Status", value: null },
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in-progress" },
              { label: "Closed", value: "closed" },
              { label: "Resolved", value: "resolved" },
            ]}
            size="large"
          />

          {/* Priority Filter */}
          <Select
            placeholder="Select Priority"
            value={selectedPriority}
            onChange={setSelectedPriority}
            allowClear
            options={[
              { label: "All Priorities", value: null },
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ]}
            size="large"
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="large" onClick={handleReset}>
              Reset Filters
            </Button>
            {onAddIssue && (
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={onAddIssue}
              >
                New Issue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
