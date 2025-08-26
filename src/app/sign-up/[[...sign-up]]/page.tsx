import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#171717] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
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
        <div className="absolute top-8 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-16 sm:top-40 right-4 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-40 left-4 sm:left-20 w-12 h-12 sm:w-20 sm:h-20 bg-green-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block mb-4 sm:mb-6 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-green-500/25">
              <span className="text-xl sm:text-2xl">🌍</span>
            </div>
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Join Location Lens
          </h1>
          
          <p className="text-sm sm:text-base text-gray-300">
            Create your account to start exploring the world
          </p>
        </div>

        <div className="bg-[#1f1f1f] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
          <SignUp 
            appearance={{
              baseTheme: undefined,
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0 m-0 w-full",
                headerTitle: "text-white text-lg sm:text-xl font-bold mb-2",
                headerSubtitle: "text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6",
                formButtonPrimary: "w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-0 text-sm sm:text-base",
                formFieldInput: "bg-[#262626] border-gray-700 text-white placeholder-gray-400 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-sm sm:text-base",
                formFieldLabel: "text-gray-300 font-medium text-xs sm:text-sm",
                footerActionLink: "text-green-400 hover:text-green-300 font-semibold transition-colors duration-200 text-xs sm:text-sm",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400 text-xs sm:text-sm",
                formField: "mb-3 sm:mb-4",
                footer: "mt-4 sm:mt-6 text-center",
                formButton: "w-full",
                form: "space-y-3 sm:space-y-4 w-full",
                socialButtonsBlockButton: "w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-0 text-sm sm:text-base",
                socialButtonsBlockButtonText: "text-sm sm:text-base",
                formFieldRow: "space-y-3 sm:space-y-4",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors duration-200",
                formFieldInputShowPasswordIcon: "w-5 h-5",
                identityPreviewEditButton: "text-green-400 hover:text-green-300",
                formResendCodeLink: "text-green-400 hover:text-green-300",
                otpCodeFieldInput: "bg-[#262626] border-gray-700 text-white placeholder-gray-400 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-sm sm:text-base text-center",
                formFieldAction: "text-green-400 hover:text-green-300 text-xs sm:text-sm",
                alert: "bg-red-500/10 border-red-500/20 text-red-400",
                alertText: "text-red-400 text-xs sm:text-sm",
                alertIcon: "text-red-400",
                verificationCodeField: "space-y-3 sm:space-y-4",
                verificationCodeFieldInput: "bg-[#262626] border-gray-700 text-white placeholder-gray-400 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 text-sm sm:text-base text-center",
                formFieldLabelRow: "mb-2",
                formFieldLabelRowLabel: "text-gray-300 font-medium text-xs sm:text-sm",
                formFieldLabelRowRequiredIndicator: "text-red-400",
                formFieldLabelRowOptionalIndicator: "text-gray-500"
              },
              variables: {
                colorPrimary: "#10b981",
                colorBackground: "#1f1f1f",
                colorInputBackground: "#262626",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9ca3af",
                colorTextOnPrimaryBackground: "#ffffff",
                colorNeutral: "#374151",
                colorInputForeground: "#ffffff",
                colorSuccess: "#10b981",
                colorForeground: "#ffffff",
                colorDanger: "#ef4444",
                borderRadius: "0.5rem"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
