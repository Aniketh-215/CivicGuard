import React, { useState } from 'react';
import { Search, Compass, AlertCircle, Sparkles, Building, Clock, MapPin } from 'lucide-react';
import { Complaint } from '../types';
import ComplaintDetailsView from './ComplaintDetailsView';

interface TrackComplaintViewProps {
  complaints: Complaint[];
  onReopenComplaint: (id: string, comment: string, newImage: string) => void;
  onVerifyResolved: (id: string, comment: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function TrackComplaintView({
  complaints,
  onReopenComplaint,
  onVerifyResolved,
  setActiveTab
}: TrackComplaintViewProps) {
  const [searchId, setSearchId] = useState('');
  const [matchedComplaint, setMatchedComplaint] = useState<Complaint | null>(null);
  const [errorState, setErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setErrorState(false);

    // Simulate database lookup latency
    setTimeout(() => {
      const found = complaints.find(
        (c) => c.id.toLowerCase() === searchId.trim().toLowerCase()
      );
      if (found) {
        setMatchedComplaint(found);
      } else {
        setMatchedComplaint(null);
        setErrorState(true);
      }
      setIsLoading(false);
    }, 600);
  };

  const handleSelectIDPreset = (id: string) => {
    setSearchId(id);
    const found = complaints.find((c) => c.id === id);
    if (found) {
      setMatchedComplaint(found);
      setErrorState(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
          Track Incident Progression
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          Enter a valid CivicGuard ticket ID to inspect work-orders, priority weights, and dispatch schedules.
        </p>
      </div>

      {/* Lookup search bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Ticket ID (e.g., CIV-2026-000245)"
              className="w-full pl-11 pr-4 py-3.5 text-sm font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/15 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Search Database'
            )}
          </button>
        </form>

        {/* Preset recommendations */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-slate-400 font-mono font-bold uppercase text-[10px]">Indexed Samples:</span>
          {complaints.slice(0, 3).map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectIDPreset(c.id)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 font-mono font-bold transition-all cursor-pointer border border-transparent hover:border-blue-500/10 text-[10px]"
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Result presentation area */}
      <div className="pt-2">
        {isLoading && (
          <div className="text-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Syncing metadata ledgers...</p>
          </div>
        )}

        {!isLoading && errorState && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Ticket ID Not Found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                The identifier code <strong>"{searchId}"</strong> does not match any enqueued tickets in the GIS records. Make sure the casing is correct.
              </p>
            </div>
          </div>
        )}

        {!isLoading && matchedComplaint && (
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-6 animate-in slide-in-from-bottom-4 duration-300">
            <ComplaintDetailsView
              complaint={matchedComplaint}
              onReopenComplaint={onReopenComplaint}
              onVerifyResolved={onVerifyResolved}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {!isLoading && !matchedComplaint && !errorState && (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl max-w-md mx-auto space-y-4">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
            <div>
              <h4 className="font-display font-bold text-slate-700 dark:text-slate-300">Awaiting Lookup ID</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Enter a ticket ID above or click one of the index presets to track municipal work-orders in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

