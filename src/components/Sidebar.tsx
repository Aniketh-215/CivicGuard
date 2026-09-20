import { useState } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  Map,
  Search,
  Bell,
  BarChart3,
  Brain,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  unreadCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  unreadCount
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report Complaint', icon: FilePlus },
    { id: 'nearby', label: 'Nearby Complaints', icon: Map },
    { id: 'track', label: 'Track Complaint', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'agents', label: 'AI Agents', icon: Brain }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white shrink-0">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CivicGuard
            </h1>
            <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
              Smart-City Portal
            </p>
          </div>
        </div>
      </div>

      {/* Hackathon Badge */}
      <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-blue-500/5 dark:bg-blue-400/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">TRACK</p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Agents for Good</p>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group border ${
                isActive
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20 dark:border-blue-500/20 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/55 border-transparent'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  isActive ? 'scale-105 text-blue-600 dark:text-blue-400' : 'group-hover:scale-105 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors duration-200 ${
                    isActive ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Dynamic System Health Panel */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider font-mono">System Health</p>
          <p className="text-sm text-white mt-1 font-medium">All agents operational</p>
          <div className="w-full bg-blue-900/40 rounded-full h-1.5 mt-2.5">
            <div className="bg-emerald-400 h-1.5 rounded-full w-[94%]" />
          </div>
        </div>
      </div>

      {/* Bottom Profile / Settings & Theme Toggle */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/20">
        <div className="flex items-center justify-between px-2 py-1 bg-white dark:bg-[#020617]/50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white font-mono text-xs font-bold">
              CG
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Civic Node</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">SF-MAIN-01</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header (Sticky) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">CivicGuard</span>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-xs h-full flex flex-col bg-slate-50 dark:bg-slate-900 animate-in slide-in-from-left duration-200">
            <div className="absolute right-3 top-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

