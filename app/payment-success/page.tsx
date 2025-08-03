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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePayUnitPayment } from "../hooks/usePayUnitPayment";
import { useFinalResults } from "../hooks/useFinalResults";
import Providers from "../providers";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "SUCCESS" | "FAILED"
  >("PENDING");
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);

  const { getPaymentStatus } = usePayUnitPayment();
  const finalResultsMutation = useFinalResults();

  const transactionId = searchParams.get("transactionId");

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
          setTransactionData(JSON.parse(storedData));
        }

        // Check payment status with PayUnit
        const statusResult = await getPaymentStatus.mutateAsync(transactionId);

        if (statusResult.status === "SUCCESS") {
          const status = statusResult.data.transaction_status;
          setPaymentStatus(status);

          if (status === "SUCCESS") {
            toast.success("Payment successful! Generating your brand kit...");
            await generateFinalResults();
          } else if (status === "FAILED") {
            toast.error("Payment failed. Please try again.");
          } else if (status === "PENDING") {
            toast.custom("Payment is still pending. Please check your phone.");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        toast.error("Error checking payment status");
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [transactionId]);

  const generateFinalResults = async () => {
    if (!transactionData?.brandData) {
      toast.error("Brand data not found");
      return;
    }

    setIsGeneratingResults(true);

    try {
      // Get user data from cookies
      const userDataCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userData="));

      if (!userDataCookie) {
        throw new Error("User not found");
      }

      const userData = JSON.parse(
        decodeURIComponent(userDataCookie.split("=")[1])
      );
      const userId = userData?.userId;
      const userName = userData?.name || "User";
      const userEmail = userData?.email || "";

      if (!userId) {
        throw new Error("User ID not found");
      }

      // Call the backend endpoint to generate final results
      const result = await finalResultsMutation.mutateAsync({
        userId: userId,
        brandId: transactionData.brandData?.id || "temp-brand-id",
        userName: userName,
        userEmail: userEmail,
        userPhoneNumbers: "",
        registrationNumber: "",
        website: "",
        brandLogo: "",
        others: {},
      });

      if (result.success) {
        toast.success("Brand kit generated successfully!");

        // Redirect to full brand results page
        setTimeout(() => {
          router.push(
            `/full-brand-results?data=${encodeURIComponent(
              JSON.stringify(result.results)
            )}`
          );
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
        return "Your payment has been confirmed. Generating your complete brand kit...";
      case "FAILED":
        return "Your payment was not successful. Please try again or contact support.";
      case "PENDING":
        return "Your payment is being processed. Please check your phone for confirmation.";
      default:
        return "We're checking your payment status...";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">
              Checking Payment Status
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
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
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Status
              </h1>
            </div>
          </div>

          {/* Payment Status Card */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-6">{getStatusIcon()}</div>

              <h2 className="text-2xl font-bold mb-2">{getStatusTitle()}</h2>
              <p className="text-gray-600 mb-6">{getStatusMessage()}</p>

              {transactionData && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Transaction Details</h3>
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
      <PaymentSuccessContent />
    </Providers>
  );
};

export default PaymentSuccessPage;
