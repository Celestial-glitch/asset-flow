"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export function ReportsCharts({ allocations, maintenance, overdue }: { allocations: any[], maintenance: any[], overdue: any[] }) {
  
  function downloadCSV() {
    let csv = "Report Type,Category/Department,Value\n";
    
    allocations.forEach(a => csv += `Allocations,${a.name},${a.value}\n`);
    maintenance.forEach(m => csv += `Maintenance Requests,${m.name},${m.value}\n`);
    
    csv += "\nOverdue Assets\nAsset Name,Asset Tag,Assigned To,Expected Return\n";
    overdue.forEach(o => {
      csv += `${o.asset.name},${o.asset.assetTag},${o.user.name},${new Date(o.expectedReturnDate).toLocaleDateString()}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'asset-flow-analytics-report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={downloadCSV}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Allocations by Department</h3>
          <div className="h-72">
            {allocations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-sm text-gray-400">No active allocations</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Maintenance by Category</h3>
          <div className="h-64 flex-1">
             {maintenance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={maintenance} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
                      {maintenance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-sm text-gray-400">No maintenance data</div>
             )}
          </div>
          {maintenance.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-2">
              {maintenance.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Overdue Asset Returns</h3>
            <p className="text-sm text-gray-500 mt-1">Assets that have passed their expected return date.</p>
          </div>
          {overdue.length > 0 && (
             <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">{overdue.length} Overdue</span>
          )}
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected Return</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Overdue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {overdue.map(item => {
              const expected = new Date(item.expectedReturnDate);
              const days = Math.floor((new Date().getTime() - expected.getTime()) / (1000 * 3600 * 24));
              return (
                <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{item.asset.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.asset.assetTag}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{item.user.name}</p>
                    <p className="text-xs text-gray-500">{item.department?.name || 'No Dept'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {expected.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                    {days} days
                  </td>
                </tr>
              )
            })}
            {overdue.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500 border-2 border-dashed border-gray-100 m-4 rounded-lg">
                  Zero overdue assets. Operations are running smoothly!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
