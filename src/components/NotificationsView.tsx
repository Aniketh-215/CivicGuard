import { useState } from 'react';
import {
  Bell,
  Eye,
  CheckCircle,
  AlertOctagon,
  Clock,
  MailOpen,
  ArrowRight,
  ShieldCheck,
  Building,
  Wrench,
  Trash2
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  setSelectedComplaintId: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function NotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotifications,
  setSelectedComplaintId,
  setActiveTab
}: NotificationsViewProps) {
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Resolved'>('All');

  // Filter list
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Resolved') return n.type === 'Completed';
    return true;
  });

  const handleNotificationClick = (notif: NotificationItem) => {
    onMarkRead(notif.id);
    setSelectedComplaintId(notif.complaintId);
    setActiveTab('details');
  };

  // Icon mapping
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Registered':
        return <Building className="w-4 h-4 text-slate-500" />;
      case 'AI_Analysis':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'Assigned':
        return <Building className="w-4 h-4 text-violet-500" />;
      case 'Repair_Started':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Reopened':
        return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'Verification_Requested':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Registered': return 'bg-slate-100 dark:bg-slate-800';
      case 'AI_Analysis': return 'bg-blue-100 dark:bg-blue-950/40';
      case 'Assigned': return 'bg-violet-100 dark:bg-violet-950/40';
      case 'Repair_Started': return 'bg-amber-100 dark:bg-amber-950/40';
      case 'Completed': return 'bg-emerald-100 dark:bg-emerald-950/40';
      case 'Reopened': return 'bg-rose-100 dark:bg-rose-950/40';
      case 'Verification_Requested': return 'bg-indigo-100 dark:bg-indigo-950/40';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Audited transaction and status alerts pushed dynamically as repairs and AI evaluations advance.
          </p>
        </div>

        {/* Multi actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <MailOpen className="w-4 h-4" /> Mark All Read
          </button>
          <button
            onClick={onClearNotifications}
            className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        </div>
      </div>

      {/* Inbox view */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-xs tracking-wider uppercase">
              Inbox Channels
            </h3>
            
            <div className="flex flex-col gap-1 text-xs">
              {(['All', 'Unread', 'Resolved'] as const).map((ch) => {
                const count = ch === 'All' 
                  ? notifications.length 
                  : ch === 'Unread' 
                  ? notifications.filter(n => !n.isRead).length 
                  : notifications.filter(n => n.type === 'Completed').length;

                return (
                  <button
                    key={ch}
                    onClick={() => setFilter(ch)}
                    className={`w-full px-4 py-3 rounded-xl font-bold flex items-center justify-between text-left transition-all cursor-pointer ${
                      filter === ch
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{ch} Alerts</span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                      filter === ch ? 'bg-white text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 3 Columns List */}
        <div className="lg:col-span-3 space-y-3">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all hover:translate-x-1 cursor-pointer group ${
                    notif.isRead
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400'
                      : 'bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-200 dark:border-blue-900/30 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  {/* Status icon badge */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${getBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Notification text details */}
                  <div className="text-xs flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 font-sans group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-400 font-mono font-bold uppercase">
                      <span>TICKET REF:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{notif.complaintId}</span>
                    </div>
                  </div>

                  {/* Arrow trigger */}
                  <div className="shrink-0 p-1 text-slate-300 group-hover:text-blue-500 transition-colors mt-2">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl text-slate-400 space-y-3.5">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300 font-display">Inbox is Empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  You have cleared all alerts, or there are no notifications matching the current filter state.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

