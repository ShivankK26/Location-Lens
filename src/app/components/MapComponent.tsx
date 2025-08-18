'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
  onGuess: (coords: [number, number]) => void;
}

export default function MapComponent({ onGuess }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
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
      center: [0, 0],
      zoom: 2,
      maxZoom: 18,
      minZoom: 1
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }), 'bottom-left');

    // Handle map load
    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Handle click events for guessing
    map.current.on('click', (e) => {
      if (!isMapLoaded) return;
      
      const coords: [number, number] = [e.lngLat.lat, e.lngLat.lng];
      
      // Add a marker at the clicked location
      const marker = new maplibregl.Marker({
        color: '#FF4444',
        draggable: false
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);

      // Show confirmation dialog
      if (confirm(`Are you sure you want to guess this location?\nLatitude: ${coords[0].toFixed(4)}\nLongitude: ${coords[1].toFixed(4)}`)) {
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
  }, [onGuess, isMapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-700 font-medium">Click on the map to make your guess!</p>
      </div>
    </div>
  );
}

