'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { UserButton } from '@clerk/nextjs';
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
  const [showScoringDropdown, setShowScoringDropdown] = useState(false);

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
    const maxScore = 100;
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
    // Automatically start the game when component mounts
    startGame().catch(console.error);
  }, []);

  // Show loading state while initializing the game
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-[#171717] relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`,
            backgroundSize: '100% 100%'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌍</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Loading Game...</h1>
            <div className="w-8 h-8 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`,
          backgroundSize: '100% 100%'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
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
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Score</p>
                  <p className="text-xl font-bold text-green-500">{score.toLocaleString()}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowScoringDropdown(!showScoringDropdown)}
                    className="flex items-center space-x-2 bg-[#262626] hover:bg-[#333333] text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">🏆 Scoring</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showScoringDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showScoringDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-[#1f1f1f] border border-gray-700 rounded-xl shadow-2xl z-50">
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                          <span className="mr-2">🏆</span>
                          Scoring Breakdown
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-gray-300">Perfect Guess</span>
                            </div>
                            <span className="text-green-400 font-semibold">100 pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-300">Close Guess (≤1,000 km)</span>
                            </div>
                            <span className="text-blue-400 font-semibold">95 pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-300">Medium Guess (≤5,000 km)</span>
                            </div>
                            <span className="text-yellow-400 font-semibold">75 pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span className="text-gray-300">Far Guess (≤10,000 km)</span>
                            </div>
                            <span className="text-orange-400 font-semibold">50 pts</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-300">Very Far Guess (&gt;10,000 km)</span>
                            </div>
                            <span className="text-red-400 font-semibold">0 pts</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-700">
                          <p className="text-xs text-gray-400 text-center">
                            Max Score: 500 points (5 rounds × 100 pts each)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <UserButton afterSignOutUrl="/" />
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
                      {currentLocation.mediaType === 'video' && currentLocation.videoUrl ? (
                        <video
                          src={currentLocation.videoUrl}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          onLoadStart={() => {}}
                          onCanPlay={() => {}}
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
                          onLoad={() => {}}
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
                  <MapComponent 
                    onGuess={handleGuess} 
                    hintLocation={currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null}
                    showHint={currentLocation?.mediaType === 'video'}
                  />
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
    </div>
  );
}
