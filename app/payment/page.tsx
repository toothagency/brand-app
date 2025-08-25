"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get brand data from URL params
  const brandData = searchParams.get("brandData")
    ? JSON.parse(decodeURIComponent(searchParams.get("brandData")!))
    : null;

  // Redirect to initialize-payment page with brand data
  useEffect(() => {
    if (isMounted && brandData) {
      const encodedBrandData = encodeURIComponent(JSON.stringify(brandData));
      router.push(`/initialize-payment?brandData=${encodedBrandData}`);
    }
  }, [isMounted, brandData, router]);

  // Show loading while redirecting
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Redirecting to Payment...</h2>
            <p className="text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
          <p className="text-gray-600">Taking you to the payment page...</p>
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Providers>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                </CardContent>
              </Card>
            </div>
          }
        >
          <PaymentPageContent />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default PaymentPage;
