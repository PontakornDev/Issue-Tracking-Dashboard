import React from "react";
import { Tag } from "./Tag";

interface BadgeProps {
  label: string;
  color: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  className = "",
}) => {
  return (
    <Tag
      label={label}
      color="#fff"
      backgroundColor={color}
      className={`text-xs font-bold ${className}`}
    />
  );
};
