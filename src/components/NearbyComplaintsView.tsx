import { useState } from 'react';
import InteractiveMap from './InteractiveMap';
import {
  MapPin,
  Eye,
  CheckCircle,
  AlertOctagon,
  Clock,
  Filter,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Crosshair
} from 'lucide-react';
import { Complaint, PriorityLevel, IssueType } from '../types';

interface NearbyComplaintsViewProps {
  complaints: Complaint[];
  setSelectedComplaintId: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function NearbyComplaintsView({
  complaints,
  setSelectedComplaintId,
  setActiveTab
}: NearbyComplaintsViewProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Convert real geographic coordinates (lat/lng) into visual map percentage offsets
  // San Francisco bounding box roughly: lat 37.7500 to 37.8000, lng -122.4900 to -122.4000
  const getMapPosition = (lat: number, lng: number) => {
    const latMin = 37.7500;
    const latMax = 37.8000;
    const lngMin = -122.4900;
    const lngMax = -122.4000;

    // Calculate percentage coordinates
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    const y = (1 - (lat - latMin) / (latMax - latMin)) * 100; // Invert y since top is 0

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchPriority && matchCategory;
  });

  const getMarkerColor = (priority: PriorityLevel, status: string) => {
    if (status === 'Completed') return 'text-emerald-500 fill-emerald-500';
    if (priority === 'Critical') return 'text-rose-500 fill-rose-500';
    if (priority === 'High') return 'text-orange-500 fill-orange-500';
    return 'text-blue-500 fill-blue-500';
  };

  const handleInspectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setActiveTab('details');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
            Metropolitan Geospatial Live Map
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Interactive geographic plotting coordinates and clusters of registered smart city incidents.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {/* Priority filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono font-bold flex items-center gap-1.5 uppercase">
              <Filter className="w-3.5 h-3.5" /> Priority:
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/40 dark:border-slate-700/50">
              {['All', 'Critical', 'High', 'Medium'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    priorityFilter === p
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono font-bold flex items-center gap-1.5 uppercase">
              <Layers className="w-3.5 h-3.5" /> Incident Type:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-700/50 text-[11px] font-bold text-slate-600 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Pothole">Pothole</option>
              <option value="Road Crack / Road Damage">Road Crack / Road Damage</option>
              <option value="Garbage Overflow">Garbage Overflow</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Water Pipe Burst">Water Pipe Burst</option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Electric Pole Damage">Electric Pole Damage</option>
              <option value="Fallen Tree">Fallen Tree</option>
              <option value="Traffic Signal Damage">Traffic Signal Damage</option>
              <option value="Drainage Blockage">Drainage Blockage</option>
              <option value="Open Manhole">Open Manhole</option>
              <option value="Flooded Road">Flooded Road</option>
              <option value="Broken Footpath / Sidewalk">Broken Footpath / Sidewalk</option>
              <option value="Damaged Road Sign">Damaged Road Sign</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Medium / Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Large Map on Left, Selected Pin Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800/80 relative h-[520px] overflow-hidden shadow-inner group">
          <InteractiveMap
            mode="display"
            lat={selectedComplaint ? selectedComplaint.location.lat : 20.5937}
            lng={selectedComplaint ? selectedComplaint.location.lng : 78.9629}
            zoom={selectedComplaint ? 11 : 5}
            selectedMarkerId={selectedComplaint?.id || null}
            markers={filteredComplaints.map((c) => ({
              id: c.id,
              lat: c.location.lat,
              lng: c.location.lng,
              category: c.category,
              status: c.status,
              priority: c.priority,
              onClick: () => setSelectedComplaint(c)
            }))}
          />

          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-2xl flex items-center gap-2.5 shadow-md text-xs select-none z-[400]">
            <Crosshair className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
            <div>
              <p className="font-bold text-slate-800 dark:text-white font-display">Geospatial India Server</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                MAP CENTER: {selectedComplaint ? `${selectedComplaint.location.lat.toFixed(4)} / ${selectedComplaint.location.lng.toFixed(4)}` : '20.5937 / 78.9629'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Detail Pane */}
        <div className="lg:col-span-1">
          {selectedComplaint ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 flex flex-col justify-between h-full min-h-[420px] animate-in slide-in-from-right duration-200">
              <div className="space-y-4.5">
                {/* Photo Thumbnail */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border">
                  <img
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.category}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono uppercase bg-black/75 text-white border-none`}
                    >
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>

                {/* Text descriptors */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {selectedComplaint.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                    {selectedComplaint.category}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                  <p className="text-slate-400 font-mono text-[10px] font-bold uppercase">Landmark Sector</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {selectedComplaint.location.landmark || selectedComplaint.location.address}
                  </p>
                </div>
              </div>

              {/* View dossier triggers */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  onClick={() => handleInspectComplaint(selectedComplaint.id)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  id="inspect-map-dossier"
                >
                  Inspect Complete Case Dossier
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center justify-center h-full min-h-[420px] text-center text-slate-400 space-y-3">
              <Info className="w-10 h-10 text-slate-300" />
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300 font-display">No Incident Selected</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Click on any colored coordinates marker on the vector map to load its summary card.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
