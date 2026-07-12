import { getCombinedLogsAndAlerts } from "@/app/actions/logs";
import { AlertCircle, AlertTriangle, Bell, Clock, Activity } from "lucide-react";

export default async function NotificationsPage() {
  const feed = await getCombinedLogsAndAlerts();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications & Activity Feed</h1>
        <p className="mt-2 text-sm text-gray-600">
          Chronological logs of system events, audit flags, and operational alerts.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {feed.map(item => (
            <li key={item.id} className="p-5 flex gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="mt-1 flex-shrink-0">
                {item.severity === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : item.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : item.type === 'ALERT' ? (
                  <Bell className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Activity className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${
                    item.severity === 'error' ? 'text-red-700' :
                    item.severity === 'warning' ? 'text-amber-700' :
                    'text-gray-900'
                  }`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                {item.type === 'ALERT' && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.severity === 'error' ? 'bg-red-100 text-red-700' :
                      item.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      System Alert
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}

          {feed.length === 0 && (
            <div className="p-12 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No recent activity or alerts to display.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
