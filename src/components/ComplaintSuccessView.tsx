import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle,
  FileCheck,
  MapPin,
  Building,
  ArrowRight,
  LayoutDashboard,
  ShieldAlert,
  Calendar,
  Percent,
  Activity,
  Clock,
  Compass
} from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintSuccessViewProps {
  complaint: Complaint | null;
  setActiveTab: (tab: string) => void;
}

export default function ComplaintSuccessView({
  complaint,
  setActiveTab
}: ComplaintSuccessViewProps) {
  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto mt-12 space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">No active incident loaded</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No newly registered complaint is available in the current context.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Priority color config
  const priorityColors = {
    Critical: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/40 dark:text-rose-400',
    High: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/40 dark:text-orange-400',
    Medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/40 dark:text-yellow-400',
    Low: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/40 dark:text-blue-400'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top success badge block */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.15, 1], opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/35 shadow-lg shadow-emerald-500/10"
        >
          <CheckCircle className="w-11 h-11 animate-pulse" />
        </motion.div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-bold font-mono text-emerald-500 uppercase tracking-widest">
            AI Classification & Dispatch Complete
          </p>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
            Complaint Successfully Registered
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Your incident has been securely catalogued, assigned an immutable ticket ID, and routed to the proper field crew.
          </p>
        </div>
      </div>

      {/* Main card with Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative corner flash */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo on left */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Incident Evidence
            </span>
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative group bg-slate-50 dark:bg-slate-950">
              <img
                src={complaint.imageUrl}
                alt={complaint.category}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-black/65 text-[9px] font-mono text-white px-2 py-0.5 rounded border border-slate-800">
                ACTIVE LIFE-CYCLE ASSET
              </div>
            </div>
          </div>

          {/* Details on right */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Ticket ID & status line */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Assigned ID Code
                  </span>
                  <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {complaint.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Registration Date
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-0.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Detected Issue
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    {complaint.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Assigned Department
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-500" />
                    {complaint.department}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    AI Confidence Score
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 font-mono">
                    <Percent className="w-4 h-4 text-indigo-500" />
                    {complaint.confidenceScore || 94}% Match
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Community Impact Score
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 font-mono">
                    <Activity className="w-4 h-4 text-violet-500" />
                    {complaint.communityImpactScore || 75} / 100
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Priority Level
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                        priorityColors[complaint.priority] || priorityColors.Medium
                      }`}
                    >
                      {complaint.priority}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      Score: {complaint.priorityScore}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Estimated Repair Time
                  </span>
                  <span className="text-sm font-bold text-emerald-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {complaint.estimatedRepairTime || '3 Days'}
                  </span>
                </div>
              </div>

              {/* Geospatial specifications */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    Geospatial Address
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{complaint.location.address}</span>
                  </p>
                </div>

                {/* Location sub-details grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/60">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">State</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{complaint.location.state || 'Delhi'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">District</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{complaint.location.district || 'New Delhi'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">City</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{complaint.location.city || complaint.location.village || 'New Delhi'}</p>
                  </div>
                  <div className="space-y-0.5 md:col-span-3 pt-1 border-t border-slate-200/30 dark:border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-blue-500" />
                      GPS Coordinate Pin:
                    </span>
                    <span>
                      LAT: {complaint.location.lat} | LNG: {complaint.location.lng}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Work Order Status</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block uppercase tracking-wide">
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actionable buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 pt-2">
        <button
          onClick={() => setActiveTab('details')}
          className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/15"
          id="success-view-details"
        >
          View Complaint Details
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className="px-5 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
          id="success-track-complaint"
        >
          Track Complaint
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-5 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
          id="success-return-dashboard"
        >
          <LayoutDashboard className="w-4 h-4 text-blue-500" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
