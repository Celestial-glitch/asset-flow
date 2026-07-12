import { KPICard } from "@/components/ui/KPICard";
import { Plus, Calendar, Wrench } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getDashboardMetrics } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Live overview of your organization's physical assets and resources.
        </p>
      </div>

      {/* Live Metrics Section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Assets Available" value={metrics.assetsAvailable} variant="success" />
          <KPICard title="Assets Allocated" value={metrics.assetsAllocated} variant="neutral" />
          <KPICard title="Active Bookings" value={metrics.activeBookings} variant="neutral" />
          <KPICard title="Maintenance Today" value={metrics.maintenanceToday} variant="warning" />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/assets/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Register Asset
          </Link>
          <Link href="/booking" className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            <Calendar className="w-5 h-5" />
            Book Resource
          </Link>
          <Link href="/maintenance" className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            <Wrench className="w-5 h-5" />
            Raise Maintenance
          </Link>
        </div>
      </section>
    </div>
  );
}
