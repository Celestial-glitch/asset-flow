"use client";

import { useState } from "react";
import { updateMaintenanceStatus } from "@/app/actions/maintenance";
import { MaintenanceStatus } from "@prisma/client";

export function MaintenanceBoard({ initialRequests, canManage }: { initialRequests: any[], canManage: boolean }) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  async function handleStatusChange(requestId: string, newStatus: MaintenanceStatus) {
    setIsUpdating(requestId);
    try {
      await updateMaintenanceStatus(requestId, newStatus);
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setIsUpdating(null);
    }
  }

  const columns = [
    { title: "Pending", status: MaintenanceStatus.PENDING, bg: "bg-gray-50 border-gray-200" },
    { title: "In Progress", status: [MaintenanceStatus.APPROVED, MaintenanceStatus.IN_PROGRESS], bg: "bg-blue-50 border-blue-100" },
    { title: "Resolved", status: MaintenanceStatus.RESOLVED, bg: "bg-emerald-50 border-emerald-100" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => {
        const colRequests = initialRequests.filter(req => 
          Array.isArray(col.status) ? col.status.includes(req.status) : req.status === col.status
        );

        return (
          <div key={col.title} className={`rounded-xl border p-4 ${col.bg}`}>
            <h3 className="font-semibold text-gray-900 mb-4">{col.title} <span className="text-gray-500 text-sm font-normal">({colRequests.length})</span></h3>
            <div className="space-y-4">
              {colRequests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-500">{req.asset.assetTag}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      req.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      req.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {req.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{req.asset.name}</h4>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-1">{req.issueDescription}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
                    <span>{req.requestedBy.name}</span>
                    <span>{new Date(req.dateRequested).toLocaleDateString()}</span>
                  </div>

                  {canManage && req.status !== MaintenanceStatus.RESOLVED && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                      {req.status === MaintenanceStatus.PENDING && (
                        <button 
                          disabled={isUpdating === req.id}
                          onClick={() => handleStatusChange(req.id, MaintenanceStatus.IN_PROGRESS)}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded flex-1 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          Approve & Start
                        </button>
                      )}
                      {(req.status === MaintenanceStatus.APPROVED || req.status === MaintenanceStatus.IN_PROGRESS) && (
                        <button 
                          disabled={isUpdating === req.id}
                          onClick={() => handleStatusChange(req.id, MaintenanceStatus.RESOLVED)}
                          className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded flex-1 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {colRequests.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  No tickets
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
