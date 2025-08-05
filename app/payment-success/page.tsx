"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ArrowLeft,
  Smartphone,
  User,
  Mail,
  Phone,
  Globe,
  Building,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { useFinalResults } from "../hooks/useFinalResults";
import { useGetBrand } from "../hooks/useGetBrand";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";
import { getCurrentUser } from "../(auth)/hooks/authHooks";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCESS" | "FAILED"
  >("PENDING");
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [showGeneratingLoader, setShowGeneratingLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [brandData, setBrandData] = useState<any>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhoneNumbers: "",
    registrationNumber: "",
    website: "",
  });

  const finalResultsMutation = useFinalResults();
  const { getBrand } = useGetBrand();
  const userId = getCurrentUser()?.userId;
  const transactionId = searchParams.get("transactionId");
  const brandId = searchParams.get("brandId");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!transactionId) {
        toast.error("No transaction ID found");
        router.push("/");
        return;
      }

      try {
        // Get stored transaction data
        const storedData = localStorage.getItem("paymentTransaction");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setTransactionData(parsedData);

          // Since we're bypassing payment gateway, treat as success
          setPaymentStatus("SUCCESS");
          toast.success(
            "Payment successful! Please complete your information below."
          );
          setShowForm(true);
        } else {
          toast.error("Transaction data not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Error processing payment");
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [transactionId]);

  // Fetch brand data when brandId is available
  useEffect(() => {
    const fetchBrandData = async () => {
      if (brandId) {
        try {
          const result = await getBrand.mutateAsync(brandId);
          if (result.success) {
            setBrandData(result.brand_results);
            // Set default logo if available
            if (
              result.brand_results.brand_identity?.logos &&
              result.brand_results.brand_identity?.logos.length > 0
            ) {
              setSelectedLogo(
                result.brand_results.brand_identity.logos[0].image_url
              );
            }
          }
        } catch (error) {
          console.error("Error fetching brand data:", error);
          toast.error("Failed to fetch brand data");
        }
      }
    };

    if (showForm && brandId) {
      fetchBrandData();
    }
  }, [showForm, brandId]);

  const generateFinalResults = async () => {
    if (!transactionData?.brandData) {
      toast.error("Brand data not found");
      return;
    }

    if (!selectedLogo) {
      toast.error("Please select a logo option");
      return;
    }

    setIsGeneratingResults(true);
    setShowGeneratingLoader(true);

    try {
      // Generate a unique user ID

      // Call the backend endpoint to generate final results
      const result = await finalResultsMutation.mutateAsync({
        userId: userId,
        brandId: brandId || transactionData.brandData?.id || "temp-brand-id",
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhoneNumbers: formData.userPhoneNumbers,
        registrationNumber: formData.registrationNumber,
        website: formData.website,
        brandLogo: selectedLogo,
        others: {},
      });

      if (result.success) {
        toast.success("Brand kit generated successfully! redirecting ...");

        // Redirect to full brand results page
        setTimeout(() => {
          router.push(`/full-brand-results?brandId=${brandId}`);
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to generate final results");
      }
    } catch (error) {
      console.error("Error generating final results:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate brand kit"
      );
    } finally {
      setIsGeneratingResults(false);
      setShowGeneratingLoader(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return <CheckCircle className="w-16 h-16 text-green-600" />;
      case "FAILED":
        return <XCircle className="w-16 h-16 text-red-600" />;
      case "PENDING":
        return <Clock className="w-16 h-16 text-yellow-600" />;
      default:
        return <Clock className="w-16 h-16 text-gray-600" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "Payment Successful!";
      case "FAILED":
        return "Payment Failed";
      case "PENDING":
        return "Payment Pending";
      default:
        return "Checking Payment Status";
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "Your payment has been confirmed. Please complete your information below to generate your brand kit.";
      case "FAILED":
        return "Your payment was not successful. Please try again or contact support.";
      case "PENDING":
        return "Your payment is being processed. Please check your phone for confirmation.";
      default:
        return "We're checking your payment status...";
    }
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              Checking Payment Status
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Generating Loader Overlay */}
      {showGeneratingLoader && (
        <div className="fixed inset-0 bg-black/50 dark:bg-gray-800 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Generating Your Complete Brand Kit
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're creating your comprehensive brand package with logos,
                business cards, marketing materials, and more...
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Processing brand assets...</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <span>Creating marketing materials...</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <span>Preparing your complete kit...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-2xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Payment Status
              </h1>
            </div>
          </div>

          {/* Payment Status Card */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-6">{getStatusIcon()}</div>

              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                {getStatusTitle()}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {getStatusMessage()}
              </p>

              {transactionData && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2 dark:text-white">
                    Transaction Details
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>
                        {transactionData.amount?.toLocaleString()} XAF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brand:</span>
                      <span>{transactionData.brandName}</span>
                    </div>
                  </div>
                </div>
              )}

              <Badge
                variant={
                  paymentStatus === "SUCCESS"
                    ? "default"
                    : paymentStatus === "FAILED"
                    ? "destructive"
                    : "secondary"
                }
                className="mb-4"
              >
                {paymentStatus}
              </Badge>

              {paymentStatus === "SUCCESS" && isGeneratingResults && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    Generating your brand kit...
                  </p>
                </div>
              )}

              {paymentStatus === "FAILED" && (
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => router.push("/payment")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Back to Home
                  </Button>
                </div>
              )}

              {paymentStatus === "PENDING" && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Check Status Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information Form */}
          {showForm && paymentStatus === "SUCCESS" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Complete Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="userName"
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="userName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData({ ...formData, userName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="userEmail"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.userEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            userEmail: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="userPhoneNumbers"
                        className="flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="userPhoneNumbers"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.userPhoneNumbers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            userPhoneNumbers: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="Enter your website URL"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="registrationNumber"
                      className="flex items-center gap-2"
                    >
                      <Building className="w-4 h-4" />
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      type="text"
                      placeholder="Enter your business registration number"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Logo Selection */}
                  {brandData?.brand_identity?.logos &&
                    brandData.brand_identity.logos.length > 0 && (
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Choose Your Logo *
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {brandData.brand_identity.logos.map(
                            (logo: any, index: number) => (
                              <div
                                key={index}
                                className={`relative border-2 rounded-lg p-1 cursor-pointer transition-all ${
                                  selectedLogo === logo.image_url
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => setSelectedLogo(logo.image_url)}
                              >
                                <img
                                  src={logo.image_url}
                                  alt={`Logo option ${index + 1}`}
                                  className="w-full h-40 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                {selectedLogo === logo.image_url && (
                                  <div className="absolute top-2 right-2">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                  </div>
                                )}
                                {/* <p className="text-center text-sm mt-2 font-medium">
                                  {logo.description || `Option ${index + 1}`}
                                </p> */}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Generate Button */}
                  <div className="pt-4">
                    <Button
                      onClick={generateFinalResults}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={
                        isGeneratingResults ||
                        !formData.userName ||
                        !formData.userEmail ||
                        !selectedLogo
                      }
                      size="lg"
                    >
                      {isGeneratingResults ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Generating Complete Brand Kit...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Generate Complete Brand Kit
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {paymentStatus === "PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle>What to do next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Check your phone</p>
                      <p className="text-sm text-gray-600">
                        Look for a payment confirmation message from your mobile
                        money provider
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Confirm the payment</p>
                      <p className="text-sm text-gray-600">
                        Enter your mobile money PIN to complete the transaction
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Wait for confirmation</p>
                      <p className="text-sm text-gray-600">
                        Once confirmed, your brand kit will be generated
                        automatically
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Providers>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                </CardContent>
              </Card>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default PaymentSuccessPage;
