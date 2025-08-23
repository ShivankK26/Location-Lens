'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getRandomLocation, getRandomLocations, Location } from '../services/unsplashApi';

// Dynamically import the map components to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const ResultMap = dynamic(() => import('./ResultMap'), { ssr: false });

export default function Game() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'guessing' | 'result' | 'finished'>('loading');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

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
  const startNewRound = async () => {
    setIsLoadingLocations(true);
    try {
      const randomLocation = await getRandomLocation();
      console.log('Loaded location:', randomLocation);
      setCurrentLocation(randomLocation);
      setGameState('playing');
      setGuessCoords(null);
      setDistance(null);
    } catch (error) {
      console.error('Error loading location:', error);
      // Show error state instead of fallback
      setCurrentLocation(null);
      setGameState('loading');
    } finally {
      setIsLoadingLocations(false);
    }
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
  const nextRound = async () => {
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      await startNewRound();
    } else {
      setGameState('finished');
    }
  };

  // Start the game
  const startGame = async () => {
    setScore(0);
    setRound(1);
    await startNewRound();
  };

  useEffect(() => {
    if (gameState === 'loading') {
      startGame().catch(console.error);
    }
  }, [gameState]);

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌍</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Location Lens</h1>
            <p className="text-gray-400 text-lg">Test your geography skills</p>
          </div>
          
          <div className="bg-[#1f1f1f] rounded-xl p-8 border border-gray-800">
            <div className="mb-6">
              <div className="flex justify-center space-x-8 text-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-green-500">10</div>
                  <div className="text-sm text-gray-400">Locations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className="text-sm text-gray-400">Rounds</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">25K</div>
                  <div className="text-sm text-gray-400">Max Score</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => startGame().catch(console.error)}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717]">
      {/* Header */}
      <div className="bg-[#1f1f1f] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🌍</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Location Lens</h1>
                <p className="text-sm text-gray-400">Round {round} of {totalRounds}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-xl font-bold text-green-500">{score.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-sm">🔔</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {gameState === 'playing' && (
          <div className="space-y-8">
            {/* Location Image */}
            <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
              <div className="relative h-[500px]">
                {isLoadingLocations ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#262626]">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading location...</p>
                    </div>
                  </div>
                ) : currentLocation ? (
                  <>
                    {console.log('Rendering media with URL:', currentLocation.imageUrl)}
                    {currentLocation.mediaType === 'video' && currentLocation.videoUrl ? (
                      <video
                        src={currentLocation.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadStart={() => console.log('Video loading started:', currentLocation.videoUrl)}
                        onCanPlay={() => console.log('Video loaded successfully:', currentLocation.videoUrl)}
                        onError={(e) => {
                          console.error('Video failed to load:', currentLocation.videoUrl);
                          console.error('Error details:', e);
                        }}
                      />
                    ) : (
                      <img
                        src={currentLocation.imageUrl}
                        alt={currentLocation.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() => console.log('Image loaded successfully:', currentLocation.imageUrl)}
                        onError={(e) => {
                          console.error('Image failed to load:', currentLocation.imageUrl);
                          console.error('Error details:', e);
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <h2 className="text-3xl font-bold mb-3">Where is this?</h2>
                        <p className="text-lg text-gray-200 max-w-md mx-auto">
                          {currentLocation.description}
                        </p>
                        {currentLocation.mediaType === 'video' && (
                          <div className="mt-4 flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-300">Video playing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#262626]">
                    <p className="text-gray-400">No location available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map for Guessing */}
            <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
              <div className="h-[500px] relative">
                <div className="absolute top-4 left-4 z-10 bg-[#262626] px-3 py-2 rounded-lg border border-gray-700">
                  <p className="text-white text-sm font-medium">Click to make your guess</p>
                </div>
                <MapComponent onGuess={handleGuess} />
              </div>
            </div>
          </div>
        )}

        {gameState === 'result' && currentLocation && guessCoords && distance !== null && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="bg-[#1f1f1f] rounded-xl p-6 border border-gray-800">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Round {round} Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#262626] p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-gray-400 text-sm mb-1">Your Guess</p>
                    <p className="text-white font-semibold">
                      {guessCoords[0].toFixed(4)}, {guessCoords[1].toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-[#262626] p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">📍</div>
                    <p className="text-gray-400 text-sm mb-1">Actual Location</p>
                    <p className="text-white font-semibold">{currentLocation.name}</p>
                  </div>
                  <div className="bg-[#262626] p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">📏</div>
                    <p className="text-gray-400 text-sm mb-1">Distance</p>
                    <p className="text-white font-semibold">{distance.toFixed(1)} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Map */}
            <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
              <div className="h-80">
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
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {round < totalRounds ? 'Next Round' : 'Finish Game'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-[#1f1f1f] rounded-xl p-8 border border-gray-800 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Game Complete!</h2>
                <div className="w-16 h-1 bg-green-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="mb-8">
                <p className="text-gray-400 mb-4">Final Score</p>
                <div className="bg-[#262626] p-6 rounded-xl border border-gray-700 inline-block">
                  <p className="text-4xl font-bold text-green-500">{score.toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">out of {totalRounds * 5000} possible points</p>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-300">
                  Thanks for playing Location Lens!
                </p>
              </div>

              <button
                onClick={() => {
                  setGameState('loading');
                  setScore(0);
                  setRound(1);
                }}
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
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
