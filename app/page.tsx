"use client"
import React from 'react';

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-center space-x-4 mb-6">
        <button onClick={() => window.location.href = '/login'} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
          Login
        </button>
        <button onClick={() => window.location.href = '/register'} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
          Register
        </button>
        <button onClick={() => window.location.href = '/form'} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
          Form
        </button>
      </div>
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Welcome to Our Platform</h1>
        
        <div className="mb-8">
          <p className="text-gray-700 text-lg mb-4">
            Thank you for joining us! We're excited to have you on board.
          </p>
          <p className="text-gray-600 mb-4">
            Our platform is designed to help you achieve your goals with powerful tools and resources.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Easy to Use</h2>
            <p className="text-gray-600">Intuitive interface designed for the best user experience.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Powerful Features</h2>
            <p className="text-gray-600">Access to advanced tools to boost your productivity.</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">24/7 Support</h2>
            <p className="text-gray-600">Our team is always available to help with any questions.</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 mr-4">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition duration-300">
            Learn More
          </button>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500">
        <p>© 2023 Our Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;
