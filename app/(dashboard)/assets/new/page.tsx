import { prisma } from "@/lib/prisma";
import { registerAsset } from "@/app/actions/asset";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RegisterAssetPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "ASSET_MANAGER")) {
    redirect("/assets");
  }

  const categories = await prisma.assetCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/assets" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Assets
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Register New Asset</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the details below to add a new physical asset to the organization.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={async (formData) => {
          "use server";
          await registerAsset(formData);
          redirect("/assets");
        }} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="assetTag" className="block text-sm font-medium text-gray-700">Asset Tag (Unique)</label>
              <input type="text" name="assetTag" id="assetTag" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" placeholder="e.g. LPT-001" />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Asset Name</label>
              <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" placeholder="e.g. MacBook Pro 16" />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="categoryId" name="categoryId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white">
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number</label>
              <input type="text" name="serialNumber" id="serialNumber" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
              <select id="condition" name="condition" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white">
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" placeholder="e.g. Building A, Room 204" />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input id="isSharedBookable" name="isSharedBookable" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isSharedBookable" className="font-medium text-gray-700">Shared / Bookable Resource</label>
              <p className="text-gray-500">Check this if the asset is a shared resource (like a conference room or projector) that requires time-slot booking.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/assets" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Cancel
            </Link>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Register Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
