import { cn } from "@/lib/utils";
import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

export function KPICard({ title, value, variant = "default", className }: KPICardProps) {
  const variantStyles = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-orange-50 border-orange-200 text-orange-900",
    danger: "bg-red-50 border-red-200 text-red-900",
    neutral: "bg-gray-50 border-gray-200 text-gray-900",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
