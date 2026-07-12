"use client";

import { useState } from "react";
import { createBooking } from "@/app/actions/booking";
import { CalendarClock, AlertCircle, X } from "lucide-react";

export function BookingModal({ assets }: { assets: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError("");
    try {
      await createBooking(formData);
      setIsOpen(false);
    } catch (e: any) {
      setError(e.message || "Failed to create booking.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
      >
        <CalendarClock className="-ml-1 mr-2 h-5 w-5" />
        New Booking
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Book Resource</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">Shared Resource</label>
                <select name="assetId" id="assetId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border bg-white">
                  <option value="" disabled selected>Select a resource...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>
                  ))}
                </select>
                {assets.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">No bookable resources are currently available.</p>
                )}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="datetime-local" name="startTime" id="startTime" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="datetime-local" name="endTime" id="endTime" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={isPending || assets.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50">
                  {isPending ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
