import { prisma } from "@/lib/prisma";
import { createDepartment } from "@/app/actions/admin-actions";

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: { head: true, _count: { select: { users: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
          <p className="mt-1 text-sm text-gray-500">A list of all departments in your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form action={createDepartment} className="space-y-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900">Add Department</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-emerald-500 transition">Save Department</button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dept.description || '-'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{dept._count.users}</td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-sm text-gray-500">No departments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
