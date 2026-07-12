import { AlertBanner } from "@/components/ui/AlertBanner";
import { KPICard } from "@/components/ui/KPICard";
import { Plus, Calendar, Wrench } from "lucide-react";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard title="Available" value={128} variant="success" />
          <KPICard title="Allocated" value={46} variant="neutral" />
          <KPICard title="Maintenance" value={4} variant="warning" />
          <KPICard title="Active Bookings" value={9} variant="neutral" />
          <KPICard title="Pending Transfers" value={3} variant="neutral" />
          <KPICard title="Upcoming Returns" value={12} variant="neutral" />
        </div>
      </section>

      {/* Alerts */}
      <section>
        <AlertBanner 
          message="3 assets overdue for return - Flagged for followup" 
          type="error" 
        />
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-4">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Register asset
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Calendar className="w-5 h-5" />
          Book resource
        </button>
        <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Wrench className="w-5 h-5" />
          Raise requests
        </button>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white border rounded-xl shadow-sm divide-y">
          {[
            { text: "Laptop AF-0114 - allocated to Priya Shah - IT dept", time: "10 mins ago" },
            { text: "Room 32 - booking confirmed - 2:00 to 3:00 PM", time: "1 hour ago" },
            { text: "Projector AF-0362 - maintenance resolved", time: "2 hours ago" },
          ].map((activity, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <p className="text-gray-700 text-sm">{activity.text}</p>
              <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
