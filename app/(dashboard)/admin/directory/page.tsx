import { prisma } from "@/lib/prisma";
import { updateEmployeeRole } from "@/app/actions/admin-actions";

export default async function DirectoryPage() {
  const users = await prisma.user.findMany({
    include: { department: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Employee Directory</h2>
          <p className="mt-1 text-sm text-gray-500">Manage employee roles and access levels.</p>
        </div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.department?.name || 'Unassigned'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <form action={async (formData) => {
                    "use server";
                    const newRole = formData.get("role") as any;
                    await updateEmployeeRole(user.id, newRole);
                  }}>
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 mr-2 p-1 border"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="DEPARTMENT_HEAD">Department Head</option>
                      <option value="ASSET_MANAGER">Asset Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" className="text-emerald-600 hover:text-emerald-900">Update</button>
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-sm text-gray-500">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
