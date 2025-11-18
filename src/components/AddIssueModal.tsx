"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, Space, message, Spin } from "antd";
import { issueAPI } from "@/api/issueAPI";

interface AddIssueModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reporterId?: number;
}

export const AddIssueModal: React.FC<AddIssueModalProps> = ({
  visible,
  onClose,
  onSuccess,
  reporterId = 1, // Default to user 1, can be overridden
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        reporter_id: reporterId,
        assignee_id: values.assignee_id || null,
        status_id: values.status_id || 1, // Default to open (status_id: 1)
        title: values.title,
        description: values.description,
        priority: values.priority || "low",
      };

      // Submit to API
      await issueAPI.createIssue(payload);

      message.success("Issue created successfully!");
      form.resetFields();
      onClose();

      // Trigger parent refresh
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to create issue:", error);
      message.error(error?.response?.data?.message || "Failed to create issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Issue"
      open={visible}
      onCancel={onClose}
      width={600}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Title */}
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter issue title" }]}
          >
            <Input placeholder="e.g., กระเบื้องแตก" disabled={loading} />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="e.g., กระเบื้องแตกจากการชนกระแทก"
              disabled={loading}
            />
          </Form.Item>

          {/* Priority */}
          <Form.Item
            name="priority"
            label="Priority"
            initialValue="low"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select
              placeholder="Select priority"
              disabled={loading}
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Critical", value: "critical" },
              ]}
            />
          </Form.Item>

          {/* Status ID (hidden/optional - defaults to 1 for "open") */}
          <Form.Item name="status_id" label="Status" initialValue={1} hidden>
            <Select disabled={loading} />
          </Form.Item>

          {/* Assignee ID (optional) */}
          <Form.Item name="assignee_id" label="Assignee (Optional)">
            <Select
              placeholder="Leave empty to assign later"
              allowClear
              disabled={loading}
              // Note: In production, fetch officers/users from API
              options={[
                { label: "Officer 1", value: 1 },
                { label: "Officer 2", value: 2 },
                { label: "Officer 3", value: 3 },
              ]}
            />
          </Form.Item>

          {/* Form Actions */}
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Issue
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddIssueModal;
