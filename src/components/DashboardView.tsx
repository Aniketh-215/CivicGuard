import {
  FilePlus,
  Search,
  Bell,
  BarChart3,
  CheckCircle,
  AlertOctagon,
  Clock,
  ShieldAlert,
  ChevronRight,
  BrainCircuit,
  Eye,
  Activity
} from 'lucide-react';
import { Complaint, NotificationItem } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface DashboardViewProps {
  complaints: Complaint[];
  notifications: NotificationItem[];
  setActiveTab: (tab: string) => void;
  setSelectedComplaintId: (id: string) => void;
}

export default function DashboardView({
  complaints,
  notifications,
  setActiveTab,
  setSelectedComplaintId
}: DashboardViewProps) {
  // Stats calculations
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Completed' && c.userVerified
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'Repair Started'
  ).length;
  const criticalCount = complaints.filter((c) => c.priority === 'Critical').length;

  // Pie chart data: Category breakdown
  const categoryDataMap = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value
  }));

  // Bar chart data: Priority breakdown
  const priorityDataMap = complaints.reduce((acc, c) => {
    acc[c.priority] = (acc[c.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const priorityChartData = priorityOrder.map((name) => ({
    name,
    value: priorityDataMap[name] || 0
  }));

  // Recharts custom colors (Blues, Greens, and alert Accents)
  const COLORS = {
    Pothole: '#3b82f6', // blue
    'Broken Streetlight': '#fbbf24', // amber
    Garbage: '#10b981', // emerald
    'Water Leakage': '#06b6d4', // cyan
    'Drain Blockage': '#6366f1', // indigo
    'Open Manhole': '#f43f5e', // rose
    'Traffic Signal Damage': '#8b5cf6', // purple
    'Fallen Tree': '#14b8a6' // teal
  };

  const PRIORITY_COLORS: Record<string, string> = {
    Critical: '#ef4444', // red
    High: '#f97316', // orange
    Medium: '#eab308', // yellow
    Low: '#3b82f6' // blue
  };

  const handleViewComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setActiveTab('details');
  };

  // Mock Agent recent operations log for realism
  const recentAILogs = [
    {
      id: 'l1',
      agent: 'Vision Agent',
      action: 'Identified Pothole on CIV-2026-000245',
      confidence: '98.4%',
      time: '2 hours ago'
    },
    {
      id: 'l2',
      agent: 'Priority Agent',
      action: 'Escalated CIV-2026-000245 to Critical (School Zone + Rainy Forecast)',
      confidence: '94.0%',
      time: '2 hours ago'
    },
    {
      id: 'l3',
      agent: 'Routing Agent',
      action: 'Routed CIV-2026-000248 automatically to Waste Management',
      confidence: '100%',
      time: '5 hours ago'
    },
    {
      id: 'l4',
      agent: 'Duplicate Agent',
      action: 'Scanned 15 nearby reports, no duplicates found for Buena Vista Park',
      confidence: '99.1%',
      time: '8 hours ago'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Title */}
      <div>
        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
          Metropolitan Infrastructure Command Center
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          Real-time municipal health dashboard backed by a synchronized multi-agent AI system.
        </p>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Complaints */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Total Complaints
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">
              {totalCount}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5" /> Live public feed
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
            <FilePlus className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved (Verified) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Resolved & Verified
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">
              {resolvedCount}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Citizen verified closing
            </p>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              In Work / Repairing
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">
              {inProgressCount}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Crew dispatched / Assigned
            </p>
          </div>
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Critical Escalations
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">
              {criticalCount}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" /> High structural safety risks
            </p>
          </div>
          <div className="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-xl font-bold font-display tracking-tight">Need to report something in your neighborhood?</h3>
          <p className="text-blue-100 text-sm max-w-lg">
            Upload an image of a pothole, broken light, or leakage. CivicGuard agents will analyze, geo-locate, priority-score, and route it to local teams instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('report')}
            className="px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl text-sm transition-all hover:bg-slate-50 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <FilePlus className="w-4.5 h-4.5" /> Report Issue
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className="px-5 py-3 bg-blue-500/30 text-white font-semibold rounded-xl text-sm transition-all hover:bg-blue-500/40 border border-white/20 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4.5 h-4.5" /> Track ID
          </button>
        </div>
      </div>

      {/* Recharts Grid (Visual Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
              Complaints by Category
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 dark:text-slate-400 rounded-lg">
              Live Shares
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-400 font-mono">No category data</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {categoryChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: COLORS[item.name as keyof typeof COLORS] || '#94a3b8'
                  }}
                />
                <span className="truncate text-slate-500 dark:text-slate-400">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
              Priority Escalation Distribution
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-500 dark:text-slate-400 rounded-lg">
              Critical Weight
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  fontFamily="monospace"
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  fontFamily="monospace"
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.name] || '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {priorityChartData.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold font-mono tracking-wider">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  {item.value} issues
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bottom Grid: Recent Complaints + AI Live Agent Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Complaints Table */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
                Recent Public Reports
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">Showing newest active community uploads.</p>
            </div>
            <button
              onClick={() => setActiveTab('nearby')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View on Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
                {complaints.slice(0, 5).map((complaint) => {
                  // Badges configurations
                  const priorityColors = {
                    Critical: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/30 dark:text-rose-400',
                    High: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/30 dark:text-orange-400',
                    Medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/30 dark:text-yellow-400',
                    Low: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/30 dark:text-blue-400'
                  };

                  const statusColors = {
                    Registered: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                    'Under Review': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
                    Assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                    'Repair Started': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
                    Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
                    Reopened: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  };

                  return (
                    <tr
                      key={complaint.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {complaint.id}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {complaint.category}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {complaint.location.landmark || complaint.location.address}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                            priorityColors[complaint.priority]
                          }`}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold ${
                            statusColors[complaint.status]
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleViewComplaint(complaint.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          title="View complete details and agent analysis"
                          id={`btn-view-${complaint.id}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Multi-Agent Live Feed */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <h4 className="font-display font-semibold text-white text-base">
                  Live Agent Operations Feed
                </h4>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <p className="text-slate-400 text-xs mb-4.5 font-sans leading-relaxed">
              Monitoring active background workflows as neural agents classify, route, and weight community reports.
            </p>

            <div className="space-y-4">
              {recentAILogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950/65 rounded-xl border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700/50 transition-colors"
                >
                  <div className="p-1 bg-emerald-950/80 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 font-mono text-[10px]">
                        [{log.agent}]
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed font-sans">
                      {log.action}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <span>CONFIDENCE:</span>
                      <span className="text-emerald-400 font-bold">{log.confidence}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('agents')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all font-mono text-center block cursor-pointer"
            >
              Inspect Agent Architecture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
