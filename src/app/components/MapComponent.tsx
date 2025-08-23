'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  onGuess: (coords: [number, number]) => void;
  hintLocation?: [number, number] | null;
  showHint?: boolean;
}

export default function MapComponent({ onGuess, hintLocation, showHint = false }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map with a simple, reliable configuration
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: hintLocation && showHint ? [hintLocation[1] + (Math.random() - 0.5) * 20, hintLocation[0] + (Math.random() - 0.5) * 10] : [0, 0],
      zoom: hintLocation && showHint ? 3 : 2,
      maxZoom: 18,
      minZoom: 1
    });

    // Add navigation controls
    const navControl = new maplibregl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: false
    });
    map.current.addControl(navControl, 'top-right');

    // Add scale control
    const scaleControl = new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    });
    map.current.addControl(scaleControl, 'bottom-left');

    // Handle map load
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setIsMapLoaded(true);
    });

    // Handle map errors
    map.current.on('error', (e) => {
      console.error('Map error:', e);
    });

    // Handle click events for guessing
    map.current.on('click', (e) => {
      if (!isMapLoaded) return;
      
      const coords: [number, number] = [e.lngLat.lat, e.lngLat.lng];
      
      // Add a marker at the clicked location
      const marker = new maplibregl.Marker({
        color: '#EF4444',
        draggable: false,
        scale: 1.1
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);

      // Show confirmation dialog
      const confirmed = confirm(
        `Confirm Your Guess\n\n` +
        `Latitude: ${coords[0].toFixed(4)}\n` +
        `Longitude: ${coords[1].toFixed(4)}\n\n` +
        `Are you sure this is your final answer?`
      );
      
      if (confirmed) {
        onGuess(coords);
      } else {
        // Remove the marker if user cancels
        marker.remove();
      }
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onGuess, isMapLoaded, hintLocation, showHint]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-[#262626] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
      {showHint && hintLocation && (
        <div className="absolute top-4 right-4 z-10 bg-[#262626] px-3 py-2 rounded-lg border border-gray-700">
          <p className="text-white text-sm font-medium">💡 Hint: Check this area</p>
        </div>
      )}
    </div>
  );
}

