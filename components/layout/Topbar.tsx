import React from "react";
import { UserCircle } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 fixed top-0 w-full z-10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">AF</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">AssetFlow</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <UserCircle className="w-8 h-8 text-gray-400" />
          <div className="hidden md:block">
            <p className="font-medium text-gray-700 leading-none">John Admin</p>
            <p className="text-gray-500 text-xs mt-1">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
