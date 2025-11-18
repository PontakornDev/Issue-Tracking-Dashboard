import React from "react";
import { Tag } from "./Tag";

interface BadgeProps {
  status: string;
  statusConfig: {
    label: string;
    color: string;
  };
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  statusConfig,
  className = "",
}) => {
  return (
    <Tag
      label={statusConfig.label}
      color="#fff"
      backgroundColor={statusConfig.color}
      className={`text-xs font-bold ${className}`}
    />
  );
};
