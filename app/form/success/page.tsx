"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useFapshiPayment } from "../../hooks/useFapshiPayment";
import { useGetBrandResults } from "../../(protected)/form/hooks/formHooks";
import axios from "../../configs/axiosConfigs";

const FormSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "SUCCESS" | "FAILED">("PENDING");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isGeneratingBrand, setIsGeneratingBrand] = useState(false);
  const [brandGenerated, setBrandGenerated] = useState(false);
  
  // Fapshi redirect parameters
  const fapshiTransId = searchParams.get("transId");
  const fapshiStatus = searchParams.get("status");
  const { getPaymentStatus } = useFapshiPayment();
  
  // Get stored redirect parameters from localStorage
  const getStoredRedirectParams = () => {
    const storedParams = localStorage.getItem('formPaymentRedirectParams');
    if (storedParams) {
      try {
        return JSON.parse(storedParams);
      } catch (error) {
        console.error('Error parsing stored redirect params:', error);
        return null;
      }
    }
    return null;
  };
  
  const storedParams = getStoredRedirectParams();
  const getBrandResultsMutation = useGetBrandResults(storedParams?.userId || ""); // We'll get userId from localStorage


    // Verify payment status
  useEffect(() => {
    const verifyPayment = async () => {
      if (!fapshiTransId || !fapshiStatus) {
        toast.error("Payment verification failed - missing parameters");
        router.push("/");
        return;
      }

      setIsVerifyingPayment(true);

      try {
        // Verify payment with Fapshi
        const paymentResult = await getPaymentStatus.mutateAsync(fapshiTransId);
        console.log("Payment Result:", paymentResult);
        
        if (paymentResult) {
          if (paymentResult.status === "SUCCESSFUL") {
            setPaymentStatus("SUCCESS");
            setIsVerifyingPayment(false);
            console.log("Payment Status:", paymentResult.status);
            console.log("Stored Params:", storedParams);
            
            // Generate brand results
            await generateBrandResults();
          } else if (paymentResult.status === "FAILED" || paymentResult.status === "EXPIRED") {
            setPaymentStatus("FAILED");
            toast.error("Payment failed or expired");
          } else {
            setPaymentStatus("PENDING");
            toast.error("Payment is still pending");
          }
        } else {
          setPaymentStatus("FAILED");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("FAILED");
        toast.error("Payment verification failed");
      } finally {
        setIsVerifyingPayment(false);
      }
    };

    if (fapshiTransId && fapshiStatus) {
      verifyPayment();
    }
  }, [fapshiTransId, fapshiStatus, router]);

  // Generate brand results
  const generateBrandResults = async () => {
    console.log("Starting brand generation...");
    setIsGeneratingBrand(true);

    try {
      // Get stored redirect params and transaction data
      const storedParams = getStoredRedirectParams();
      if (!storedParams?.brandId) {
        toast.error("Brand ID not found");
        setIsGeneratingBrand(false);
        return;
      }

      let userId = "";
      const storedTransaction = localStorage.getItem("formPaymentTransaction");
      if (storedTransaction) {
        try {
          const transactionData = JSON.parse(storedTransaction);
          userId = transactionData?.userId || "";
        } catch (e) {
          userId = "";
        }
      }

      if (!userId && storedParams.userId) {
        userId = storedParams.userId;
      }

      if (!userId) {
        toast.error("User ID not found");
        setIsGeneratingBrand(false);
        return;
      }

      console.log("Calling brand results mutation with:", { brandId: storedParams.brandId, userId });

      // Call the brand results mutation (should include userId if required by backend)
      const result = await getBrandResultsMutation.mutateAsync({
        brandId: storedParams.brandId,
        // userId: userId, // Uncomment if your mutation expects userId
      });

      console.log("Brand results mutation result:", result);

      if (result && result.brandId) {
        // Store the brand data
        localStorage.setItem("currentBrandData", JSON.stringify(result));
        setBrandGenerated(true);

        toast.success("Brand generated successfully! Redirecting...");

        // Redirect to brand results page
        setTimeout(() => {
          router.push(`/brand-results?brandId=${storedParams.brandId}`);
        }, 2000);
      } else {
        throw new Error("Failed to generate brand results");
      }
    } catch (error) {
      console.error("Error generating brand results:", error);
      toast.error("Failed to generate brand results");
    } finally {
      console.log("Setting isGeneratingBrand to false");
      setIsGeneratingBrand(false);
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
        return isGeneratingBrand 
          ? "Generating your brand kit..." 
          : "Your payment has been confirmed. Generating your brand kit...";
      case "FAILED":
        return "Your payment was not successful. Please try again or contact support.";
      case "PENDING":
        return "Your payment is being processed. Please wait and try again.";
      default:
        return "We're checking your payment status...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">{getStatusIcon()}</div>
          
          <h2 className="text-2xl font-bold mb-2 dark:text-white">
            {getStatusTitle()}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {getStatusMessage()}
          </p>

          {(isVerifyingPayment || isGeneratingBrand) && (
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {isVerifyingPayment ? "Verifying payment..." : "Generating brand..."}
              </span>
            </div>
          )}

          {paymentStatus === "FAILED" && (
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back Home
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSuccessPage;
