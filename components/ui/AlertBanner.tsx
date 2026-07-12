import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

interface AlertBannerProps {
  message: string;
  type?: "info" | "warning" | "error" | "success";
  className?: string;
}

export function AlertBanner({ message, type = "info", className }: AlertBannerProps) {
  const typeStyles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
  };

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
  }[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl border text-sm font-medium",
        typeStyles[type],
        className
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
