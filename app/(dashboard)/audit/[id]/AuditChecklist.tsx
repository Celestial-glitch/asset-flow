"use client";
// Force TS update

import { useState } from "react";
import { logAuditItem, closeAuditCycle } from "@/app/actions/audit";
import { AuditItemStatus } from "@prisma/client";
import { CheckCircle2, AlertTriangle, XCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuditChecklist({ cycleId, assets, loggedItems, status, canManage }: { cycleId: string, assets: any[], loggedItems: any[], status: string, canManage: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleLog(assetId: string, itemStatus: AuditItemStatus) {
    if (status === 'CLOSED') return;
    try {
      await logAuditItem(cycleId, assetId, itemStatus);
    } catch (e) {
      alert("Failed to log item");
    }
  }

  async function handleClose() {
    if (!confirm("Are you sure? This will permanently lock the audit and automatically update master asset statuses (Missing -> LOST, Damaged -> MAINTENANCE).")) return;
    setIsSubmitting(true);
    await closeAuditCycle(cycleId);
    setIsSubmitting(false);
    router.push("/audit");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Live Progress</h3>
          <p className="text-3xl font-bold text-gray-900">{loggedItems.length} <span className="text-sm font-medium text-gray-400">/ {assets.length} assets verified</span></p>
        </div>
        {status === 'OPEN' && canManage && (
          <button 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            <Lock className="w-4 h-4" /> Finalize & Close Audit
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {assets.map(asset => {
            const logged = loggedItems.find(i => i.assetId === asset.id);
            const currentStatus = logged?.status;

            return (
              <li key={asset.id} className="p-4 sm:flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {asset.name} 
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">{asset.assetTag}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Master Status: {asset.status}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={status === 'CLOSED'}
                    onClick={() => handleLog(asset.id, AuditItemStatus.VERIFIED)}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold transition-all ${currentStatus === AuditItemStatus.VERIFIED ? 'bg-emerald-600 text-white shadow-inner ring-2 ring-emerald-600 ring-offset-1' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mr-1.5 ${currentStatus === AuditItemStatus.VERIFIED ? 'text-white' : 'text-emerald-600'}`} /> Verified
                  </button>
                  <button 
                    disabled={status === 'CLOSED'}
                    onClick={() => handleLog(asset.id, AuditItemStatus.DAMAGED)}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold transition-all ${currentStatus === AuditItemStatus.DAMAGED ? 'bg-amber-500 text-white shadow-inner ring-2 ring-amber-500 ring-offset-1' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <AlertTriangle className={`w-4 h-4 mr-1.5 ${currentStatus === AuditItemStatus.DAMAGED ? 'text-white' : 'text-amber-500'}`} /> Damaged
                  </button>
                  <button 
                    disabled={status === 'CLOSED'}
                    onClick={() => handleLog(asset.id, AuditItemStatus.MISSING)}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold transition-all ${currentStatus === AuditItemStatus.MISSING ? 'bg-red-600 text-white shadow-inner ring-2 ring-red-600 ring-offset-1' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <XCircle className={`w-4 h-4 mr-1.5 ${currentStatus === AuditItemStatus.MISSING ? 'text-white' : 'text-red-600'}`} /> Missing
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
