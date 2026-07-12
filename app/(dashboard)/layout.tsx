import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Topbar />
      <Sidebar />
      <main className="pl-64 pt-16 h-screen">
        <div className="p-8 h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
