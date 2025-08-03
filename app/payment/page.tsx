"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Smartphone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { usePayUnitPayment } from "../hooks/usePayUnitPayment";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const PaymentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "processing" | "success"
  >("form");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    paymentMethod: "CM_ORANGE", // Default to Orange Money
  });
  const [isMounted, setIsMounted] = useState(false);
  const { initializePayment, makePayment } = usePayUnitPayment();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get brand data from URL params
  const brandData = searchParams.get("brandData")
    ? JSON.parse(decodeURIComponent(searchParams.get("brandData")!))
    : null;

  const brandName = brandData?.brand_communication?.brand_name || "your brand";

  // Convert $10,000 to XAF (approximately 6,000,000 XAF)
  const amountUSD = 10000;
  const amountXAF = 6000000; // Approximate conversion

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateTransactionId = () => {
    return `pu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePayWithMobileMoney = async () => {
    if (!formData.phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      const transactionId = generateTransactionId();
      const returnUrl = `${window.location.origin}/payment-success?transactionId=${transactionId}`;
      const notifyUrl = `${window.location.origin}/api/payunit/callback`;

      // Initialize payment
      const initResult = await initializePayment.mutateAsync({
        total_amount: amountXAF,
        transaction_id: transactionId,
        return_url: returnUrl,
        notify_url: notifyUrl,
      });

      if (initResult.status === "SUCCESS") {
        // Make payment with mobile money
        const paymentResult = await makePayment.mutateAsync({
          gateway: formData.paymentMethod,
          amount: amountXAF,
          transaction_id: transactionId,
          return_url: returnUrl,
          phone_number: formData.phoneNumber,
          notify_url: notifyUrl,
        });

        if (paymentResult.status === "SUCCESS") {
          setPaymentStep("success");
          toast.success(
            "Payment initiated! Check your phone for payment confirmation."
          );

          // Store transaction info for success page
          localStorage.setItem(
            "paymentTransaction",
            JSON.stringify({
              transactionId,
              amount: amountXAF,
              brandName,
              brandData,
            })
          );

          // Redirect to success page after a delay
          setTimeout(() => {
            router.push(`/payment-success?transactionId=${transactionId}`);
          }, 3000);
        } else {
          throw new Error(paymentResult.message || "Payment failed");
        }
      } else {
        throw new Error(initResult.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setPaymentStep("form");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayWithMobileMoney();
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">
              Please wait while we process your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Payment Initiated!</h2>
            <p className="text-gray-600">
              Check your phone for payment confirmation...
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
              onClick={() => router.back()}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Brand Kit
              </h1>
            </div>

            <p className="text-lg text-gray-600 mb-2">
              Secure payment for {brandName}
            </p>
            <p className="text-sm text-gray-500">
              Pay with Mobile Money (Orange Money, MTN Mobile Money)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Mobile Money Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        handleInputChange("paymentMethod", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CM_ORANGE">Orange Money</option>
                      <option value="CM_MTN">MTN Mobile Money</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="67xxxxxxx (Orange) or 65xxxxxxx (MTN)"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your mobile money phone number
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Pay {amountXAF.toLocaleString()} XAF
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Complete Brand Kit</span>
                    <span className="font-semibold">
                      {amountXAF.toLocaleString()} XAF
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Original Price (USD)
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        $20,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600">Discount</span>
                      <span className="text-sm text-green-600">-$10,000</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>{amountXAF.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      What you'll get:
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

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      Payment Instructions:
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Enter your mobile money phone number</li>
                      <li>• Select your mobile money provider</li>
                      <li>• You'll receive a payment prompt on your phone</li>
                      <li>• Confirm the payment to complete your purchase</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Providers>
      <ErrorBoundary>
        <PaymentPageContent />
      </ErrorBoundary>
    </Providers>
  );
};

export default PaymentPage;
