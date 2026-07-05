import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Upload,
  RefreshCw,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface ComplaintDetailsViewProps {
  complaint: Complaint | null;
  onReopenComplaint: (id: string, comment: string, newImage: string) => void;
  onVerifyResolved: (id: string, comment: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function ComplaintDetailsView({
  complaint,
  onReopenComplaint,
  onVerifyResolved,
  setActiveTab
}: ComplaintDetailsViewProps) {
  const [verificationMode, setVerificationMode] = useState<'prompt' | 'yes' | 'no' | 'saved'>(
    complaint?.userVerified ? 'saved' : 'prompt'
  );
  
  // Reopen inputs
  const [comment, setComment] = useState('');
  const [reopenImage, setReopenImage] = useState('');

  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto mt-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">Dossier not found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No incident has been selected. Select an active report from the Dashboard or search via Track Complaint.
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

  const handleVerifyYes = () => {
    onVerifyResolved(complaint.id, 'Citizen verified repair completed successfully.');
    setVerificationMode('saved');
  };

  const handleVerifyNo = () => {
    setVerificationMode('no');
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = reopenImage || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600';
    onReopenComplaint(complaint.id, comment, finalImage);
    setVerificationMode('prompt'); // Reset state
    setComment('');
    setReopenImage('');
  };

  const handleSimulateDisputeUpload = () => {
    // Inject a high quality photo of unresolved infrastructure
    setReopenImage('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600');
  };

  // Timeline list setup
  const workflowStages: { status: ComplaintStatus; label: string }[] = [
    { status: 'Registered', label: 'Registered' },
    { status: 'Under Review', label: 'Under Review' },
    { status: 'Assigned', label: 'Assigned' },
    { status: 'Repair Started', label: 'Repair Started' },
    { status: 'Completed', label: 'Completed' }
  ];

  // Derive current active stage index
  const activeIndex = workflowStages.findIndex((s) => s.status === complaint.status);

  // Priority color config
  const priorityColors = {
    Critical: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/40 dark:text-rose-400',
    High: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/40 dark:text-orange-400',
    Medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/40 dark:text-yellow-400',
    Low: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/40 dark:text-blue-400'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back to Dashboard bar */}
      <div>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard Feed
        </button>
      </div>

      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
              {complaint.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                priorityColors[complaint.priority]
              }`}
            >
              {complaint.priority}
            </span>
            {complaint.status === 'Reopened' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-rose-500 text-white">
                Disputed / Reopened
              </span>
            )}
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
            {complaint.category} Dossier
          </h2>
          <p className="text-slate-400 text-xs flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" /> Registered: {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Big status pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-[9px] font-bold uppercase tracking-wider font-mono text-slate-400">Status</p>
            <p className="mt-0.5 text-slate-800 dark:text-slate-100 font-display">{complaint.status}</p>
          </div>
          <div className="px-4 py-2.5 bg-blue-500/10 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200/20">
            <p className="text-[9px] font-bold uppercase tracking-wider font-mono text-blue-400">Risk Score</p>
            <p className="mt-0.5 font-mono">{complaint.priorityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Map pin on left, Image & Citizen verify on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Metadata Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-base">
              Incident Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">Geographic Address</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start gap-2">
                  <MapPin className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{complaint.location.address}</span>
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">Department Jurisdiction</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start gap-2">
                  <Building className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{complaint.department}</span>
                </p>
              </div>
            </div>

            {/* Detailed Location Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/45 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-[11px]">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Nearest Landmark</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={complaint.location.landmark}>{complaint.location.landmark || 'None detected'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">State</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={complaint.location.state}>{complaint.location.state || 'N/A'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">District</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={complaint.location.district}>{complaint.location.district || 'N/A'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">City / Town</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={complaint.location.city || complaint.location.village}>{complaint.location.city || complaint.location.village || 'N/A'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Pincode</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300 font-mono truncate">{complaint.location.pincode || 'N/A'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">GPS Coordinates</span>
                <p className="font-mono text-[10px] font-semibold text-slate-500 truncate">
                  {complaint.location.lat.toFixed(5)}, {complaint.location.lng.toFixed(5)}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">Citizen Problem Report</span>
              <p className="font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Neural Weight parameters list */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2.5">
              <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                AI Agent Calculated Risk weights
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                {complaint.priorityReason.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive timeline map card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-base">
              Repair Life-Cycle Timeline
            </h3>

            {/* Graphic Timeline dots */}
            <div className="relative pl-6 space-y-6 border-l border-slate-200 dark:border-slate-800 ml-4">
              {complaint.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Glowing active indicator node */}
                  <span className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    event.active
                      ? 'bg-blue-600 dark:bg-blue-500 border-blue-200 dark:border-blue-900 animate-pulse ring-4 ring-blue-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                  }`}>
                    {event.active && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>

                  <div className="text-xs space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200 font-display">
                        {event.status}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Photo + Citizen verification box */}
        <div className="space-y-6">
          {/* Citizen Verification Block */}
          {complaint.status === 'Completed' && (
            <div className="bg-gradient-to-tr from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-900/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                    Citizen Verification Audit
                  </h4>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                  The complaint has been completed. Has the issue been rectified?
                </p>

                {verificationMode === 'prompt' && (
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={handleVerifyYes}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
                    >
                      ✅ Yes
                    </button>
                    <button
                      onClick={handleVerifyNo}
                      className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      ❌ No
                    </button>
                  </div>
                )}

                {verificationMode === 'saved' && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-200/20 rounded-2xl text-center space-y-2.5">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">Complaint Closed Successfully</h5>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Thank you for auditing this work order! The ledger has archived this case as verified resolved.
                      </p>
                    </div>
                  </div>
                )}

                {verificationMode === 'no' && (
                  <form onSubmit={handleReopenSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">
                        Optional Comment
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        placeholder="Why is it still unresolved? (e.g. patch washed out, light still dark)"
                        className="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">
                          Upload New Complaint Image
                        </label>
                        <button
                          type="button"
                          onClick={handleSimulateDisputeUpload}
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                        >
                          Use Mock Dispute Image
                        </button>
                      </div>

                      <div className="relative bg-white dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800/80 p-3 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                        {reopenImage ? (
                          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                            <FileCheck className="w-4 h-4" /> Attached Image
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mb-1 text-slate-400" />
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Attach photo</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Reopen Complaint
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerificationMode('prompt')}
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* If the issue is already verified by citizen, render details */}
          {complaint.userVerified && complaint.verification && (
            <div className="p-5 bg-emerald-500/10 rounded-3xl border border-emerald-200/20 space-y-3.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold font-display">Verified Resolved</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{complaint.verification.comment}"
              </p>
              <div className="text-[10px] text-slate-400 font-mono border-t border-emerald-500/10 pt-2 flex justify-between">
                <span>AUDIT RECORDED:</span>
                <span className="font-bold">{new Date(complaint.verification.verifiedAt || '').toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
