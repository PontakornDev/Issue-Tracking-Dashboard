import React from "react";

interface TagProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  color = "#fff",
  backgroundColor = "#1677ff",
  className = "",
}) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all ${className}`}
      style={{
        color: color,
        backgroundColor: backgroundColor,
        opacity: 0.9,
      }}
    >
      {label}
    </span>
  );
};
