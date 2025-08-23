'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface ResultMapProps {
  guessCoords: [number, number];
  actualCoords: [number, number];
  actualLocationName: string;
}

export default function ResultMap({ guessCoords, actualCoords, actualLocationName }: ResultMapProps) {
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
      center: [actualCoords[1], actualCoords[0]],
      zoom: 3,
      maxZoom: 18,
      minZoom: 1
    });

    // Handle map load
    map.current.on('load', () => {
      console.log('Result map loaded successfully');
      setIsMapLoaded(true);
      
      // Add markers after map loads
      if (map.current) {
        // Add actual location marker (green)
        new maplibregl.Marker({
          color: '#10B981',
          draggable: false,
          scale: 1.2
        })
          .setLngLat([actualCoords[1], actualCoords[0]])
          .setPopup(new maplibregl.Popup({
            className: 'custom-popup',
            closeButton: false,
            maxWidth: '250px'
          }).setHTML(`
            <div class="p-3">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-lg">📍</span>
                <span class="font-semibold text-green-600">Actual Location</span>
              </div>
              <p class="text-gray-700">${actualLocationName}</p>
            </div>
          `))
          .addTo(map.current);

        // Add guess marker (red)
        new maplibregl.Marker({
          color: '#EF4444',
          draggable: false,
          scale: 1.2
        })
          .setLngLat([guessCoords[1], guessCoords[0]])
          .setPopup(new maplibregl.Popup({
            className: 'custom-popup',
            closeButton: false,
            maxWidth: '250px'
          }).setHTML(`
            <div class="p-3">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-lg">🎯</span>
                <span class="font-semibold text-red-600">Your Guess</span>
              </div>
              <p class="text-gray-700">${guessCoords[0].toFixed(4)}, ${guessCoords[1].toFixed(4)}</p>
            </div>
          `))
          .addTo(map.current);

        // Add a line connecting the two points
        const lineSource: GeoJSON.Feature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [guessCoords[1], guessCoords[0]],
              [actualCoords[1], actualCoords[0]]
            ]
          }
        };

        map.current.addSource('line', {
          type: 'geojson',
          data: lineSource
        });

        map.current.addLayer({
          id: 'line',
          type: 'line',
          source: 'line',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#F59E0B',
            'line-width': 3,
            'line-dasharray': [2, 2],
            'line-opacity': 0.7
          }
        });

        // Fit bounds to show both markers
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([guessCoords[1], guessCoords[0]]);
        bounds.extend([actualCoords[1], actualCoords[0]]);
        map.current.fitBounds(bounds, { padding: 60 });
      }
    });

    // Handle map errors
    map.current.on('error', (e) => {
      console.error('Result map error:', e);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [guessCoords, actualCoords, actualLocationName]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-[#262626] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading result map...</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-[#262626] px-3 py-2 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Your Guess</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">Actual Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
