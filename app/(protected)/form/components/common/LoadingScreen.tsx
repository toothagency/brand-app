// LoadingScreen.tsx
import React from "react";
import { Loader2 } from "lucide-react"; // Using a Lucide icon for consistency

interface LoadingScreenProps {
  title?: string; // Optional: A main title for the loading screen
  message?: string; // Optional: The dynamic message to display
  showProgressBar?: boolean; // Optional: Control visibility of the progress bar
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = "Processing...", // Default title
  message = "Please wait a moment while we get things ready.", // Default message
  showProgressBar = true, // Show progress bar by default
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 text-center">
    <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full">
      {/* Using Lucide's Loader2 for a cleaner spinning animation */}
      <Loader2
        className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-6"
        strokeWidth={2.5}
      />

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto">
        {message}
      </p>

      {showProgressBar && (
        <div className="mt-8 w-full max-w-xs sm:max-w-sm mx-auto">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            {/* Simple indeterminate progress bar (moving animation) */}
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full"
              style={{
                width: "100%", // Full width for the inner bar
                animation: "indeterminate-progress 2s infinite linear",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default LoadingScreen;
