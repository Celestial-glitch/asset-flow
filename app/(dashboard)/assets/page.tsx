import { getAllAssets } from "@/app/actions/asset";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AssetsPage() {
  const assets = await getAllAssets();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assets Directory</h1>
          <p className="mt-2 text-sm text-gray-600">
            A comprehensive list of all assets and their current allocation status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/assets/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Register Asset
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Tag</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Holder</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset: any) => {
              const activeAllocation = asset.allocations?.[0];
              
              return (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.assetTag}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      asset.status === 'ALLOCATED' ? 'bg-blue-100 text-blue-800' :
                      asset.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activeAllocation ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{activeAllocation.user.name}</span>
                        <span className="text-xs text-gray-500">{activeAllocation.department?.name || 'No Dept'}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {assets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  No assets found. Click "Register Asset" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
