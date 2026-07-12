import { prisma } from "@/lib/prisma";
import { raiseRequest } from "@/app/actions/maintenance";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NewMaintenancePage() {
  const assets = await prisma.asset.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/maintenance" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Board
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Raise Maintenance Request</h1>
        <p className="mt-2 text-sm text-gray-600">
          Report an issue with an asset. It will be reviewed by the Asset Management team.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={async (formData) => {
          "use server";
          await raiseRequest(formData);
          redirect("/maintenance");
        }} className="space-y-6">
          
          <div>
            <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">Affected Asset</label>
            <select 
              id="assetId" 
              name="assetId" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white"
            >
              <option value="" disabled selected>Select an asset...</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
            <select 
              id="priority" 
              name="priority" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white"
            >
              <option value="LOW">Low - No immediate impact</option>
              <option value="MEDIUM">Medium - Partial impact on work</option>
              <option value="HIGH">High - Severe impact on work</option>
              <option value="CRITICAL">Critical - Completely unusable / Safety Risk</option>
            </select>
          </div>

          <div>
            <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">Issue Description</label>
            <textarea 
              name="issueDescription" 
              id="issueDescription" 
              rows={4}
              required 
              placeholder="Please describe what is wrong with the asset..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" 
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/maintenance" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Cancel
            </Link>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
