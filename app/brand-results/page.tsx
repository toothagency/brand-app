"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ResultsDisplay from "../(protected)/form/components/results/ResultsDisplay";
import { useGetBrand } from "../hooks/useGetBrand";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const BrandResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { getBrand } = useGetBrand();
  const brandId = searchParams.get("brandId");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandId) {
        setError("No brand ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await getBrand.mutateAsync(brandId);

        if (result.success) {
          // Store the brand data in localStorage for the ResultsDisplay component
          // The API returns { brand_results: {...}, message: "...", success: true }
          localStorage.setItem(
            "currentBrandData",
            JSON.stringify(result.brand_results)
          );
          setIsLoading(false);
        } else {
          throw new Error(result.message || "Failed to fetch brand data");
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch brand data"
        );
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [brandId]);

  const handleEdit = () => {
    // Navigate back to the form with the brand ID
    router.push(`/form?editBrandId=${brandId}`);
  };

  const handleStartOver = () => {
    // Clear any stored data and go to the form
    localStorage.removeItem("currentBrandData");
    router.push("/form");
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // The useEffect will trigger again
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Loading...
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Loading Your Brand
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fetching your brand results...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Error Loading Brand
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="space-y-2">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/form")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the brand data from localStorage
  const brandDataString = localStorage.getItem("currentBrandData");
  if (!brandDataString) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Brand Data Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The brand data could not be loaded. Please try generating your
              brand again.
            </p>
            <Button
              onClick={() => router.push("/form")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  let brandData;
  try {
    brandData = JSON.parse(brandDataString);
  } catch (error) {
    console.error("Error parsing brand data:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Invalid Brand Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The brand data is corrupted. Please try generating your brand
              again.
            </p>
            <Button
              onClick={() => router.push("/form")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row space-y-3 text-center sm:text-left items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {brandData.brand_communication?.brand_name || "Your Brand"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Brand Strategy & Identity
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Edit Brand
              </Button>
              <Button
                variant="outline"
                onClick={handleStartOver}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Overview Card */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {brandData.brand_communication?.brand_name}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 italic">
                "{brandData.brand_communication?.brand_tagline}"
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Primary Colors
                  </h3>
                  <div className="flex space-x-3">
                    {brandData.brand_identity?.primary_colors?.map(
                      (color: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                            style={{ backgroundColor: color.hex_value }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {color.color_name}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Typography
                  </h3>
                  <div className="space-y-2">
                    {brandData.brand_identity?.typography?.map(
                      (font: any, index: number) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-300"
                        >
                          <span className="font-medium">
                            {font.font_family}
                          </span>{" "}
                          - {font.font_weight}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                About the Brand
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {brandData.brand_identity?.about_the_brand}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">
                {brandData.brand_identity?.logos?.length || 0}
              </h3>
              <p className="text-blue-100">Logo Variants</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">
                {brandData.brand_identity?.primary_colors?.length || 0}
              </h3>
              <p className="text-green-100">Primary Colors</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">
                {brandData.brand_identity?.typography?.length || 0}
              </h3>
              <p className="text-purple-100">Font Families</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">
                {brandData.brand_strategy?.brand_substance?.our_values?.values
                  ?.length || 0}
              </h3>
              <p className="text-orange-100">Core Values</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Results Display */}
        <ResultsDisplay
          brandData={brandData}
          onEdit={handleEdit}
          onStartOver={handleStartOver}
        />
      </div>
    </div>
  );
};

const BrandResultsPage = () => {
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
          <BrandResultsContent />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default BrandResultsPage;
