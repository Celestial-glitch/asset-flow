import { getAuditCycles, createAuditCycle } from "@/app/actions/audit";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";

export default async function AuditHubPage() {
  const session = await auth();
  const cycles = await getAuditCycles();
  const departments = await prisma.department.findMany();
  
  const canManage = session?.user?.role !== "EMPLOYEE";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Audit & Verification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ensure physical inventory matches digital records.
          </p>
        </div>
        {canManage && (
          <div className="mt-4 sm:mt-0 flex gap-3">
             <form action={createAuditCycle} className="flex gap-2">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Audit Name (e.g. Q3 IT)" 
                  required 
                  className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm p-2 border" 
                />
                <select name="departmentId" className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm p-2 border bg-white">
                  <option value="">Global Scope (All)</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
                  <Plus className="-ml-1 mr-2 h-4 w-4" /> Start Audit
                </button>
             </form>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cycles.map((cycle: any) => (
              <tr key={cycle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cycle.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.department?.name || 'Global (All)'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cycle.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {cycle.status}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle.conductedBy.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cycle._count.items} items verified</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/audit/${cycle.id}`} className="text-emerald-600 hover:text-emerald-900 font-semibold">
                    {cycle.status === 'OPEN' ? 'Continue Audit →' : 'View Report'}
                  </Link>
                </td>
              </tr>
            ))}
            {cycles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No audits found. Enter a name and click "Start Audit" to begin a new cycle.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
