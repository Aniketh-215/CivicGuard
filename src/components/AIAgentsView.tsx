import {
  Brain,
  Eye,
  MapPin,
  Copy,
  AlertTriangle,
  GitPullRequest,
  Bell,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ArrowDown,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AIAgentsView() {
  const agents = [
    {
      id: 'vision',
      name: 'Vision Agent',
      icon: Eye,
      role: 'Visual Signature Ingestor',
      tech: 'ResNet-152 Deep Conv2D Classification',
      description: 'Reviews evidence photos, isolates regions of interest using bounding boxes, and flags false reports (e.g., memes or pets) with 98% accuracy thresholds.',
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/10'
    },
    {
      id: 'location',
      name: 'Location Agent',
      icon: MapPin,
      role: 'Geospatial Metadata Geocoder',
      tech: 'EXIF Parsing & OpenStreetMap Node Alignment',
      description: 'Extracts embedded geolocation metadata from image payloads. Executes reverse lookup algorithms to identify street ranges, lanes, and landmarks.',
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10'
    },
    {
      id: 'duplicate',
      name: 'Duplicate Detection Agent',
      icon: Copy,
      role: 'GIS Overlap Filter',
      tech: 'Haversine Geographic Distance Clustering',
      description: 'Runs geo-radius proximity checks against unresolved filings. Merges repeating claims, increments public endorsement metrics, and stops double-dispatches.',
      color: 'from-violet-500 to-indigo-500',
      shadow: 'shadow-violet-500/10'
    },
    {
      id: 'priority',
      name: 'Priority Agent',
      icon: AlertTriangle,
      role: 'Risk Severity Calculator',
      tech: 'Weighted Linear Regression Risk Scoring',
      description: 'Weights severity indices against school zones, transit terminals, rain telemetry, and historic density to calculate a public risk rating from 0 to 100.',
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/10'
    },
    {
      id: 'routing',
      name: 'Routing Agent',
      icon: GitPullRequest,
      role: 'Smart Dispatch Coordinator',
      tech: 'Jurisdiction Assignment Matrices',
      description: 'Aligns issue signatures with local department codes. Triggers automated work-orders (API-handshaked) and maps team dispatch queues.',
      color: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/10'
    },
    {
      id: 'notification',
      name: 'Notification Agent',
      icon: Bell,
      role: 'Metropolitan Liaison',
      tech: 'Dynamic Push-Notification Liaison',
      description: 'Formats and delivers dynamic text, email, and cellular notifications, keeping the citizen informed of inspection dates, technician arrivals, and work updates.',
      color: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-500/10'
    },
    {
      id: 'verification',
      name: 'Verification Agent',
      icon: ShieldCheck,
      role: 'Quality Auditor',
      tech: 'Outcome Verification Feedback Loops',
      description: 'Coordinates citizen audits upon crew reporting complete. Manages reopened pipelines, processes dispute attachments, and archives verified successes.',
      color: 'from-teal-500 to-emerald-500',
      shadow: 'shadow-teal-500/10'
    },
    {
      id: 'analytics',
      name: 'Analytics Agent',
      icon: BarChart3,
      role: 'Smart City Strategist',
      tech: 'Predictive Neural Degradation Modelling',
      description: 'Aggregates city-wide incident data over months to track material wear rates. Predicts future pavement cavitations and sewer overflows ahead of storm waves.',
      color: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/10'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            CivicGuard Multi-Agent Architecture
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Deep technical overview of the synchronized neural nodes automating the smart city workflow.
          </p>
        </div>
      </div>

      {/* Main Flow Diagram Panel */}
      <div className="bg-slate-950 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Floating background glowing node */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-12">
          {/* Header indicator */}
          <div className="text-center space-y-1 max-w-sm mx-auto">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-mono font-bold text-[10px] rounded-lg border border-blue-500/20 uppercase tracking-widest">
              Operational Sequence
            </span>
            <h3 className="text-white font-display font-bold text-lg mt-2">Dynamic Workstream Handoff</h3>
            <p className="text-slate-500 text-xs">How reported incidents stream from citizen cameras into municipal archives.</p>
          </div>

          {/* Staggered Vertical Pipeline Grid */}
          <div className="space-y-8 max-w-4xl mx-auto relative pl-4 sm:pl-0">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={agent.id} className="relative">
                  {/* Glowing Connection Line */}
                  {index < agents.length - 1 && (
                    <div className="absolute left-[24px] sm:left-1/2 top-[55px] bottom-[-45px] w-0.5 bg-gradient-to-b from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600 opacity-60 pointer-events-none">
                      {/* Animated streaming packet */}
                      <motion.div
                        animate={{ y: [0, 80, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      />
                    </div>
                  )}

                  {/* Card row container */}
                  <div className={`flex flex-col sm:flex-row items-center gap-6 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                    {/* Visual Connector Bracket on Desktop */}
                    <div className="hidden sm:block w-1/2" />

                    {/* Node Core Connector dot */}
                    <div className="absolute left-0 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center z-10 text-slate-400">
                      <span className="font-mono text-xs font-bold text-blue-400">0{index + 1}</span>
                    </div>

                    {/* Agent Description Card */}
                    <motion.div
                      whileHover={{ scale: 1.015, borderColor: 'rgba(255,255,255,0.15)' }}
                      className={`w-full sm:w-1/2 p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-lg ${agent.shadow} flex flex-col justify-between transition-colors`}
                    >
                      <div className="space-y-3">
                        {/* Title and Badge */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${agent.color} text-white shrink-0 shadow-sm`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-white font-bold font-display text-sm">
                                {agent.name}
                              </h4>
                              <p className="text-slate-400 font-mono text-[10px] uppercase font-semibold">
                                {agent.role}
                              </p>
                            </div>
                          </div>
                          
                          {/* Live state pulse */}
                          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[9px] font-mono font-bold text-emerald-400 uppercase select-none">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            Online / Idle
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
                          {agent.description}
                        </p>
                      </div>

                      {/* Tech Spec footer */}
                      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>ALGORITHM:</span>
                        <span className="text-blue-400 font-bold">{agent.tech}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Staggered bottom banner */}
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-display font-bold text-white">Full-Mesh Multi-Agent Coordination</h4>
              <p className="text-slate-400 leading-relaxed font-sans">
                Unlike traditional static databases, CivicGuard’s agent pipeline communicates asynchronously to resolve overlaps, evaluate climate risk matrices, and schedule proactive field crews seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

