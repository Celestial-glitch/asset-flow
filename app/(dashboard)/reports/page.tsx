import { getDepartmentAllocations, getMaintenanceFrequency, getOverdueAssets } from "@/app/actions/analytics";
import { ReportsCharts } from "./ReportsCharts";

export default async function ReportsPage() {
  const [allocations, maintenance, overdue] = await Promise.all([
    getDepartmentAllocations(),
    getMaintenanceFrequency(),
    getOverdueAssets()
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics & Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          Visualize resource distribution and equipment health across your organization.
        </p>
      </div>

      <ReportsCharts 
        allocations={allocations} 
        maintenance={maintenance} 
        overdue={overdue} 
      />
    </div>
  );
}
