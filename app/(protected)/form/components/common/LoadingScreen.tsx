import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 text-center">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Crafting Your Brand...</h2>
    <p className="text-gray-600 max-w-md">
      Our AI is analyzing your insights and weaving together your unique brand strategy. This might take a moment.
    </p>
    <div className="mt-8 w-full max-w-md mx-auto">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        {/* You might want a more dynamic progress bar if possible, otherwise pulse is fine */}
        <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
      </div>
    </div>
  </div>
);

export default LoadingScreen;