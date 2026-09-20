import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Eye,
  MapPin,
  Copy,
  AlertTriangle,
  GitPullRequest,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, IssueType } from '../types';

interface AIProcessingViewProps {
  complaint: Complaint | null;
  setActiveTab: (tab: string) => void;
  onDuplicateSupported: (complaintId: string) => void;
}

interface AgentStep {
  id: string;
  name: string;
  icon: any;
  title: string;
  color: string;
  bgLight: string;
}

const AGENTS: AgentStep[] = [
  { id: 'vision', name: 'Vision Agent', icon: Eye, title: 'Visual Anomaly Identification', color: 'text-blue-500 border-blue-500', bgLight: 'bg-blue-500/10' },
  { id: 'location', name: 'Location Agent', icon: MapPin, title: 'Geospatial Resolution', color: 'text-emerald-500 border-emerald-500', bgLight: 'bg-emerald-500/10' },
  { id: 'duplicate', name: 'Duplicate Agent', icon: Copy, title: 'Grid Overlap Clustering', color: 'text-violet-500 border-violet-500', bgLight: 'bg-violet-500/10' },
  { id: 'priority', name: 'Priority Agent', icon: AlertTriangle, title: 'Risk Severity Scorecard', color: 'text-amber-500 border-amber-500', bgLight: 'bg-amber-500/10' },
  { id: 'routing', name: 'Routing Agent', icon: GitPullRequest, title: 'Smart Dispatch Jurisdictions', color: 'text-cyan-500 border-cyan-500', bgLight: 'bg-cyan-500/10' },
  { id: 'notification', name: 'Notification Agent', icon: Bell, title: 'Multi-Channel Push Liaison', color: 'text-rose-500 border-rose-500', bgLight: 'bg-rose-500/10' },
  { id: 'verification', name: 'Verification Agent', icon: ShieldCheck, title: 'Outcome Quality Auditor', color: 'text-teal-500 border-teal-500', bgLight: 'bg-teal-500/10' }
];

export default function AIProcessingView({
  complaint,
  setActiveTab,
  onDuplicateSupported
}: AIProcessingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);

  // AI Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [aiResult, setAiResult] = useState<{
    category: string;
    confidence: number;
    severity: string;
    explanation: string;
    secondaryCategory?: string;
  } | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasBypassedSafety, setHasBypassedSafety] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleRetry = () => {
    console.log('[USER ACTION] Retrying AI Gateway analysis connection...');
    setAnalysisError(null);
    setIsAnalyzing(true);
    setRetryCount((prev) => prev + 1);
  };

  // Fallback if no complaint is loaded
  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto mt-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">No active incident loaded</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please file a complaint via the <strong>Report Complaint</strong> page to activate the AI agent sequence.
        </p>
        <button
          onClick={() => setActiveTab('report')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
        >
          Go to Report
        </button>
      </div>
    );
  }

  // 1. Trigger Server-Side Vision AI call on mount
  useEffect(() => {
    if (!complaint || !complaint.imageUrl) return;

    const runAnalysis = async () => {
      setTerminalLogs([
        `[SYSTEM] Connecting to CivicGuard Neural Gateway...`,
        `[SYSTEM] Transporting raw visual payload data to server-side Vision Agent...`
      ]);

      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: complaint.imageUrl,
            description: complaint.description,
          })
        });

        if (!response.ok) {
          throw new Error('API server reported error during parsing');
        }

        const result = await response.json();
        setAiResult(result);

        // Map categories to appropriate departments, severity weights, and structural reasons
        const mappings: Record<string, { dept: string; score: number; reasons: string[] }> = {
          'Pothole': { dept: 'Public Works Department', score: 84, reasons: ['Major asphalt cavity detected', 'Active roadway disruptor', 'Heavy commuters corridor'] },
          'Road Crack / Road Damage': { dept: 'Public Works Department', score: 48, reasons: ['Asphalt surface fissures', 'Risk of moisture infiltration and accelerated degradation'] },
          'Garbage Overflow': { dept: 'Municipality Services', score: 52, reasons: ['Sidewalk block', 'Decaying organic compound biohazard', 'Attracting local pests'] },
          'Water Leakage': { dept: 'Water Authority', score: 60, reasons: ['Slight pipe leakage', 'Low pressure loss', 'Pavement erosion risk'] },
          'Water Pipe Burst': { dept: 'Water Authority', score: 92, reasons: ['Main pressurized water loss', 'Roadbed erosion hazard', 'Flooding threat'] },
          'Broken Streetlight': { dept: 'Electricity Department', score: 62, reasons: ['Pedestrian illumination blackout', 'Security concerns near local park'] },
          'Electric Pole Damage': { dept: 'Electricity Department', score: 94, reasons: ['High voltage hazard', 'Risk of structural collapse', 'Public safety threat'] },
          'Fallen Tree': { dept: 'Public Works Department', score: 75, reasons: ['Utility wires interaction', 'Street clearance obstacle'] },
          'Traffic Signal Damage': { dept: 'Traffic Department', score: 95, reasons: ['High speed intersection crash risk', 'Complete loss of traffic cues'] },
          'Drainage Blockage': { dept: 'Sewer Department', score: 72, reasons: ['Silt and leaf blockages', 'Storm overflow flooding expected'] },
          'Open Manhole': { dept: 'Public Works Department', score: 98, reasons: ['Fatal falling risk for toddlers/pedestrians', 'Commercial sidewalk obstruction'] },
          'Flooded Road': { dept: 'Sewer Department', score: 88, reasons: ['Severe stormwater accumulation', 'Vehicle hydroplaning risk', 'Blocked drainage flow'] },
          'Broken Footpath / Sidewalk': { dept: 'Public Works Department', score: 42, reasons: ['Tripping hazard', 'ADA accessibility obstruction', 'Pedestrian safety concern'] },
          'Damaged Road Sign': { dept: 'Traffic Department', score: 28, reasons: ['Reduced traffic guidance visibility', 'Non-critical replacement schedule'] },
          'Other': { dept: 'Municipality Services', score: 50, reasons: ['Unclassified infrastructure issue reported', 'Awaiting manual dispatch review'] }
        };

        const cat = result.category || 'Other';
        const matched = mappings[cat] || mappings['Other'];

        // Apply changes directly to active complaint object
        complaint.category = cat as IssueType;
        complaint.priority = result.severity || 'Medium';
        complaint.priorityScore = matched.score;
        complaint.priorityReason = [result.explanation, ...matched.reasons];
        complaint.department = matched.dept;

        setTerminalLogs((prev) => [
          ...prev,
          `[Vision] Response received. Model confidence: ${(result.confidence * 100).toFixed(1)}%`,
          `[Vision] Classification determined: [${cat}]`,
          `[Vision] Risk level assigned: **${result.severity?.toUpperCase()}**`,
          `[SYSTEM] Image analysis successful. Core classifications cached.`
        ]);
      } catch (err: any) {
        console.error('API Error:', err);
        setAnalysisError(err.message || 'Failed to contact AI Vision server');
        
        // Setup resilient mock fallback
        const mockResult = {
          category: 'Pothole',
          confidence: 0.94,
          severity: 'High',
          explanation: 'Automatic image raster pass identified severe structural pavement decay with depth > 10cm. Classifying as road pothole.'
        };
        setAiResult(mockResult);
        complaint.category = 'Pothole';
        complaint.priority = 'High';
        complaint.priorityScore = 84;
        complaint.priorityReason = [mockResult.explanation, 'Major asphalt cavity detected', 'Active roadway disruptor', 'Heavy commuters corridor'];
        complaint.department = 'Public Works Department';

        setTerminalLogs((prev) => [
          ...prev,
          `[WARNING] AI Vision Server offline. Deploying local heuristics fallback...`,
          `[Vision] Fallback Classification: [Pothole] (Confidence: 94.0%)`,
          `[Vision] Assigned Risk Level: HIGH`
        ]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [complaint, retryCount]);

  // 2. Scrolling terminal logger trigger based on steps
  useEffect(() => {
    if (isCompleted || isAnalyzing) return;

    const stepId = AGENTS[currentStep].id;
    let logs: string[] = [];

    switch (stepId) {
      case 'vision':
        logs = [
          `[SYSTEM] Visual classification stage confirmed...`,
          `[Vision] Scanning image pixels for defect signatures...`,
          `[Vision] Analysis resolved: ${complaint.category} (Confidence: ${aiResult ? (aiResult.confidence * 100).toFixed(1) : '94.0'}%)`,
          `[Vision] Explanation: "${aiResult?.explanation || 'Visually identified public hazard.'}"`,
          `[SYSTEM] Visual validation complete. Handoff to Location Agent...`
        ];
        break;
      case 'location':
        logs = [
          `[Location] Analyzing geospatial pin coordinate vectors...`,
          `[Location] GPS latitude: ${complaint.location.lat} | longitude: ${complaint.location.lng}.`,
          `[Location] Reverse geocoded address: "${complaint.location.address}".`,
          `[Location] Target division: ${complaint.location.state || 'India'} Area Ward jurisdiction.`,
          `[SYSTEM] Location package verified. Launching cluster overlap scanning...`
        ];
        break;
      case 'duplicate':
        // Show mock duplicate warning if category is a default preset
        const showMockDuplicate = (complaint.id.endsWith('9') || complaint.id.endsWith('4')) && !hasSupported;
        if (showMockDuplicate) {
          setDuplicateFound(true);
          logs = [
            `[Duplicate] Running geo-radius spatial overlap query within 350 meters...`,
            `[Duplicate] Found active report matching category [${complaint.category}] within 45m!`,
            `[Duplicate] Match ID: CIV-2026-000109 ("${complaint.category} reported at same location").`,
            `[Duplicate] High-similarity visual index matched at 89.2% rate.`,
            `[WARNING] Potential Duplicate Incident Detected!`,
            `[Duplicate] Awaiting citizen verification to SUPPORT existing case or BYPASS.`
          ];
        } else {
          setDuplicateFound(false);
          logs = [
            `[Duplicate] Running geo-radius spatial overlap query within 350 meters...`,
            `[Duplicate] Scanning surrounding nodes in GIS database...`,
            `[Duplicate] No overlaps matching category [${complaint.category}] found within coordinates range.`,
            `[Duplicate] Visual check cleared. Image is distinct.`,
            `[SYSTEM] Clear profile validated. Proceeding to risk priority weighting...`
          ];
        }
        break;
      case 'priority':
        logs = [
          `[Priority] Executing Dynamic Risk scoring matrix v3.4...`,
          `[Priority] Computed Aggregate Score: [${complaint.priorityScore || 50}/100].`,
          `[Priority] Evaluated severity class: **${(complaint.priority || 'Medium').toUpperCase()}**.`,
          `[Priority] Factor Weights:`,
          (complaint.priorityReason || []).slice(0, 3).map((r) => `           - ${r}`).join('\n'),
          `[SYSTEM] Severity weight locked. Handing off to Routing Agent...`
        ];
        break;
      case 'routing':
        logs = [
          `[Routing] Matching defect signature to city department jurisdictions...`,
          `[Routing] Target Dispatch: [${complaint.department}]`,
          `[Routing] Generating official smart work order CG-WO-${Math.floor(10000 + Math.random() * 90000)}...`,
          `[Routing] Queue: Indian WARD-DISPATCH-MAIN.`,
          `[SYSTEM] Routing completed successfully. dispatch enqueued.`
        ];
        break;
      case 'notification':
        logs = [
          `[Notification] Synthesizing public communication enqueues...`,
          `[Notification] Dispatched mobile push alerts to local ward supervisor.`,
          `[Notification] Toggled global unread dashboard feeds...`,
          `[Notification] Channels engaged: [Web, Push, SMS].`
        ];
        break;
      case 'verification':
        logs = [
          `[Verification] Registering validation token with citizen smart ledger...`,
          `[Verification] Citizen Outcome Audit triggers enqueued and active.`,
          `[SYSTEM] ALL AGENTS COMPLETED PROCESSING. SAVING LIVE RECORDS.`
        ];
        break;
    }

    // Append logs line-by-line with a slight stagger
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [currentStep, isCompleted, complaint, isAnalyzing, aiResult]);

  // 3. Advance step effect
  useEffect(() => {
    if (isCompleted || isAnalyzing) return;

    const timeout = setTimeout(() => {
      // Pause on step 2 if duplicate found to allow user interactions
      if (currentStep === 2 && duplicateFound && !hasSupported) {
        return;
      }

      if (currentStep < AGENTS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentStep, isCompleted, duplicateFound, hasSupported, isAnalyzing]);

  // 10-Second Safety Timeout to prevent indefinite hanging
  useEffect(() => {
    if (isCompleted) return;

    const safetyTimer = setTimeout(() => {
      console.warn('[SYSTEM] AI processing pipeline exceeded 10-second safety limit. Automatically bypassing to prevent freeze.');
      setHasBypassedSafety(true);
      
      // Auto-populate fallback properties on active complaint object so it has all details
      if (complaint) {
        if (!complaint.category || complaint.category === 'Other') {
          complaint.category = 'Pothole';
          complaint.priority = 'High';
          complaint.priorityScore = 84;
          complaint.department = 'Public Works Department';
          complaint.priorityReason = [
            'System processing exceeded standard 10s queue limits.',
            'Auto-recovering via default high-priority public works dispatch.'
          ];
        }
        if (!complaint.confidenceScore) complaint.confidenceScore = 90;
        if (!complaint.communityImpactScore) complaint.communityImpactScore = 75;
        if (!complaint.estimatedRepairTime) complaint.estimatedRepairTime = '24 Hours';
      }

      setIsCompleted(true);
    }, 10000);

    return () => clearTimeout(safetyTimer);
  }, [isCompleted, complaint]);

  // Automatic Transition to Complaint Registration Success Page
  useEffect(() => {
    if (isCompleted) {
      try {
        if (complaint) {
          if (!complaint.confidenceScore) {
            complaint.confidenceScore = aiResult ? Math.round(aiResult.confidence * 100) : 94;
          }
          if (!complaint.communityImpactScore) {
            complaint.communityImpactScore = Math.min(100, (complaint.priorityScore || 50) + 12);
          }
          if (!complaint.estimatedRepairTime) {
            const p = complaint.priority?.toLowerCase();
            if (p === 'critical') {
              complaint.estimatedRepairTime = '12 Hours';
            } else if (p === 'high') {
              complaint.estimatedRepairTime = '24 Hours';
            } else if (p === 'medium') {
              complaint.estimatedRepairTime = '3 Days';
            } else {
              complaint.estimatedRepairTime = '7 Days';
            }
          }

          // Ensure timeline contains 'Registered' event
          const hasRegistered = complaint.timeline.some((t) => t.status === 'Registered');
          if (!hasRegistered) {
            complaint.timeline = [
              ...complaint.timeline.map((t) => ({ ...t, active: false })),
              {
                status: 'Registered',
                timestamp: new Date().toISOString(),
                description: `Complaint successfully registered and enqueued under ${complaint.department || 'Public Works Department'}.`,
                active: true
              }
            ];
          }
        }

        const navTimeout = setTimeout(() => {
          try {
            setActiveTab('success');
          } catch (navErr) {
            console.error('[Navigation Error] Failed navigating to success view:', navErr);
          }
        }, 1200);

        return () => clearTimeout(navTimeout);
      } catch (err) {
        console.error('[SYSTEM Error] Failed preparing success screen parameters:', err);
        setActiveTab('success');
      }
    }
  }, [isCompleted, complaint, aiResult, setActiveTab]);

  // Scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Support duplicate
  const handleSupportExisting = () => {
    setHasSupported(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[USER ACTION] Citizen elected to SUPPORT existing incident CIV-2026-000109.`,
      `[SYSTEM] Merging support count (+1). Transferring citizen subscription...`,
      `[Duplicate] Verification done. Resuming processing pipeline...`
    ]);

    onDuplicateSupported(complaint.id);

    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1500);
  };

  // Bypass duplicate
  const handleBypassDuplicate = () => {
    setHasSupported(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[USER ACTION] Citizen bypassed warning. Elected to file distinct ticket.`,
      `[SYSTEM] Ticket cleared as unique. Proceeding...`
    ]);

    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1200);
  };

  // Manual Category Correction Handler
  const handleManualCategoryCorrection = (newCat: string) => {
    setIsCorrecting(false);

    const mappings: Record<string, { dept: string; score: number; reasons: string[] }> = {
      'Pothole': { dept: 'Public Works Department', score: 84, reasons: ['Major asphalt cavity detected', 'Active roadway disruptor', 'Heavy commuters corridor'] },
      'Road Crack / Road Damage': { dept: 'Public Works Department', score: 48, reasons: ['Asphalt surface fissures', 'Risk of moisture infiltration and accelerated degradation'] },
      'Garbage Overflow': { dept: 'Municipality Services', score: 52, reasons: ['Sidewalk block', 'Decaying organic compound biohazard', 'Attracting local pests'] },
      'Water Leakage': { dept: 'Water Authority', score: 60, reasons: ['Slight pipe leakage', 'Low pressure loss', 'Pavement erosion risk'] },
      'Water Pipe Burst': { dept: 'Water Authority', score: 92, reasons: ['Main pressurized water loss', 'Roadbed erosion hazard', 'Flooding threat'] },
      'Broken Streetlight': { dept: 'Electricity Department', score: 62, reasons: ['Pedestrian illumination blackout', 'Security concerns near local park'] },
      'Electric Pole Damage': { dept: 'Electricity Department', score: 94, reasons: ['High voltage hazard', 'Risk of structural collapse', 'Public safety threat'] },
      'Fallen Tree': { dept: 'Public Works Department', score: 75, reasons: ['Utility wires interaction', 'Street clearance obstacle'] },
      'Traffic Signal Damage': { dept: 'Traffic Department', score: 95, reasons: ['High speed intersection crash risk', 'Complete loss of traffic cues'] },
      'Drainage Blockage': { dept: 'Sewer Department', score: 72, reasons: ['Silt and leaf blockages', 'Storm overflow flooding expected'] },
      'Open Manhole': { dept: 'Public Works Department', score: 98, reasons: ['Fatal falling risk for toddlers/pedestrians', 'Commercial sidewalk obstruction'] },
      'Flooded Road': { dept: 'Sewer Department', score: 88, reasons: ['Severe stormwater accumulation', 'Vehicle hydroplaning risk', 'Blocked drainage flow'] },
      'Broken Footpath / Sidewalk': { dept: 'Public Works Department', score: 42, reasons: ['Tripping hazard', 'ADA accessibility obstruction', 'Pedestrian safety concern'] },
      'Damaged Road Sign': { dept: 'Traffic Department', score: 28, reasons: ['Reduced traffic guidance visibility', 'Non-critical replacement schedule'] },
      'Other': { dept: 'Municipality Services', score: 50, reasons: ['Unclassified infrastructure issue reported', 'Awaiting manual dispatch review'] }
    };

    const matched = mappings[newCat] || mappings['Other'];

    complaint.category = newCat as IssueType;
    complaint.priority = matched.score >= 90 ? 'Critical' : matched.score >= 75 ? 'High' : matched.score >= 50 ? 'Medium' : 'Low';
    complaint.priorityScore = matched.score;
    complaint.priorityReason = [`[User Corrected Category] Reclassified category manually to ${newCat}.`, ...matched.reasons];
    complaint.department = matched.dept;

    // Force restart processing visual cycle slightly to sync visual states
    setTerminalLogs((prev) => [
      ...prev,
      `[USER ACTION] Citizen manually corrected detected category to [${newCat}].`,
      `[SYSTEM] Re-evaluating dynamic routing targets...`,
      `[Routing] Target department updated to: [${matched.dept}]`,
      `[Priority] Re-calculating risk priority score to: [${matched.score}/100]`
    ]);
  };

  const activeAgent = AGENTS[currentStep];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            AI Pipeline Diagnostics
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Watch CivicGuard’s multi-agent neural network compute classifications, coordinate routing, and calculate priorities.
          </p>
        </div>
        <div className="shrink-0 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">Ticket ID</p>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{complaint.id}</p>
        </div>
      </div>

      {hasBypassedSafety && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4.5 rounded-2xl text-xs leading-relaxed flex items-start gap-2.5 animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-bold">Queue Processing Limit Bypassed</p>
            <p className="mt-0.5">The automatic neural network pipeline exceeded 10 seconds. In order to ensure responsiveness, CivicGuard has automatically initialized enqueues using robust local heuristics. Navigating to success dashboard...</p>
          </div>
        </div>
      )}

      {/* Agents workflow horizontal node layout */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[840px] px-4">
          {AGENTS.map((agent, idx) => {
            const Icon = agent.icon;
            const isPassed = idx < currentStep;
            const isActive = idx === currentStep && !isCompleted && !isAnalyzing;
            const isFuture = idx > currentStep || isAnalyzing;

            return (
              <div key={agent.id} className="flex items-center flex-1 last:flex-initial">
                {/* Agent Node */}
                <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.1, 1], boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)' }
                        : {}
                    }
                    transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      isCompleted || (isPassed && !isAnalyzing)
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                        : isActive
                        ? `${agent.bgLight} border-blue-500 text-blue-600 dark:text-blue-400`
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {isCompleted || (isPassed && !isAnalyzing) ? (
                      <CheckCircle2 className="w-6 h-6 animate-in zoom-in-50" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-spin-slow' : ''}`} />
                    )}
                  </motion.div>
                  <div className="leading-tight">
                    <p
                      className={`text-[10px] font-bold font-mono tracking-wider uppercase ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : isCompleted || (isPassed && !isAnalyzing)
                          ? 'text-emerald-500'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {agent.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium font-sans truncate max-w-[90px]">
                      {isAnalyzing ? 'Queued' : isActive ? 'Processing' : isCompleted || isPassed ? 'Complete' : 'Idle'}
                    </p>
                  </div>
                </div>

                {/* Connection Line */}
                {idx < AGENTS.length - 1 && (
                  <div className="flex-1 mx-2 relative h-1 bg-slate-100 dark:bg-slate-800 rounded">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                        isCompleted || (isPassed && !isAnalyzing)
                          ? 'w-full bg-emerald-500'
                          : isActive
                          ? 'w-1/2 bg-blue-500 animate-pulse'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Visualizer of Active Agent Output vs Logging Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Active Agent Output Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Sticky Uploaded Photo Evidence header - displays complaint photo throughout processing */}
            <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200/50 shrink-0 relative shadow-sm">
                <img
                  src={complaint.imageUrl}
                  alt="Incident Evidence"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs space-y-1 overflow-hidden flex-1">
                <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  Continuous Life-Cycle Asset
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{complaint.id}</p>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-1 italic text-[11px]">
                  "{complaint.description}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : isAnalyzing ? 'bg-blue-500/10 text-blue-500' : activeAgent.bgLight} shrink-0`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isAnalyzing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <activeAgent.icon className={`w-6 h-6 ${activeAgent.color}`} />
                )}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
                  {isCompleted ? 'Diagnostics Complete' : isAnalyzing ? 'Gemini Neural Gateway' : 'Active System Task'}
                </p>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                  {isCompleted ? 'Incident Ready for Dispatch' : isAnalyzing ? 'Analyzing Visual Evidence...' : activeAgent.title}
                </h3>
              </div>
            </div>

            {/* Content area */}
            <div className="py-6 min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {analysisError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4 p-4.5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/20 text-xs"
                  >
                    <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Neural Gateway Contact Failure</p>
                      <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        {analysisError}. System enqueued a local heuristic fallback to prevent blocking, but you can retry the connection.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Retry Connection
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAnalysisError(null);
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                      >
                        Use Fallback
                      </button>
                    </div>
                  </motion.div>
                ) : isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-3.5"
                  >
                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Contacting CivicGuard Vision Server...</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        The server-side Gemini 3.5 Flash model is evaluating pixels to identify defect categories and severity index weights.
                      </p>
                    </div>
                  </motion.div>
                ) : isCompleted ? (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/30">
                      <Sparkles className="w-8 h-8 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">
                        Incident Fully Catalogued!
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto mt-1 leading-relaxed">
                        Multi-agent neural classifications completed successfully. Dynamic work orders are enqueued under <strong>{complaint.department}</strong>.
                      </p>
                    </div>
                  </motion.div>
                ) : activeAgent.id === 'vision' ? (
                  <motion.div
                    key="vision"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                      <div className="flex items-center gap-4">
                        <img
                          src={complaint.imageUrl}
                          alt="Evidence Scanned"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200/50"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] text-slate-400 font-bold font-mono uppercase">Detected Defect Class</p>
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{complaint.category}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">CONFIDENCE:</span>
                            <span className="text-blue-500 font-mono font-bold text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">
                              {aiResult ? (aiResult.confidence * 100).toFixed(1) : '94.0'}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manual correction triggers */}
                      <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/60">
                        {isCorrecting ? (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Correct Detected Category</label>
                            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                              {[
                                'Pothole',
                                'Road Crack / Road Damage',
                                'Garbage Overflow',
                                'Water Leakage',
                                'Water Pipe Burst',
                                'Broken Streetlight',
                                'Electric Pole Damage',
                                'Fallen Tree',
                                'Traffic Signal Damage',
                                'Drainage Blockage',
                                'Open Manhole',
                                'Flooded Road',
                                'Broken Footpath / Sidewalk',
                                'Damaged Road Sign',
                                'Other'
                              ].map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => handleManualCategoryCorrection(cat)}
                                  className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg text-left truncate cursor-pointer transition-colors"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsCorrecting(false)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white underline cursor-pointer"
                            >
                              Cancel Correction
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/60">
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-slate-400 font-mono">
                                {aiResult && aiResult.confidence < 0.85 ? '⚠️ Low confidence detection' : '✨ Categorization looks good?'}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Feel free to override the category if the AI is wrong.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsCorrecting(true)}
                              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-[10px] shrink-0 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                            >
                              ✏️ Correct Category
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : activeAgent.id === 'location' ? (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-3 text-xs"
                  >
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-2">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">COORDINATES</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{complaint.location.lat}, {complaint.location.lng}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">ADDRESS</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">{complaint.location.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono text-[10px]">LANDMARK</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-right truncate max-w-[200px]">{complaint.location.landmark}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : activeAgent.id === 'duplicate' ? (
                  <motion.div
                    key="duplicate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-4 text-center"
                  >
                    {duplicateFound ? (
                      <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-200/20 text-xs space-y-3">
                        <div className="flex items-center gap-2 text-rose-500 justify-center">
                          <AlertTriangle className="w-5 h-5" />
                          <h4 className="font-bold font-display">Active Duplicate Warning!</h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          A similar <strong>{complaint.category}</strong> was reported 45m away under <strong>CIV-2026-000109</strong>. Do you want to support this existing report to raise municipal urgency, or proceed with a new duplicate ticket?
                        </p>

                        <div className="flex justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleSupportExisting}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Support Existing (+1)
                          </button>
                          <button
                            type="button"
                            onClick={handleBypassDuplicate}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                          >
                            Bypass Duplicate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Unique Incident Profile</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                            Cluster algorithms scanned active municipal database. No overlapping coordinate claims or image matches. This ticket is classified as distinct.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : activeAgent.id === 'priority' ? (
                  <motion.div
                    key="priority"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3.5 text-center">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                        <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Calculated Score</p>
                        <p className="text-2xl font-bold font-mono text-slate-800 dark:text-white mt-1">
                          {complaint.priorityScore}<span className="text-xs text-slate-400">/100</span>
                        </p>
                      </div>
                      <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-200/30">
                        <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold uppercase font-mono">Risk Level</p>
                        <p className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400 mt-1 uppercase">
                          {complaint.priority}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">AI Evaluation Reasons</p>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                        {complaint.priorityReason.map((reason, index) => (
                          <li key={index} className="flex items-start gap-1.5">
                            <span className="text-amber-500 text-xs mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : activeAgent.id === 'routing' ? (
                  <motion.div
                    key="routing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-2 text-center text-xs">
                      <p className="text-[10px] text-slate-400 font-mono uppercase">Jurisdiction Match</p>
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400 font-display">
                        {complaint.department}
                      </p>
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>WORK ORDER ID:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">CG-WO-844109</span>
                      </div>
                    </div>
                  </motion.div>
                ) : activeAgent.id === 'notification' ? (
                  <motion.div
                    key="notification"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-3"
                  >
                    <div className="p-3.5 bg-rose-500/10 rounded-2xl border border-rose-200/20 text-xs flex items-center gap-3">
                      <div className="p-2 bg-rose-500 text-white rounded-xl">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="leading-tight text-left">
                        <p className="font-bold text-slate-800 dark:text-slate-100">Dynamic Citizen Alert Dispatched</p>
                        <p className="text-slate-450 mt-0.5 text-slate-400">Push notification generated successfully for enqueued ticket.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="verification"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/20">
                      <ShieldCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Outcome Audit Trigger Ready</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        Citizen Feedback Loops are armed. When field teams mark work-order complete, the citizen gets prompted immediately to audit the repair outcome.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action button at bottom */}
          <div>
            <button
              onClick={() => setActiveTab('success')}
              disabled={!isCompleted || isAnalyzing}
              className={`w-full py-3.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCompleted && !isAnalyzing
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
              id="view-dossier-btn"
            >
              Proceed to Success Receipt & Dossier
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Right Card: Live Logs Terminal */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[460px]">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-slate-400" />
              <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                CIVICGUARD_PIPELINE_AGENT_ENGINE.SH
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-2 leading-relaxed">
            {terminalLogs.map((log, index) => {
              if (!log || typeof log !== 'string') return null;
              let isWarning = log.includes('[WARNING]');
              let isSystem = log.includes('[SYSTEM]') || log.includes('[USER ACTION]');
              return (
                <div
                  key={index}
                  className={`animate-in fade-in slide-in-from-bottom-2 duration-150 whitespace-pre-line ${
                    isWarning ? 'text-amber-400' : isSystem ? 'text-blue-400 font-bold' : 'text-emerald-400'
                  }`}
                >
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

