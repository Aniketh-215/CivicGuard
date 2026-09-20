import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarkerInfo {
  id: string;
  lat: number;
  lng: number;
  category: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  onClick?: () => void;
}

interface InteractiveMapProps {
  mode: 'select' | 'display';
  lat: number;
  lng: number;
  zoom?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  markers?: MapMarkerInfo[];
  selectedMarkerId?: string | null;
}

export default function InteractiveMap({
  mode,
  lat,
  lng,
  zoom = 12,
  onLocationChange,
  markers = [],
  selectedMarkerId,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mainMarkerRef = useRef<L.Marker | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Maintain freshest reference to onLocationChange callback
  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    // To handle hot-module replacement and multiple mounts, ensure previous instance is cleaned
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create marker group for display mode
    markersGroupRef.current = L.layerGroup().addTo(map);

    // If 'select' mode, add the draggable pin
    if (mode === 'select') {
      const selectIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-35 animate-ping"></span>
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center border-2 border-white text-white shadow-xl">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-12-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        className: 'custom-select-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: selectIcon,
      }).addTo(map);

      mainMarkerRef.current = marker;

      // Handle drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onLocationChangeRef.current) {
          onLocationChangeRef.current(pos.lat, pos.lng);
        }
      });

      // Handle map click
      map.on('click', (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        if (onLocationChangeRef.current) {
          onLocationChangeRef.current(clickLat, clickLng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Sync center and zoom when coordinates update (e.g. from Geolocation)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    if (Math.abs(currentCenter.lat - lat) > 0.0001 || Math.abs(currentCenter.lng - lng) > 0.0001) {
      map.setView([lat, lng], map.getZoom());
    }

    if (mainMarkerRef.current) {
      mainMarkerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  // Sync Markers in 'display' mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group || mode !== 'display') return;

    // Clear old markers
    group.clearLayers();

    markers.forEach((m) => {
      const isSelected = selectedMarkerId === m.id;
      let pinColor = 'from-blue-600 to-cyan-500';

      if (m.status === 'Completed') {
        pinColor = 'from-emerald-600 to-teal-500';
      } else if (m.priority === 'Critical') {
        pinColor = 'from-rose-600 to-red-500 animate-pulse';
      } else if (m.priority === 'High') {
        pinColor = 'from-orange-600 to-amber-500';
      }

      const displayIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            ${isSelected ? `<span class="absolute inline-flex h-10 w-10 rounded-full bg-blue-500/30 animate-ping"></span>` : ''}
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr ${pinColor} flex items-center justify-center border-2 border-white text-white shadow-lg transition-transform ${isSelected ? 'scale-115 border-blue-400' : 'hover:scale-110'}">
              <svg class="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-12-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        className: 'custom-display-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const leafMarker = L.marker([m.lat, m.lng], { icon: displayIcon }).addTo(group);

      if (m.onClick) {
        leafMarker.on('click', () => {
          m.onClick?.();
        });
      }

      // Bind simple custom popup
      leafMarker.bindPopup(`
        <div class="p-1 font-sans text-slate-900 dark:text-slate-100">
          <p class="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">${m.status}</p>
          <h4 class="font-bold text-sm mt-0.5">${m.category}</h4>
          <p class="text-xs text-slate-500 mt-1">Priority: <strong class="${m.priority === 'Critical' ? 'text-rose-500' : m.priority === 'High' ? 'text-orange-500' : 'text-blue-500'}">${m.priority}</strong></p>
        </div>
      `);
    });
  }, [markers, selectedMarkerId, mode]);

  return (
    <div className="w-full h-full relative z-10">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}

