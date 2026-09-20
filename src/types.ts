export type IssueType =
  | 'Pothole'
  | 'Road Crack / Road Damage'
  | 'Garbage Overflow'
  | 'Water Leakage'
  | 'Water Pipe Burst'
  | 'Broken Streetlight'
  | 'Electric Pole Damage'
  | 'Fallen Tree'
  | 'Traffic Signal Damage'
  | 'Drainage Blockage'
  | 'Open Manhole'
  | 'Flooded Road'
  | 'Broken Footpath / Sidewalk'
  | 'Damaged Road Sign'
  | 'Other';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Registered'
  | 'Under Review'
  | 'Assigned'
  | 'Repair Started'
  | 'Completed'
  | 'Reopened';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  state?: string;
  district?: string;
  city?: string;
  village?: string;
  pincode?: string;
}

export interface TimelineEvent {
  status: ComplaintStatus | 'Created';
  timestamp: string;
  description: string;
  active: boolean;
}

export interface VerificationData {
  response: 'YES' | 'NO' | null;
  comment?: string;
  newImageUrl?: string;
  verifiedAt?: string;
}

export interface Complaint {
  id: string;
  category: IssueType;
  description: string;
  location: LocationData;
  imageUrl: string;
  status: ComplaintStatus;
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100
  priorityReason: string[];
  department: string;
  createdAt: string;
  timeline: TimelineEvent[];
  supportCount: number;
  userVerified: boolean;
  verification?: VerificationData;
  confidenceScore?: number;
  communityImpactScore?: number;
  estimatedRepairTime?: string;
}

export interface NotificationItem {
  id: string;
  complaintId: string;
  title: string;
  message: string;
  type: 'Registered' | 'AI_Analysis' | 'Assigned' | 'Repair_Started' | 'Completed' | 'Reopened' | 'Verification_Requested';
  isRead: boolean;
  createdAt: string;
}

export interface AIAgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'idle' | 'active' | 'completed';
  icon: string;
}

