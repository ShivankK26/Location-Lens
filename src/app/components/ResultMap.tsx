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
      center: [actualCoords[1], actualCoords[0]],
      zoom: 3,
      maxZoom: 18,
      minZoom: 1
    });

    // Handle map load
    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add markers after map loads
      if (map.current) {
        // Add actual location marker (green)
        new maplibregl.Marker({
          color: '#00FF00',
          draggable: false
        })
          .setLngLat([actualCoords[1], actualCoords[0]])
          .setPopup(new maplibregl.Popup().setHTML(`<b>Actual Location:</b> ${actualLocationName}`))
          .addTo(map.current);

        // Add guess marker (red)
        new maplibregl.Marker({
          color: '#FF4444',
          draggable: false
        })
          .setLngLat([guessCoords[1], guessCoords[0]])
          .setPopup(new maplibregl.Popup().setHTML('<b>Your Guess</b>'))
          .addTo(map.current);

        // Add a line connecting the two points
        const lineSource = {
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
          data: lineSource as maplibregl.GeoJSONSourceRaw['data']
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
            'line-color': '#FF6B6B',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });

        // Fit bounds to show both markers
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([guessCoords[1], guessCoords[0]]);
        bounds.extend([actualCoords[1], actualCoords[0]]);
        map.current.fitBounds(bounds, { padding: 50 });
      }
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
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading result map...</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Your Guess</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Actual Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
