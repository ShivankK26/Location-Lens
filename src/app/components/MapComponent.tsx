'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  onGuess: (coords: [number, number]) => void;
  hintLocation?: [number, number] | null;
  showHint?: boolean;
}

export default function MapComponent({ onGuess, hintLocation, showHint }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with English language
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'cartodb': {
            type: 'raster',
            tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© CARTO'
          }
        },
        layers: [
          {
            id: 'cartodb-tiles',
            type: 'raster',
            source: 'cartodb',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: hintLocation && showHint ? [
        hintLocation[1] + (Math.random() - 0.5) * 40, // Random offset ±20 degrees longitude
        hintLocation[0] + (Math.random() - 0.5) * 20  // Random offset ±10 degrees latitude
      ] : [0, 0],
      zoom: hintLocation && showHint ? 3 : 2
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Handle map click
    map.current.on('click', (e) => {
      const coords: [number, number] = [e.lngLat.lat, e.lngLat.lng];
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new maplibregl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);
      
      onGuess(coords);
    });

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }), 'bottom-left');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onGuess, hintLocation, showHint]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {showHint && hintLocation && (
        <div className="absolute top-4 right-4 z-10 bg-[#262626] px-3 py-2 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">💡</span>
            <span className="text-white text-sm font-medium">Hint: Check this area</span>
            <span className="text-gray-400">↓</span>
          </div>
        </div>
      )}
    </div>
  );
}

