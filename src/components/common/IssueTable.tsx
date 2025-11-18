import React from "react";
import { Table as AntTable, TableProps as AntTableProps } from "antd";

interface IssueTableColumn {
  title: string;
  dataIndex: string | string[];
  key: string;
  render?: (text: any, record: any) => React.ReactNode;
  width?: string | number;
  sorter?: boolean | ((a: any, b: any) => number);
}

interface IssueTableProps {
  columns: IssueTableColumn[];
  dataSource: any[];
  loading?: boolean;
  onRow?: (record: any) => {
    onClick?: () => void;
    className?: string;
  };
  pagination?: false | AntTableProps<any>["pagination"];
}

export const IssueTable: React.FC<IssueTableProps> = ({
  columns,
  dataSource,
  loading = false,
  onRow,
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} issues`,
  },
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <AntTable
        columns={columns as AntTableProps<any>["columns"]}
        dataSource={dataSource}
        loading={loading}
        rowKey={(record) => record.issue_id}
        onRow={onRow}
        pagination={pagination}
        className="custom-table"
      />
    </div>
  );
};
