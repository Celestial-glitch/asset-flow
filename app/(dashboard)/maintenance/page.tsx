import { getAllMaintenanceRequests } from "@/app/actions/maintenance";
import { auth } from "@/auth";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MaintenanceBoard } from "./MaintenanceBoard";

export default async function MaintenancePage() {
  const session = await auth();
  const requests = await getAllMaintenanceRequests();
  
  const canManage = session?.user?.role === "ADMIN" || session?.user?.role === "ASSET_MANAGER";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Maintenance & Repairs</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage active repair requests across all assets.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/maintenance/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Raise Request
          </Link>
        </div>
      </div>

      <MaintenanceBoard initialRequests={requests} canManage={canManage} />
    </div>
  );
}
