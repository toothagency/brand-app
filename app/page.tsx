"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrand } from './contexts/BrandContext';
import { getCurrentUser } from './(auth)/hooks/authHooks';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { createBrand, isLoading } = useBrand();
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = async () => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // If user is not logged in, redirect to login
      router.push('/login');
      return;
    }
    
    try {
      setError(null);
      const brand = await createBrand();
      
      if (brand) {
        // Redirect to dashboard or brand setup page
        router.push('/form');
      }
    } catch (err) {
      console.error('Error creating brand:', err);
      setError('Failed to create brand. Please try again.');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create your brand identity with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform helps you build a professional brand identity in minutes. 
              Get started today and transform your business.
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Get Started"}
              </button>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
