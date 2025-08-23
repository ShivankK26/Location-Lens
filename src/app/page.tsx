import Game from './components/Game';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { SignIn } from '@clerk/nextjs';

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌍</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Location Lens</h1>
            <p className="text-gray-400 text-lg">Sign in to start your geography adventure</p>
          </div>
          
          <div className="bg-[#1f1f1f] rounded-xl p-8 border border-gray-800">
            <SignIn 
              redirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-white text-2xl font-bold",
                  headerSubtitle: "text-gray-400",
                  formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white font-semibold",
                  formFieldInput: "bg-[#262626] border-gray-700 text-white",
                  formFieldLabel: "text-gray-300",
                  footerActionLink: "text-green-500 hover:text-green-400",
                  dividerLine: "bg-gray-700",
                  dividerText: "text-gray-400"
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="absolute top-4 right-4 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>
      <Game />
    </div>
  );
}
