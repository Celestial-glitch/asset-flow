import Link from "next/link";
import { headers } from "next/headers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Organization Setup</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage departments, asset categories, and the employee directory.
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <Link
            href="/admin/departments"
            className="whitespace-nowrap border-b-2 border-emerald-500 py-4 px-1 text-sm font-medium text-emerald-600"
          >
            Departments
          </Link>
          <Link
            href="/admin/categories"
            className="whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Asset Categories
          </Link>
          <Link
            href="/admin/directory"
            className="whitespace-nowrap border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Employee Directory
          </Link>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {children}
      </div>
    </div>
  );
}
