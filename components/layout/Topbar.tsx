import React from "react";
import { UserCircle, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutUser } from "@/app/actions/auth-actions";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 fixed top-0 w-full z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">AF</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">AssetFlow</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <UserCircle className="w-8 h-8 text-gray-400" />
          <div className="hidden md:block">
            <p className="font-medium text-gray-700 leading-none">{session?.user?.name || "Guest"}</p>
            <p className="text-gray-500 text-xs mt-1 capitalize">{session?.user?.role?.toLowerCase().replace('_', ' ') || "Unauthenticated"}</p>
          </div>
        </div>
        
        {session?.user && (
          <form action={logoutUser}>
            <button type="submit" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors border-l border-gray-200 pl-6 h-8">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
