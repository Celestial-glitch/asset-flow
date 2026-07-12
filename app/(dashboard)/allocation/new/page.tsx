import { prisma } from "@/lib/prisma";
import { allocateAsset } from "@/app/actions/asset";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function NewAllocationPage({
  searchParams,
}: {
  searchParams: { assetId?: string };
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "ASSET_MANAGER" && session.user.role !== "DEPARTMENT_HEAD")) {
    redirect("/allocation");
  }

  // Pre-fetch all available assets and employees to populate dropdowns
  const availableAssets = await prisma.asset.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { name: 'asc' }
  });

  const users = await prisma.user.findMany({
    include: { department: true },
    orderBy: { name: 'asc' }
  });

  // Pre-select asset if passed via URL query
  const defaultAssetId = searchParams?.assetId || "";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/allocation" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Allocations
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assign Asset</h1>
        <p className="mt-2 text-sm text-gray-600">
          Allocate an available asset to an employee. It will instantly update the asset's status.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={async (formData) => {
          "use server";
          await allocateAsset(formData);
          redirect("/allocation");
        }} className="space-y-6">
          
          <div>
            <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">Select Asset</label>
            <select 
              id="assetId" 
              name="assetId" 
              required 
              defaultValue={defaultAssetId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white"
            >
              <option value="" disabled>Select an available asset</option>
              {availableAssets.map((asset: any) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.assetTag})
                </option>
              ))}
            </select>
            {availableAssets.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                No available assets found. Please register a new asset or request a return.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Assign To Employee</label>
            <select 
              id="userId" 
              name="userId" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white"
            >
              <option value="" disabled selected>Select an employee</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.department?.name || 'No Dept'} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="expectedReturnDate" className="block text-sm font-medium text-gray-700">Expected Return Date (Optional)</label>
            <input 
              type="date" 
              name="expectedReturnDate" 
              id="expectedReturnDate" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" 
            />
            <p className="mt-1 text-xs text-gray-500">Leave blank if the allocation is permanent.</p>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/allocation" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={availableAssets.length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
