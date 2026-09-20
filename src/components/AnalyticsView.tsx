import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  PieChart as PieIcon,
  ShieldAlert,
  Sliders,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart,
  Grid
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart as ReBarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Complaint } from '../types';

interface AnalyticsViewProps {
  complaints: Complaint[];
}

export default function AnalyticsView({ complaints }: AnalyticsViewProps) {
  const [selectedWard, setSelectedWard] = useState<number | null>(12);

  // 1. Monthly Trend Data (mock timeline)
  const monthlyTrendsData = [
    { month: 'Feb', complaints: 32, resolved: 28 },
    { month: 'Mar', complaints: 48, resolved: 40 },
    { month: 'Apr', complaints: 52, resolved: 49 },
    { month: 'May', complaints: 68, resolved: 58 },
    { month: 'Jun', complaints: 85, resolved: 74 },
    { month: 'Jul', complaints: complaints.length + 15, resolved: complaints.length + 5 }
  ];

  // 2. Department Performance data (calculated dynamically or enriched)
  const deptPerformanceData = [
    { name: 'Public Works', active: 5, avgHours: 14 },
    { name: 'Municipality', active: 3, avgHours: 8 },
    { name: 'Electricity', active: 2, avgHours: 10 },
    { name: 'Water Auth', active: 4, avgHours: 12 },
    { name: 'Traffic Dept', active: 1, avgHours: 4 }
  ];

  // 3. Category Data Map
  const categoryCount = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#10b981', '#fbbf24', '#f43f5e', '#6366f1', '#a855f7', '#06b6d4', '#14b8a6'];

  // 4. Heatmap Ward list data
  const wardsHeatmap = Array.from({ length: 16 }, (_, i) => {
    const wardNum = i + 1;
    // Set mock densities (e.g. Ward 12 is critical, Ward 3 is high, etc.)
    let density = 'Low';
    let color = 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200';
    let count = 2;

    if (wardNum === 12) {
      density = 'Critical';
      color = 'bg-rose-500/80 text-white font-bold ring-4 ring-rose-500/10 animate-pulse';
      count = 24;
    } else if (wardNum === 3 || wardNum === 7) {
      density = 'High';
      color = 'bg-orange-500/60 text-white font-bold';
      count = 14;
    } else if (wardNum === 8 || wardNum === 15) {
      density = 'Medium';
      color = 'bg-yellow-500/40 text-slate-900 dark:text-white font-semibold';
      count = 8;
    } else if (wardNum === 1 || wardNum === 5) {
      density = 'Resolved';
      color = 'bg-emerald-500/30 text-emerald-800 dark:text-emerald-400';
      count = 0;
    }

    return { wardNum, density, color, count };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
            Metropolitan Analytics Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Leverage dynamic regression charts, predictive AI models, and geographic heatmaps to predict metropolitan failure rates.
          </p>
        </div>
      </div>

      {/* Top row: Area Trend Chart + Department responsiveness Bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
                Metropolitan Filing Trends
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Filing growth vs. resolved audit metrics.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorComplaints)"
                  name="Total Claims"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  name="Verified Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department performance bar chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
                Department Responsiveness
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Average hours taken from dispatch to completion.</p>
            </div>
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={deptPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontFamily="sans-serif" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar dataKey="avgHours" fill="#10b981" radius={[4, 4, 0, 0]} name="Avg Resolution (Hours)" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row: Ward Heatmap Grid + AI Predictive degradation Card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap Grid */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-semibold text-slate-800 dark:text-white text-base">
                Metropolitan Ward Density Heatmap
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Dynamic visual distribution of unsolved issues in the city wards.</p>
            </div>
            <Grid className="w-5 h-5 text-slate-500" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {wardsHeatmap.map((w) => {
              const isSelected = selectedWard === w.wardNum;
              return (
                <button
                  key={w.wardNum}
                  onClick={() => setSelectedWard(w.wardNum)}
                  className={`aspect-square p-3 rounded-2xl border border-slate-200/40 dark:border-slate-700/30 flex flex-col justify-between text-left transition-all cursor-pointer relative ${
                    w.color
                  } ${isSelected ? 'ring-2 ring-blue-500 scale-[1.03] z-10' : 'hover:scale-[1.01]'}`}
                >
                  <span className="font-mono font-bold text-xs">Ward {w.wardNum}</span>
                  <div className="leading-tight text-right mt-auto">
                    <p className="text-lg font-black font-mono">{w.count}</p>
                    <p className="text-[8px] uppercase tracking-wider font-semibold opacity-85">{w.density}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Ward detail indicator */}
          {selectedWard !== null && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-white font-display">Ward {selectedWard} Analysis</p>
                <p className="text-slate-400 mt-0.5">
                  {selectedWard === 12
                    ? 'CRITICAL ALERT: Ward 12 is exhibiting severe pavement cavitation near schools. Dispatch crew escalated.'
                    : selectedWard === 3 || selectedWard === 7
                    ? 'High volume alert. Standard streetlight luminaire failure backlog detected.'
                    : 'Within normal environmental bounds. Backlog cleared.'}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider ${
                selectedWard === 12 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {selectedWard === 12 ? 'Critical Alert' : 'Inspected'}
              </span>
            </div>
          )}
        </div>

        {/* AI Predictive Degradation Card */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <h4 className="font-display font-semibold text-white text-base">
                AI Predictive Analytics
              </h4>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Neural predictive networks ingest rainfall patterns, pavement age registers, and traffic load tensors to prognosticate failures before they occur.
            </p>

            {/* Prediction Card details */}
            <div className="p-4.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-3.5">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <span className="font-bold font-mono text-[10px] uppercase tracking-wider">
                  Ward 12 Roadbed Prognostic
                </span>
              </div>
              <div>
                <p className="text-slate-300 font-semibold text-xs leading-relaxed font-display">
                  "Roadbed deterioration forecast to increase 40% in Ward 12 over next 60 days."
                </p>
                <p className="text-slate-500 text-[10px] leading-relaxed mt-2.5 font-sans">
                  <strong>Trigger factors:</strong> Silt blockages inside local drains, cumulative depth anomalies, and upcoming heavy storm season.
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3 text-[10px] text-slate-500 font-mono flex justify-between">
                <span>RELIABILITY INDEX:</span>
                <span className="text-emerald-400 font-bold">92.4% Accurate</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border border-emerald-500/10">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400 animate-bounce" />
              <p className="leading-relaxed">
                <strong>Proactive dispatch:</strong> Pre-emptive sewer dredging enqueued for Ward 12 to mitigate storm flooding risk!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

