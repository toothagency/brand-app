"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ResultsDisplay from "../(protected)/form/components/results/ResultsDisplay";
import { useGetBrand } from "../hooks/useGetBrand";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";
import PaymentModal from "../(protected)/form/components/results/PaymentModal";
import Cookies from "js-cookie";
import {
  useCreateBrand,
  useDownloadBlueprintPdf,
} from "../(protected)/form/hooks/formHooks";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const BrandResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { getBrand } = useGetBrand();
  const brandId = searchParams.get("brandId");
  const createBrandMutation = useCreateBrand();
  const downloadBlueprintPdf = useDownloadBlueprintPdf();
  const [isSaving, setIsSaving] = useState(false);
  const handlePopoverClose = () => {
    setShowPopover(false);
  };

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

  const handleStartOver = () => {
    // Clear any stored data and go to the form
    setShowPopover(true);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // The useEffect will trigger again
  };

  const getUserId = () => {
    const userDataCookie = Cookies.get("userData");
    if (!userDataCookie) return null;
    try {
      const parsedData = JSON.parse(userDataCookie);
      return parsedData?.userId || null;
    } catch (error) {
      return null;
    }
  };

  const handleStartOverNo = () => {
    // Do NOT clear localStorage here. Just close popover and go back to form.
    setShowPopover(false);
    router.push("/form");
  };

  const handleStartOverYes = async () => {
    setIsSaving(true);
    const userId = getUserId();
    if (userId) {
      try {
        localStorage.removeItem("brandingFormData");

        await createBrandMutation.mutateAsync({ userId });
        setShowPopover(false);
      } catch (error) {
        toast.error("Failed to save brand before starting over.");
      }
    } else {
      toast.error("User not found. Cannot save brand.");
    }
    setIsSaving(false);
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
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
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-8 pb-12 print:pt-4 print:pb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 print:text-3xl">
          Your Brand Blueprint
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 print:text-base">
          Comprehensive strategy for{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {brandData.brand_communication?.brand_name || "your business"}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 no-pdf">
          {" "}
          {/* Buttons hidden in PDF */}
          <Button
            onClick={() => setShowPaymentModal(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            Download Blueprint
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleStartOver}
            className="w-full sm:w-auto"
          >
            Back to Form
          </Button>
        </div>
      </motion.div>
      {/* Enhanced Header */}

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
        <ResultsDisplay brandData={brandData} />
      </div>

      {/* Popover for Start Over */}
      {showPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 dark:bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Edit or Start Over?
              </h3>
              <Button
                variant="outline"
                className="p-2 w-6 h-6"
                onClick={handlePopoverClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="mb-6 dark:text-gray-300">
              Do you want to Edit this brand or Create A New Brand ?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleStartOverNo}
                variant="secondary"
                disabled={isSaving}
              >
                Edit
              </Button>
              <Button onClick={handleStartOverYes} disabled={isSaving}>
                {isSaving ? "Saving..." : "Start Over"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onDownloadBlueprint={async () => {
          if (!brandId) {
            toast.error("Brand ID not found.");
            return;
          }
          try {
            const result = await downloadBlueprintPdf.mutateAsync({ brandId });
            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(result);
            const a = document.createElement("a");
            a.href = url;
            a.download = `brand-blueprint-${brandId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Blueprint downloaded!");
          } catch (error) {
            toast.error("Failed to download blueprint.");
          }
        }}
        brandName={brandData.brand_communication?.brand_name}
        brandId={brandId}
      />
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
