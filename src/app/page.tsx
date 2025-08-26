'use client';

import Game from './components/Game';
import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { userId } = useAuth();
  const router = useRouter();
  
  if (!userId) {
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
          <div className="absolute top-8 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-16 sm:top-40 right-4 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-16 sm:bottom-40 left-4 sm:left-20 w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-lg mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-6 sm:mb-8 animate-fade-in">
              <div className="relative inline-block mb-4 sm:mb-6 group animate-scale-in">
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-green-500/25 animate-float">
                  <span className="text-xl sm:text-2xl">🌍</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight animate-slide-up animation-delay-200">
                Location Lens
              </h1>
              
              <p className="text-base sm:text-lg text-gray-300 mb-2 font-medium animate-slide-up animation-delay-400">
                Discover the world through stunning visuals
              </p>
              
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed animate-slide-up animation-delay-600">
                Test your geography skills with real-time videos from around the globe.
              </p>
            </div>

            {/* Stats Section */}
            <div className="flex justify-center mb-6 sm:mb-8 space-x-6 sm:space-x-8 animate-fade-in animation-delay-800">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">1000+</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">Locations</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">50K+</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">Players</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">4.9★</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">Rating</div>
              </div>
            </div>

            {/* Sign In Card */}
            <div className="bg-[#1f1f1f] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-800/50 shadow-2xl backdrop-blur-sm animate-scale-in animation-delay-1000 hover-lift">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Ready to Explore?</h2>
                <p className="text-gray-300 text-sm sm:text-base">Join thousands of geography enthusiasts worldwide</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/sign-in')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-0 text-base sm:text-lg"
                >
                  Sign In
                </button>
                
                <button
                  onClick={() => router.push('/sign-up')}
                  className="w-full bg-transparent border-2 border-gray-600 hover:border-green-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 text-base sm:text-lg"
                >
                  Create Account
                </button>
              </div>
              
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs text-gray-400">
                  By continuing, you agree to our Terms of Service & Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authenticated user interface
  return (
    <div className="min-h-screen bg-[#171717] relative overflow-hidden">
      {/* User Button */}
      <div className="absolute top-4 right-4 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>

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
        <div className="absolute top-8 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-16 sm:top-40 right-4 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-40 left-4 sm:left-20 w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="relative inline-block mb-4 sm:mb-6 group animate-scale-in">
              <div className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-green-500/25 animate-float">
                <span className="text-xl sm:text-2xl">🌍</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight animate-slide-up animation-delay-200">
              Welcome to Location Lens!
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 mb-2 font-medium animate-slide-up animation-delay-400">
              Ready to test your geography skills?
            </p>
            
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed animate-slide-up animation-delay-600">
              Explore the world through stunning real-time videos and images.
            </p>
          </div>

          {/* Game Stats */}
          <div className="flex justify-center mb-6 sm:mb-8 space-x-6 sm:space-x-8 animate-fade-in animation-delay-800">
            <div className="text-center group">
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">10</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Locations</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">5</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Rounds</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">500</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Max Score</div>
            </div>
          </div>

          {/* Start Game Card */}
          <div className="bg-[#1f1f1f] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-800/50 shadow-2xl backdrop-blur-sm animate-scale-in animation-delay-1000 hover-lift">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Start Your Adventure</h2>
              <p className="text-gray-300 text-sm sm:text-base">Click below to begin your geography journey</p>
            </div>
            
            <button
              onClick={() => {
                router.push('/game');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-0 text-base sm:text-lg"
            >
              Start Game
            </button>
            
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-400">
                Challenge yourself with locations from around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
