import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  MapPin,
  Send,
  Sparkles,
  RefreshCw,
  XCircle,
  Video
} from 'lucide-react';
import { IssueType, Complaint } from '../types';
import InteractiveMap from './InteractiveMap';

interface ReportComplaintViewProps {
  onReportSubmitted: (newComplaint: Complaint) => void;
  setActiveTab: (tab: string) => void;
  setSelectedComplaintId: (id: string) => void;
}

// Visual Templates for testing/demonstrating in India
const PRESETS = [
  {
    name: 'Mumbai Road Pothole',
    category: 'Pothole' as IssueType,
    description: 'Extremely deep pothole stretching across the middle lane. Water has filled it, making it hard to see at night. Several cars have damaged their tires here in the last 24 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
    landmark: 'Outside Dharavi Community Clinic',
    lat: 19.0760,
    lng: 72.8777,
    address: 'Dharavi, Mumbai, Maharashtra 400017',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    pincode: '400017'
  },
  {
    name: 'New Delhi Streetlight Blackout',
    category: 'Broken Streetlight' as IssueType,
    description: 'The streetlight pole is flickering rapidly and then turns off completely for 10-minute intervals. The sidewalk is left dark and feels unsafe.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600',
    landmark: 'Behind Victoria Park Market',
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, New Delhi, Delhi 110001',
    state: 'Delhi',
    district: 'New Delhi',
    city: 'New Delhi',
    pincode: '110001'
  },
  {
    name: 'Bengaluru Garbage Overflow',
    category: 'Garbage Overflow' as IssueType,
    description: 'Commercial waste piles and overflowing plastic garbage bags are blocking the pedestrian pathway, emitting severe odors and attracting pests.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
    landmark: 'Beside Indiranagar Groceries',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Indiranagar, Bengaluru, Karnataka 560038',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    pincode: '560038'
  },
  {
    name: 'Pune Water Pipe Burst',
    category: 'Water Pipe Burst' as IssueType,
    description: 'High-pressure clean water is bursting out of the sewer drain pipe. It has formed a large stream down the street.',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=600',
    landmark: 'Opposite Metro Theatre Entrance',
    lat: 18.5204,
    lng: 73.8567,
    address: 'Shivajinagar, Pune, Maharashtra 411005',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    pincode: '411005'
  }
];

export default function ReportComplaintView({
  onReportSubmitted,
  setActiveTab,
  setSelectedComplaintId
}: ReportComplaintViewProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  
  // Core form states
  const [description, setDescription] = useState(PRESETS[0].description);
  const [imageUrl, setImageUrl] = useState(PRESETS[0].imageUrl);
  const [address, setAddress] = useState(PRESETS[0].address);
  const [landmark, setLandmark] = useState(PRESETS[0].landmark);
  
  // Detailed geocoding locations
  const [lat, setLat] = useState(PRESETS[0].lat);
  const [lng, setLng] = useState(PRESETS[0].lng);
  const [state, setState] = useState<string>(PRESETS[0].state);
  const [district, setDistrict] = useState<string>(PRESETS[0].district);
  const [city, setCity] = useState<string>(PRESETS[0].city);
  const [village, setVillage] = useState<string>('');
  const [pincode, setPincode] = useState<string>(PRESETS[0].pincode);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle Preset Select
  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    const preset = PRESETS[idx];
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setAddress(preset.address);
    setLandmark(preset.landmark);
    setLat(preset.lat);
    setLng(preset.lng);
    setState(preset.state || '');
    setDistrict(preset.district || '');
    setCity(preset.city || '');
    setVillage('');
    setPincode(preset.pincode || '');
  };

  // Convert File upload to Base64
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSelectedPreset(null);
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            if (typeof reader.result === 'string') {
              setImageUrl(reader.result);
            }
          } catch (innerErr) {
            console.error('FileReader load error:', innerErr);
          }
        };
        reader.onerror = (readErr) => {
          console.error('FileReader error:', readErr);
        };
        reader.readAsDataURL(file);
        setDescription('');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  // Trigger media devices camera
  const handleStartCamera = async () => {
    setSelectedPreset(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      setIsCameraActive(true);
      setCameraStream(stream);
      // Wait for React to render the video node
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera access failed or denied:', err);
      alert('Could not access device camera. Please make sure camera permission is granted or upload an image instead.');
    }
  };

  const handleCaptureSnapshot = () => {
    try {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Data = canvas.toDataURL('image/jpeg');
          setImageUrl(base64Data);
          handleStopCamera();
        }
      }
    } catch (err) {
      console.error('Snapshot capture crashed:', err);
    }
  };

  const handleStopCamera = () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      setIsCameraActive(false);
    } catch (err) {
      console.error('Stop camera crashed:', err);
    }
  };

  // Reverse Geocoding with Nominatim API
  const handleLocationChange = async (newLat: number, newLng: number) => {
    setLat(parseFloat(newLat.toFixed(6)));
    setLng(parseFloat(newLng.toFixed(6)));
    setIsGeocoding(true);
    setGeocodingError(null);

    const performFetch = async () => {
      // No custom headers (like 'User-Agent') to avoid CORS preflight options issues in the browser
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLat}&lon=${newLng}&accept-language=en`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    };

    try {
      let data;
      try {
        data = await performFetch();
      } catch (firstErr) {
        console.warn('First geocoding attempt failed, retrying once...', firstErr);
        // Wait 800ms before retrying to respect rate limit and let network settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        data = await performFetch();
      }

      if (data && (data.address || data.display_name)) {
        const addr = data.address || {};

        const detectedState = addr.state || addr.region || 'Using GPS Coordinates';
        const detectedDistrict = addr.state_district || addr.county || addr.district || 'Using GPS Coordinates';
        const detectedCity = addr.city || addr.town || addr.municipality || addr.village || addr.suburb || addr.neighbourhood || 'Using GPS Coordinates';
        const detectedVillage = addr.village || addr.suburb || addr.neighbourhood || '';
        const detectedPincode = addr.postcode || 'Not Available';

        // Smart dynamic heuristic to extract nearest landmark
        let detectedLandmark = '';
        if (addr.amenity) {
          detectedLandmark = addr.amenity;
        } else if (addr.historic) {
          detectedLandmark = addr.historic;
        } else if (addr.tourism) {
          detectedLandmark = addr.tourism;
        } else if (addr.railway) {
          detectedLandmark = `${addr.railway} Station`;
        } else if (addr.commercial || addr.shop) {
          detectedLandmark = `Near ${addr.commercial || addr.shop}`;
        } else if (addr.road) {
          detectedLandmark = `Near ${addr.road}`;
        } else if (addr.suburb) {
          detectedLandmark = `Near ${addr.suburb}`;
        } else {
          detectedLandmark = 'GPS Coordinates';
        }

        setState(detectedState);
        setDistrict(detectedDistrict);
        setCity(detectedCity);
        setVillage(detectedVillage);
        setPincode(detectedPincode);
        setAddress(data.display_name || `Latitude ${newLat}, Longitude ${newLng}`);
        setLandmark(detectedLandmark);
        setGeocodingError(null);
      } else {
        throw new Error('Geocoding response did not contain expected address format.');
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      // Fallback: allow complaint submission using latitude and longitude only instead of blocking the user
      const coordinateAddress = `Latitude ${newLat}, Longitude ${newLng}`;
      setAddress(coordinateAddress);
      setState('Using GPS Coordinates');
      setDistrict('Using GPS Coordinates');
      setCity('Using GPS Coordinates');
      setVillage('');
      setPincode('Not Available');
      setLandmark('GPS Coordinates');
      setGeocodingError(null); // Keep error null so the user is not blocked and can submit the form
    } finally {
      setIsGeocoding(false);
    }
  };

  // Browser Geolocation API
  const handleDetectLocation = () => {
    try {
      setIsDetectingLocation(true);
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser.');
        handleLocationChange(20.5937, 78.9629); // Default to India center
        setIsDetectingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            await handleLocationChange(latitude, longitude);
            setIsDetectingLocation(false);
          } catch (err) {
            console.error('Error handling detected position:', err);
            setIsDetectingLocation(false);
          }
        },
        async (err) => {
          try {
            console.warn('Geolocation permission denied or timed out:', err);
            // Default to India
            await handleLocationChange(20.5937, 78.9629);
            setIsDetectingLocation(false);
          } catch (fallbackErr) {
            console.error('Error setting fallback location:', fallbackErr);
            setIsDetectingLocation(false);
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } catch (err) {
      console.error('Geolocation processing crashed:', err);
      setIsDetectingLocation(false);
    }
  };

  // Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const year = new Date().getFullYear();
      // Generate unique 6-digit complaint id CIV-YYYY-XXXXXX
      const randomID = Math.floor(Math.random() * 1000000);
      const paddedID = String(randomID).padStart(6, '0');
      const complaintId = `CIV-${year}-${paddedID}`;

      // Create a new complaint. The core category detection, priority score, and reasons 
      // will be determined in real-time by the Vision & Decision AI agents in AIProcessingView.tsx!
      const newComplaint: Complaint = {
        id: complaintId,
        category: (selectedPreset !== null ? PRESETS[selectedPreset].category : 'Other') as IssueType, // fallback category, to be updated by server-side vision AI
        description: description || 'No description supplied. Automatically utilizing server-side photo metadata.',
        location: {
          lat,
          lng,
          address,
          landmark: landmark || 'Verified on map pin',
          state: state || 'Delhi',
          district: district || 'New Delhi',
          city: city || village || 'New Delhi',
          village,
          pincode: pincode || '110001'
        },
        imageUrl,
        status: 'Registered',
        priority: 'Medium', // will be evaluated
        priorityScore: 50, // will be evaluated
        priorityReason: ['Evaluating infrastructure priority via Multi-Agent pipeline...'],
        department: 'Municipality Services', // will be evaluated
        createdAt: new Date().toISOString(),
        supportCount: 1,
        userVerified: false,
        timeline: [
          { status: 'Created', timestamp: new Date().toISOString(), description: 'Report logged. Launching automated AI diagnostic servers.', active: true }
        ],
        confidenceScore: 92, // initial, to be replaced by AI
        communityImpactScore: 65, // initial, to be computed
        estimatedRepairTime: '3 Days' // initial, to be determined by priority
      };

      try {
        onReportSubmitted(newComplaint);
      } catch (submitErr) {
        console.error('Complaint registration / onReportSubmitted failed:', submitErr);
        throw submitErr;
      }

      try {
        setSelectedComplaintId(complaintId);
        setActiveTab('processing'); // Transition directly to AI agents visualizer
      } catch (navErr) {
        console.error('Navigation to processing failed:', navErr);
        throw navErr;
      }
    } catch (err) {
      console.error('Complaint registration crashed entirely:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
          File a Smart City Complaint
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          CivicGuard utilizes deep-learning server vision models to automatically categorize, evaluate, and prioritize public issues in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Presets list */}
        <div className="space-y-5 lg:col-span-1">
          <div>
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">
              Incident Presets
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Select a preset to auto-load pre-verified Indian coordinate telemetry and infrastructure images.
            </p>
          </div>

          <div className="space-y-3">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                  selectedPreset === idx
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0 border border-slate-200/50"
                  style={{ backgroundImage: `url(${preset.imageUrl})` }}
                />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 font-display">
                    {preset.name}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase truncate max-w-[150px]">
                    {preset.landmark}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-1">
                    {preset.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-blue-500/10 dark:bg-blue-950/20 rounded-2xl border border-blue-200/30 dark:border-blue-900/20 text-xs text-blue-800 dark:text-blue-400 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Multi-Agent Pipeline:</strong> Submitting will route you directly to the live diagnostic screen to watch the AI evaluate, duplicate-check, and route the ticket.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Input Form */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
              Incident Credentials
            </h3>

            {/* Photo Attachment (Evidence) */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">
                1. Infrastructure Photo Evidence
              </label>

              {isCameraActive ? (
                <div className="relative h-64 bg-black rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
                    <button
                      type="button"
                      onClick={handleCaptureSnapshot}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Capture Snapshot
                    </button>
                    <button
                      type="button"
                      onClick={handleStopCamera}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Visual Preview */}
                  <div className="md:col-span-2 relative h-48 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt="Evidence preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-xs text-white font-mono uppercase tracking-wider font-bold">
                            Attached Photo Evidence
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1 text-slate-400 dark:text-slate-500">
                        <ImageIcon className="w-10 h-10 mx-auto" />
                        <p className="text-xs font-mono">No Photo Captured or Uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Photo Acquisition Actions */}
                  <div className="flex flex-col justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartCamera}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <Video className="w-4 h-4 text-blue-500" />
                      Take Live Photo
                    </button>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                      >
                        <ImageIcon className="w-4 h-4 text-emerald-500" />
                        Upload Gallery
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-center leading-relaxed">
                      Accepts JPG, JPEG, PNG, WEBP. CivicGuard AI scans photos directly.
                    </p>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* AI Banner explaining there is no manual category selector */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">AI-Powered Automatic Categorization</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Manual category selection is disabled. Once submitted, CivicGuard's <strong>Vision Agent</strong> will process your image to detect category, severity, and route it to the proper civic department.
                </p>
              </div>
            </div>

            {/* Map Geolocation Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                  2. Smart Location Pin (Drag/Click to refine)
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/15 hover:bg-blue-500/20 disabled:opacity-55 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  {isDetectingLocation ? 'Detecting...' : 'Auto Detect GPS Location'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Real India Leaflet Map */}
                <div className="relative h-64 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner group">
                  <InteractiveMap
                    mode="select"
                    lat={lat}
                    lng={lng}
                    zoom={lat === 20.5937 ? 4 : 14}
                    onLocationChange={handleLocationChange}
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded-lg border border-slate-800 select-none z-[400]">
                    DRAG MARKER OR CLICK MAP
                  </div>
                </div>

                {/* Detected Location Details */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Latitude</span>
                      <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                        {lat}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Longitude</span>
                      <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                        {lng}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">State</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80 truncate">
                        {state || <span className="text-slate-400 italic font-normal">Not detected</span>}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">District</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80 truncate">
                        {district || <span className="text-slate-400 italic font-normal">Not detected</span>}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">City / Town</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80 truncate">
                        {city || village || <span className="text-slate-400 italic font-normal">Not detected</span>}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Pincode</span>
                      <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                        {pincode || <span className="text-slate-400 italic font-normal font-sans">N/A</span>}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Full Address</span>
                      {isGeocoding && (
                        <span className="text-[9px] font-bold text-blue-500 font-mono flex items-center gap-1 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" /> RESOLVING...
                        </span>
                      )}
                    </div>
                    {geocodingError ? (
                      <p className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-xl border border-rose-200/30 dark:border-rose-900/40 leading-snug min-h-[40px] flex items-center">
                        {geocodingError}
                      </p>
                    ) : (
                      <p className={`text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/80 leading-snug line-clamp-2 min-h-[40px] ${isGeocoding ? 'opacity-55' : ''}`}>
                        {address}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Nearest Landmark (Optional)</span>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => {
                        setSelectedPreset(null);
                        setLandmark(e.target.value);
                      }}
                      placeholder="e.g. Near Metro Pillar 145"
                      className="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">
                3. Describe the Problem (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setSelectedPreset(null);
                  setDescription(e.target.value);
                }}
                rows={3}
                placeholder="Give details about depth, physical hazard, duration, or previous accidents..."
                className="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3.5">
            <button
              type="button"
              onClick={() => {
                setDescription('');
                setImageUrl('');
                setSelectedPreset(null);
              }}
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={!imageUrl}
              className={`px-6 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                imageUrl
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
              Analyze & Submit via CivicGuard AI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

