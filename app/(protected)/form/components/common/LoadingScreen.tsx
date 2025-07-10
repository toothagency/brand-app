// LoadingScreen.tsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Using a Lucide icon for consistency

interface LoadingScreenProps {
  title?: string;       // Optional: A main title for the loading screen
  message?: string;     // Optional: The dynamic message to display
  showProgressBar?: boolean; // Optional: Control visibility of the progress bar
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = "Processing...", // Default title
  message = "Please wait a moment while we get things ready.", // Default message
  showProgressBar = true, // Show progress bar by default
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-center p-6 text-center">
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full flex flex-col items-center justify-center">
      {/* Using Lucide's Loader2 for a cleaner spinning animation */}
      <div className="spinner mb-6"></div>


      <div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          {message}
        </p>
      </div>


    </div>
  </div>
);

export default LoadingScreen;