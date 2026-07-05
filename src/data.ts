import { Complaint, NotificationItem, AIAgentInfo } from './types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CIV-2026-000245',
    category: 'Pothole',
    description: 'Extremely deep pothole stretching across the middle lane. Water has filled it, making it hard to see at night. Several cars have damaged their tires here in the last 24 hours.',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Dharavi, Mumbai, Maharashtra 400017',
      landmark: 'Near McAllister Community Clinic',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      city: 'Mumbai',
      pincode: '400017'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
    status: 'Repair Started',
    priority: 'Critical',
    priorityScore: 94,
    priorityReason: [
      'Severe pavement degradation (depth > 12cm)',
      'School Zone (McAllister Elementary school is 50m away)',
      'High traffic density corridor (Golden Gate Ave transit line)',
      'Adverse weather forecast (Heavy rain expected in 12h, potential flooding)'
    ],
    department: 'Public Works Department',
    createdAt: '2026-07-03T09:15:00-07:00',
    supportCount: 18,
    userVerified: false,
    timeline: [
      { status: 'Created', timestamp: '2026-07-03T09:15:00-07:00', description: 'Complaint registered by citizen with photo upload.', active: true },
      { status: 'Under Review', timestamp: '2026-07-03T09:16:30-07:00', description: 'AI agents completed analysis. Priority scored at 94/100 (CRITICAL). Escalated due to school zone.', active: true },
      { status: 'Assigned', timestamp: '2026-07-03T11:00:00-07:00', description: 'Routed automatically to Public Works. Work Order #PW-8841 generated.', active: true },
      { status: 'Repair Started', timestamp: '2026-07-04T08:30:00-07:00', description: 'Maintenance crew dispatched. Barricades placed. Ground excavation in progress.', active: true }
    ]
  },
  {
    id: 'CIV-2026-000239',
    category: 'Broken Streetlight',
    description: 'The entire block is pitch black because two adjacent streetlights have gone out. It feels extremely unsafe walking home from the light rail station.',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi, Delhi 110001',
      landmark: 'Near Victoria Manalo Draves Park',
      state: 'Delhi',
      district: 'New Delhi',
      city: 'New Delhi',
      pincode: '110001'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600',
    status: 'Completed',
    priority: 'High',
    priorityScore: 78,
    priorityReason: [
      'Complete block blackout (multiple luminaire failures)',
      'Proximity to pedestrian park and transit corridor',
      'Medium-high crime index area, priority for urban lighting'
    ],
    department: 'Electricity Department',
    createdAt: '2026-07-01T21:40:00-07:00',
    supportCount: 7,
    userVerified: false,
    timeline: [
      { status: 'Created', timestamp: '2026-07-01T21:40:00-07:00', description: 'Complaint filed via CivicGuard portal.', active: true },
      { status: 'Under Review', timestamp: '2026-07-01T21:42:00-07:00', description: 'AI Routing Agent classified as Luminaire Failure, assigned High priority (78/100).', active: true },
      { status: 'Assigned', timestamp: '2026-07-02T09:00:00-07:00', description: 'Assigned to Area 3 Electrical Grid crew.', active: true },
      { status: 'Repair Started', timestamp: '2026-07-02T13:15:00-07:00', description: 'Grid crew replaced damaged LED drivers and wiring harness.', active: true },
      { status: 'Completed', timestamp: '2026-07-02T14:30:00-07:00', description: 'Repairs completed. Illuminance test passed. Citizen verification requested.', active: true }
    ]
  },
  {
    id: 'CIV-2026-000248',
    category: 'Garbage Overflow',
    description: 'Commercial waste and multiple plastic bags have been dumped on the sidewalk. It is attracting rodents and smells terrible under the afternoon sun.',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Indiranagar, Bengaluru, Karnataka 560038',
      landmark: 'Outside Irving Street Market',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      pincode: '560038'
    },
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
    status: 'Assigned',
    priority: 'Medium',
    priorityScore: 54,
    priorityReason: [
      'Commercial dump on pedestrian sidewalk',
      'Bio-hazard risk due to decay & pest attraction',
      'Business district corridor with active foot traffic'
    ],
    department: 'Municipality Services',
    createdAt: '2026-07-05T06:30:00-07:00',
    supportCount: 3,
    userVerified: false,
    timeline: [
      { status: 'Created', timestamp: '2026-07-05T06:30:00-07:00', description: 'Complaint registered by local merchant.', active: true },
      { status: 'Under Review', timestamp: '2026-07-05T06:32:00-07:00', description: 'AI Vision agent detected 5+ commercial trash bags and decaying organic matter.', active: true },
      { status: 'Assigned', timestamp: '2026-07-05T07:10:00-07:00', description: 'Assigned to Waste Management Task Force, dispatch scheduled in 4 hours.', active: true }
    ]
  },
  {
    id: 'CIV-2026-000212',
    category: 'Water Leakage',
    description: 'Clean drinking water is bursting out of a cracked joint on the main supply line. Thousands of gallons are being wasted and flooding the curb.',
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Shivajinagar, Pune, Maharashtra 411005',
      landmark: 'Opposite Castro Theatre',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Pune',
      pincode: '411005'
    },
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    status: 'Completed',
    priority: 'Critical',
    priorityScore: 91,
    priorityReason: [
      'High pressure municipal main line leakage',
      'High clean water loss volume (>50 gallons/min)',
      'Potential damage to surrounding road foundations',
      'Active commercial zone with heavy weekend crowds'
    ],
    department: 'Water Authority',
    createdAt: '2026-06-28T08:00:00-07:00',
    supportCount: 34,
    userVerified: true,
    verification: {
      response: 'YES',
      verifiedAt: '2026-06-29T10:30:00-07:00',
      comment: 'Water was shut off and pipe was fully replaced within 4 hours. Fantastic and fast work by the water authority!'
    },
    timeline: [
      { status: 'Created', timestamp: '2026-06-28T08:00:00-07:00', description: 'Complaint reported with GPS verification.', active: true },
      { status: 'Under Review', timestamp: '2026-06-28T08:01:30-07:00', description: 'AI Priority Agent classified as Critical (91/100). Triggered instant alert to Water Control.', active: true },
      { status: 'Assigned', timestamp: '2026-06-28T08:15:00-07:00', description: 'Emergency Water Authority repair crew dispatched.', active: true },
      { status: 'Repair Started', timestamp: '2026-06-28T09:00:00-07:00', description: 'Inlet valve isolated, pressure lowered. Excavation and welding underway.', active: true },
      { status: 'Completed', timestamp: '2026-06-28T14:00:00-07:00', description: 'Joint replaced, main line repressurized. Asphalt temporary patch applied.', active: true }
    ]
  },
  {
    id: 'CIV-2026-000220',
    category: 'Traffic Signal Damage',
    description: 'The traffic signal light at this busy intersection has turned sideways and the green light is completely smashed. Cars are almost colliding because they cannot see the signal.',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'T. Nagar, Chennai, Tamil Nadu 600017',
      landmark: 'Near Transamerica Pyramid',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Chennai',
      pincode: '600017'
    },
    imageUrl: 'https://images.unsplash.com/photo-1510931441858-a53cf9cf2999?auto=format&fit=crop&q=80&w=600',
    status: 'Completed',
    priority: 'Critical',
    priorityScore: 96,
    priorityReason: [
      'High speed blind intersection collision risk',
      'Major downtown commuter thoroughfare (Montgomery St)',
      'Signal visibility completely compromised'
    ],
    department: 'Traffic Department',
    createdAt: '2026-06-29T17:10:00-07:00',
    supportCount: 42,
    userVerified: false,
    timeline: [
      { status: 'Created', timestamp: '2026-06-29T17:10:00-07:00', description: 'Multiple duplicate reports merged. Automated alert to traffic control.', active: true },
      { status: 'Under Review', timestamp: '2026-06-29T17:11:00-07:00', description: 'AI Priority agent flagged with 96/100 score due to immediate collision risk.', active: true },
      { status: 'Assigned', timestamp: '2026-06-29T17:30:00-07:00', description: 'Traffic Signal Maintenance Division routed.', active: true },
      { status: 'Repair Started', timestamp: '2026-06-29T18:00:00-07:00', description: 'Bucket truck arrived. Intersection controlled by police while repairs are made.', active: true },
      { status: 'Completed', timestamp: '2026-06-29T19:45:00-07:00', description: 'Smashed light replaced and bracket re-aligned. Intersection cleared.', active: true }
    ]
  },
  {
    id: 'CIV-2026-000250',
    category: 'Fallen Tree',
    description: 'A massive oak branch has snapped and is resting on top of power cables and blocking one sidewalk lane.',
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Park Street, Kolkata, West Bengal 700016',
      landmark: 'Near Buena Vista Park',
      state: 'West Bengal',
      district: 'Kolkata',
      city: 'Kolkata',
      pincode: '700016'
    },
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    status: 'Under Review',
    priority: 'High',
    priorityScore: 82,
    priorityReason: [
      'Potential hazard with medium-voltage power lines',
      'Obstructing public right-of-way sidewalk',
      'High wind advisory currently active'
    ],
    department: 'Public Works Department',
    createdAt: '2026-07-05T07:00:00-07:00',
    supportCount: 1,
    userVerified: false,
    timeline: [
      { status: 'Created', timestamp: '2026-07-05T07:00:00-07:00', description: 'Citizen submitted report with photo.', active: true },
      { status: 'Under Review', timestamp: '2026-07-05T07:02:15-07:00', description: 'AI Vision agent verified tree debris interacting with utility wires.', active: true }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    complaintId: 'CIV-2026-000245',
    title: 'Repair Started on Pothole',
    message: 'Maintenance crews have arrived at 455 Golden Gate Ave and repair works are underway.',
    type: 'Repair_Started',
    isRead: false,
    createdAt: '2026-07-04T08:30:00-07:00'
  },
  {
    id: 'notif-2',
    complaintId: 'CIV-2026-000248',
    title: 'Department Assigned',
    message: 'Your report for Garbage outside Irving Street Market has been routed to Municipality Services.',
    type: 'Assigned',
    isRead: false,
    createdAt: '2026-07-05T07:10:00-07:00'
  },
  {
    id: 'notif-3',
    complaintId: 'CIV-2026-000250',
    title: 'AI Analysis Complete',
    message: 'Fallen Tree near Buena Vista Park has been evaluated by CivicGuard AI. Priority classified as High (82/100).',
    type: 'AI_Analysis',
    isRead: false,
    createdAt: '2026-07-05T07:02:15-07:00'
  },
  {
    id: 'notif-4',
    complaintId: 'CIV-2026-000220',
    title: 'Citizen Verification Requested',
    message: 'Repairs are marked completed for the Traffic Signal Damage at 600 Montgomery St. Please verify if resolved.',
    type: 'Verification_Requested',
    isRead: true,
    createdAt: '2026-06-29T19:50:00-07:00'
  },
  {
    id: 'notif-5',
    complaintId: 'CIV-2026-000212',
    title: 'Complaint Closed & Archived',
    message: 'Your verification has been recorded! CIV-2026-000212 is now successfully resolved and archived. Thank you!',
    type: 'Completed',
    isRead: true,
    createdAt: '2026-06-29T10:30:00-07:00'
  }
];

export const AI_AGENTS_LIST: AIAgentInfo[] = [
  {
    id: 'agent-vision',
    name: 'Vision Agent',
    role: 'Computer Vision & Object Identifier',
    description: 'Ingests uploaded photos, identifies infrastructure anomalies, filters out non-incident images, and assigns high-fidelity category classifications with deep confidence rates.',
    status: 'idle',
    icon: 'Eye'
  },
  {
    id: 'agent-location',
    name: 'Location Agent',
    role: 'Geospatial Coordinator',
    description: 'Reads image EXIF metadata for coordinates, leverages reverse geocoding APIs to fetch exact addresses, detects nearest landmarks, and prompts the user for fine-grained manual adjustments.',
    status: 'idle',
    icon: 'MapPin'
  },
  {
    id: 'agent-duplicate',
    name: 'Duplicate Detection Agent',
    role: 'Grid Clustering Filter',
    description: 'Runs geo-radius clustering queries on active complaints to detect overlaps. Matches image similarities to merge duplicate claims, thereby conserving municipal dispatch resources.',
    status: 'idle',
    icon: 'Copy'
  },
  {
    id: 'agent-priority',
    name: 'Priority Agent',
    role: 'Dynamic Risk Scorer',
    description: 'Calculates structural risk. Weights severe defects, proximity to vulnerable zones (schools, clinics), traffic flow metrics, and live weather telemetry to compute a precise safety score.',
    status: 'idle',
    icon: 'AlertTriangle'
  },
  {
    id: 'agent-routing',
    name: 'Routing Agent',
    role: 'Smart Dispatch Coordinator',
    description: 'Matches issue signatures with municipal jurisdictions, converts reports to standard formats, triggers automated work-orders, and schedules dispatch for target repair teams.',
    status: 'idle',
    icon: 'GitPullRequest'
  },
  {
    id: 'agent-notification',
    name: 'Notification Agent',
    role: 'Public Communications Liaison',
    description: 'Generates instant multi-channel push and email updates for citizens, tracks timeline progression, and sends feedback prompts once technicians report repair completion.',
    status: 'idle',
    icon: 'Bell'
  },
  {
    id: 'agent-verification',
    name: 'Verification Agent',
    role: 'Outcome Quality Auditor',
    description: 'Engages citizens for feedback. If a complaint is disputed, triggers re-evaluation, requests follow-up photos, reopens the repair cycle, or archives it securely upon success.',
    status: 'idle',
    icon: 'ShieldCheck'
  },
  {
    id: 'agent-analytics',
    name: 'Analytics Agent',
    role: 'Predictive Smart City Consultant',
    description: 'Aggregates metropolitan incident flows, isolates repeating defects, measures departmental reaction rates, and predicts physical pavement deterioration trends across town wards.',
    status: 'idle',
    icon: 'BarChart3'
  }
];
