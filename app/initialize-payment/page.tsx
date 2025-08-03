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
import { usePayUnitPayment } from "../hooks/usePayUnitPayment";
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
  const { initializePayment } = usePayUnitPayment();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get brand data from URL params
  const brandData = searchParams.get("brandData")
    ? JSON.parse(decodeURIComponent(searchParams.get("brandData")!))
    : null;

  const brandName = brandData?.brand_communication?.brand_name || "your brand";

  // Pricing in XAF
  const amountXAF = 10000; // Current price
  const originalAmountXAF = 20000; // Original price (slashed)
  const discountXAF = originalAmountXAF - amountXAF; // Discount amount

  const generateTransactionId = () => {
    return `pu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleInitializePayment = async () => {
    setIsInitializing(true);

    try {
      const transactionId = generateTransactionId();
      const returnUrl = `${window.location.origin}/payment-success?transactionId=${transactionId}`;
      const notifyUrl = `${window.location.origin}/api/payunit/callback`;

      // Initialize payment with PayUnit
      const initResult = await initializePayment.mutateAsync({
        total_amount: amountXAF,
        transaction_id: transactionId,
        return_url: returnUrl,
        notify_url: notifyUrl,
      });

      if (initResult.status === "SUCCESS") {
        // Store transaction info for success page
        localStorage.setItem(
          "paymentTransaction",
          JSON.stringify({
            transactionId,
            amount: amountXAF,
            brandName,
            brandData,
            payunitData: initResult.data,
          })
        );

        // Redirect to PayUnit's hosted payment page
        window.location.href = initResult.data.transaction_url;
      } else {
        throw new Error(initResult.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to initialize payment"
      );
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
              onClick={() => router.back()}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Brand Kit
              </h1>
            </div>

            <p className="text-lg text-gray-600 mb-2">
              Secure payment for {brandName}
            </p>
            <p className="text-sm text-gray-500">
              Choose your preferred payment method
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Summary */}
            <Card>
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
                    <div className="text-sm text-gray-500">
                      Complete Brand Kit
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Complete Brand Kit</span>
                      <span className="font-semibold">
                        {amountXAF.toLocaleString()} XAF
                      </span>
                    </div>

                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">
                          Original Price
                        </span>
                        <span className="text-sm text-gray-500 line-through">
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isInitializing}
                    size="lg"
                  >
                    {isInitializing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Initializing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Initialize Payment
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Complete Brand Kit:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• High-resolution logo files (AI, SVG, PNG)</li>
                      <li>• Complete brand guidelines document</li>
                      <li>• Social media templates (50+ designs)</li>
                      <li>• Business card designs</li>
                      <li>• Website mockups</li>
                      <li>• Email signature templates</li>
                      <li>• Print-ready files</li>
                      <li>• Lifetime updates</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Payment Methods Available:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Mobile Money (Orange, MTN)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Credit/Debit Cards
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Secure Payment:
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• SSL encrypted payment processing</li>
                      <li>• PCI DSS compliant</li>
                      <li>• Instant payment confirmation</li>
                      <li>• Money-back guarantee</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ready to complete your brand?
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Initialize Payment" to proceed to our secure payment
                  gateway where you can choose your preferred payment method.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Multiple Payment Options</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
