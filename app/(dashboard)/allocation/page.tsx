import { getAllAssets } from "@/app/actions/asset";
import Link from "next/link";
import { ArrowRightLeft, UserCheck } from "lucide-react";

export default async function AllocationPage() {
  const assets = await getAllAssets();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Allocation & Transfer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage who currently holds which assets, assign available equipment, or request transfers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Holder</th>
              <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset: any) => {
              const activeAllocation = asset.allocations?.[0];
              const isAvailable = asset.status === 'AVAILABLE';

              return (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.assetTag} &bull; {asset.category.name}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAvailable ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {asset.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeAllocation ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{activeAllocation.user.name}</span>
                        <span className="text-xs text-gray-500">Since: {new Date(activeAllocation.assignedDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Ready to assign</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isAvailable ? (
                      <Link 
                        href={`/allocation/new?assetId=${asset.id}`}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <UserCheck className="w-4 h-4 mr-1.5" />
                        Allocate
                      </Link>
                    ) : (
                      <button 
                        className="inline-flex items-center text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md transition-colors"
                        onClick={() => {/* Transfer Request Logic for Phase 4 */}}
                        title="Transfer workflow will be implemented in Phase 4"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-1.5" />
                        Request Transfer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {assets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No assets available for allocation. Register assets first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
