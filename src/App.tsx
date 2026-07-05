import { useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from './data';
import { Complaint, NotificationItem } from './types';

// Components
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ReportComplaintView from './components/ReportComplaintView';
import AIProcessingView from './components/AIProcessingView';
import ComplaintDetailsView from './components/ComplaintDetailsView';
import NearbyComplaintsView from './components/NearbyComplaintsView';
import TrackComplaintView from './components/TrackComplaintView';
import NotificationsView from './components/NotificationsView';
import AnalyticsView from './components/AnalyticsView';
import AIAgentsView from './components/AIAgentsView';
import ComplaintSuccessView from './components/ComplaintSuccessView';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>('CIV-2026-000245');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default dark mode as requested for premium aesthetics

  // Sync Tailwind Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle a new complaint submission
  const handleReportSubmitted = (newComplaint: Complaint) => {
    // Add to active complaints array
    setComplaints((prev) => [newComplaint, ...prev]);

    // Create a notification for Registration
    const registrationNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      complaintId: newComplaint.id,
      title: 'Complaint Registered',
      message: `Your report for ${newComplaint.category} has been logged in our databases. AI agents are initializing evaluations.`,
      type: 'Registered',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Create a notification for AI analysis start
    const aiAnalysisNotif: NotificationItem = {
      id: `notif-${Date.now() + 1}`,
      complaintId: newComplaint.id,
      title: 'AI Evaluation Triggered',
      message: `Multi-agent network started parsing high-resolution telemetry for ticket ${newComplaint.id}.`,
      type: 'AI_Analysis',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [registrationNotif, aiAnalysisNotif, ...prev]);
  };

  // Handle a dispute / reopen ticket action
  const handleReopenComplaint = (id: string, comment: string, newImage: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Reopened',
            imageUrl: newImage,
            userVerified: false,
            timeline: [
              ...c.timeline.map((event) => ({ ...event, active: false })),
              {
                status: 'Reopened',
                timestamp: new Date().toISOString(),
                description: `Disputed and reopened by citizen auditor. Reasoning: "${comment}"`,
                active: true
              }
            ]
          };
        }
        return c;
      })
    );

    // Add a notification for reopening
    const reopenNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      complaintId: id,
      title: 'Complaint Reopened by Audit',
      message: `Citizen disputed repair outcome. Ticket ${id} was reopened and routed back to field supervisors.`,
      type: 'Reopened',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [reopenNotif, ...prev]);

    // Send the complaint back through the AI workflow by setting selected ID and navigating to processing tab
    setSelectedComplaintId(id);
    setActiveTab('processing');
  };

  // Handle a citizen verification YES (resolved) action
  const handleVerifyResolved = (id: string, comment: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            userVerified: true,
            status: 'Completed',
            verification: {
              response: 'YES',
              comment,
              verifiedAt: new Date().toISOString()
            },
            timeline: [
              ...c.timeline.map((event) => ({ ...event, active: false })),
              {
                status: 'Completed',
                timestamp: new Date().toISOString(),
                description: `Citizen verified resolution. Ticket successfully resolved and archived.`,
                active: true
              }
            ]
          };
        }
        return c;
      })
    );

    // Add a notification for closing
    const closingNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      complaintId: id,
      title: 'Ticket Closed & Archived',
      message: `Your verification has been recorded! Case ${id} is officially archived. Thank you!`,
      type: 'Completed',
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications((prev) => [closingNotif, ...prev]);
  };

  // Handle incremental support count (if duplicate is backed)
  const handleDuplicateSupported = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            supportCount: c.supportCount + 1
          };
        }
        return c;
      })
    );
  };

  // Notification management callbacks
  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Find the currently selected complaint details object
  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

  // Unread badge count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] text-slate-800 dark:text-slate-200 flex flex-col lg:flex-row transition-colors duration-300 font-sans">
        {/* Sidebar Section */}
        <Sidebar
          activeTab={activeTab === 'processing' || activeTab === 'details' || activeTab === 'success' ? '' : activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          unreadCount={unreadCount}
        />

        {/* Main Panel Area */}
        <main className="flex-1 lg:pl-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            
            {/* Main Display Routing State Controller */}
            {activeTab === 'dashboard' && (
              <DashboardView
                complaints={complaints}
                notifications={notifications}
                setActiveTab={setActiveTab}
                setSelectedComplaintId={setSelectedComplaintId}
              />
            )}

            {activeTab === 'report' && (
              <ReportComplaintView
                onReportSubmitted={handleReportSubmitted}
                setActiveTab={setActiveTab}
                setSelectedComplaintId={setSelectedComplaintId}
              />
            )}

            {activeTab === 'processing' && (
              <AIProcessingView
                complaint={activeComplaint}
                setActiveTab={setActiveTab}
                onDuplicateSupported={handleDuplicateSupported}
              />
            )}

            {activeTab === 'success' && (
              <ComplaintSuccessView
                complaint={activeComplaint}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'details' && (
              <ComplaintDetailsView
                complaint={activeComplaint}
                onReopenComplaint={handleReopenComplaint}
                onVerifyResolved={handleVerifyResolved}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'nearby' && (
              <NearbyComplaintsView
                complaints={complaints}
                setSelectedComplaintId={setSelectedComplaintId}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'track' && (
              <TrackComplaintView
                complaints={complaints}
                onReopenComplaint={handleReopenComplaint}
                onVerifyResolved={handleVerifyResolved}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onClearNotifications={handleClearNotifications}
                setSelectedComplaintId={setSelectedComplaintId}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                complaints={complaints}
              />
            )}

            {activeTab === 'agents' && (
              <AIAgentsView />
            )}

          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
