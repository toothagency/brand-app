"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Loader2,
  ArrowLeft,
  Smartphone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useFapshiPayment } from "../hooks/useFapshiPayment";

import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const InitializePaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { initiatePayment } = useFapshiPayment();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get brand data from URL params
  const brandData = searchParams.get("brandData")
    ? JSON.parse(decodeURIComponent(searchParams.get("brandData")!))
    : null;

  const brandName = brandData?.brand_communication?.brand_name || "your brand";

  // Pricing in XAF
  const amountXAF = 15000; // Current price
  const originalAmountXAF = 30000; // Original price (slashed)
  const discountXAF = originalAmountXAF - amountXAF; // Discount amount

  const generateTransactionId = () => {
    return `fs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleInitializePayment = async () => {
    setIsInitializing(true);

    try {
      const transactionId = generateTransactionId();
      
      // Create clean redirect URL without parameters to avoid conflicts with Fapshi's parameters
      const redirectUrl = `${window.location.origin}/payment-success`;
      
      // Store additional parameters in localStorage for retrieval after redirect
      localStorage.setItem('paymentRedirectParams', JSON.stringify({
        transactionId,
        brandId: brandData?.id || brandData?.answerId
      }));
      
      // Get user email from localStorage or use a default
      const userEmail = localStorage.getItem('userEmail');
      
      // Initiate Fapshi payment
      const result = await initiatePayment.mutateAsync({
        amount: amountXAF,
        ...(userEmail && { email: userEmail }),
        redirectUrl: redirectUrl,
        userId: transactionId,
        externalId: transactionId,
        message: `Payment for ${brandName} Complete Brand Kit`
      });

      if (result.success && result.data.link) {
        // Store transaction info for success page
        localStorage.setItem(
          "paymentTransaction",
          JSON.stringify({
            transactionId,
            amount: amountXAF,
            brandName,
            brandData,
            fapshiData: {
              status: "PENDING",
              message: "Payment initiated",
              transaction_url: redirectUrl,
              transId: result.data.transId,
              link: result.data.link
            },
          })
        );

        // Redirect to Fapshi payment page
        window.location.href = result.data.link;
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen dark:text-white dark:bg-gray-800 p-4">
      <div className="max-w-2xl mx-auto mt-52 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-center mb-2">
             
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Complete Brand Kit
              </h1>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-200">
              Complete your purchase to get your brand kit
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {/* Payment Summary */}
            <Card className="dark:bg-gray-800  dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {amountXAF.toLocaleString()} XAF
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-200">
                      Complete Brand Kit
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-200">Complete Brand Kit</span>
                      <span className="font-semibold">
                        {amountXAF.toLocaleString()} XAF
                      </span>
                    </div>

                    <div className="border-t pt-2 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-200">
                          Original Price
                        </span>
                        <span className="text-sm text-gray-500 line-through dark:text-gray-200">
                          {originalAmountXAF.toLocaleString()} XAF
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-green-600">Discount</span>
                        <span className="text-sm text-green-600">
                          -{discountXAF.toLocaleString()} XAF
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>{amountXAF.toLocaleString()} XAF</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleInitializePayment}
                    className="w-full bg-blue-600 dark:text-white hover:bg-blue-700"
                    disabled={isInitializing}
                    size="lg"
                  >
                    {isInitializing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Complete Payment
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

           
          </div>

         
        </motion.div>
      </div>
    </div>
  );
};

const InitializePaymentPage = () => {
  return (
    <Providers>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment page...</p>
              </div>
            </div>
          }
        >
          <InitializePaymentContent />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default InitializePaymentPage;
