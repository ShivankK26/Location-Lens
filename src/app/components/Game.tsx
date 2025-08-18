'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map components to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const ResultMap = dynamic(() => import('./ResultMap'), { ssr: false });

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
}

// Sample locations - in a real app, you'd fetch these from an API
const sampleLocations: Location[] = [
  {
    id: 1,
    name: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    imageUrl: "https://images.unsplash.com/photo-1502602898535-0b1c3b0b0b0b?w=800&h=600&fit=crop",
    description: "The City of Light"
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    description: "A bustling metropolis"
  },
  {
    id: 3,
    name: "New York, USA",
    latitude: 40.7128,
    longitude: -74.0060,
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    description: "The Big Apple"
  },
  {
    id: 4,
    name: "Sydney, Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
    description: "Harbor city"
  },
  {
    id: 5,
    name: "Cairo, Egypt",
    latitude: 30.0444,
    longitude: 31.2357,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    description: "Ancient wonders"
  },
  {
    id: 6,
    name: "London, UK",
    latitude: 51.5074,
    longitude: -0.1278,
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    description: "Historic capital"
  },
  {
    id: 7,
    name: "Rio de Janeiro, Brazil",
    latitude: -22.9068,
    longitude: -43.1729,
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop",
    description: "Carnival city"
  },
  {
    id: 8,
    name: "Moscow, Russia",
    latitude: 55.7558,
    longitude: 37.6176,
    imageUrl: "https://images.unsplash.com/photo-1520106212299-d99c43e79618?w=800&h=600&fit=crop",
    description: "Red Square"
  },
  {
    id: 9,
    name: "Cape Town, South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
    description: "Table Mountain"
  },
  {
    id: 10,
    name: "Bangkok, Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c079365?w=800&h=600&fit=crop",
    description: "Temple city"
  }
];

export default function Game() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'guessing' | 'result' | 'finished'>('loading');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Start a new round
  const startNewRound = () => {
    const randomLocation = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    setCurrentLocation(randomLocation);
    setGameState('playing');
    setGuessCoords(null);
    setDistance(null);
  };

  // Handle guess submission
  const handleGuess = (coords: [number, number]) => {
    if (!currentLocation) return;
    
    setGuessCoords(coords);
    const calculatedDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      coords[0],
      coords[1]
    );
    setDistance(calculatedDistance);
    setGameState('result');
    
    // Calculate score based on distance (closer = higher score)
    const maxScore = 5000;
    const scoreEarned = Math.max(0, Math.round(maxScore * (1 - calculatedDistance / 20000)));
    setScore(prev => prev + scoreEarned);
  };

  // Move to next round
  const nextRound = () => {
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      startNewRound();
    } else {
      setGameState('finished');
    }
  };

  // Start the game
  const startGame = () => {
    setScore(0);
    setRound(1);
    startNewRound();
  };

  useEffect(() => {
    if (gameState === 'loading') {
      startGame();
    }
  }, [gameState]);

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">GeoGuessr</h1>
          <p className="text-gray-600 mb-8">Guess the location and test your geography skills!</p>
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">GeoGuessr</h1>
              <p className="text-sm text-gray-600">Round {round} of {totalRounds}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">Score: {score}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {gameState === 'playing' && currentLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96">
                <img
                  src={currentLocation.imageUrl}
                  alt={currentLocation.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">Where is this?</h2>
                    <p className="text-lg opacity-90">{currentLocation.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map for Guessing */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96">
                <MapComponent onGuess={handleGuess} />
              </div>
            </div>
          </div>
        )}

        {gameState === 'result' && currentLocation && guessCoords && distance !== null && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Round {round} Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your Guess</p>
                    <p className="text-xl font-semibold">
                      {guessCoords[0].toFixed(4)}, {guessCoords[1].toFixed(4)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Actual Location</p>
                    <p className="text-xl font-semibold">{currentLocation.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-xl font-semibold">{distance.toFixed(1)} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96">
                <ResultMap
                  guessCoords={guessCoords}
                  actualCoords={[currentLocation.latitude, currentLocation.longitude]}
                  actualLocationName={currentLocation.name}
                />
              </div>
            </div>

            {/* Next Round Button */}
            <div className="text-center">
              <button
                onClick={nextRound}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {round < totalRounds ? 'Next Round' : 'Finish Game'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Complete!</h2>
              <div className="mb-8">
                <p className="text-xl text-gray-600 mb-2">Final Score</p>
                <p className="text-5xl font-bold text-blue-600">{score}</p>
                <p className="text-sm text-gray-500 mt-2">out of {totalRounds * 5000} possible points</p>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-700">
                  {score >= totalRounds * 4000 ? "🎉 Excellent! You're a geography master!" :
                   score >= totalRounds * 3000 ? "👍 Great job! You know your world!" :
                   score >= totalRounds * 2000 ? "😊 Good effort! Keep exploring!" :
                   "🌍 Keep practicing! The world is waiting to be discovered!"}
                </p>
              </div>

              <button
                onClick={() => {
                  setGameState('loading');
                  setScore(0);
                  setRound(1);
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
