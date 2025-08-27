"use client";
import React, { useState } from "react";
import { X, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { useFapshiPayment } from "@/app/hooks/useFapshiPayment";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  userId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  brandId,
  userId,
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();
  const { initiatePayment } = useFapshiPayment();

  const generateTransactionId = () => {
    return `fs-form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePayment = async () => {
    if (!brandId || !userId) {
      toast.error("Missing brand or user information");
      return;
    }

    setIsInitializing(true);

    try {
      const transactionId = generateTransactionId();
      
      // Store the payment transaction data
      const paymentTransaction = {
        transactionId: transactionId,
        brandId: brandId,
        userId: userId,
        amount: 500,
        type: "form_payment",
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("formPaymentTransaction", JSON.stringify(paymentTransaction));

      // Store redirect parameters for after payment
      const redirectParams = {
        transactionId: transactionId,
        brandId: brandId,
        userId: userId,
        paymentType: "form_payment"
      };

      localStorage.setItem("formPaymentRedirectParams", JSON.stringify(redirectParams));

      // Call Fapshi API to initiate payment
      const result = await initiatePayment.mutateAsync({
        amount: 500,
        email: "", // Optional - user can enter on Fapshi page
        redirectUrl: `${window.location.origin}/form/success`,
        userId: userId,
        externalId: transactionId,
        message: "Brand Generation Payment"
      });

      if (result.success) {
        // Redirect to Fapshi payment page
        window.location.href = result.data.link;
      } else {
        toast.error(result.error || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mr-3">
              <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Complete Your Brand Generation
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            To generate your complete brand kit, a payment of{" "}
            <strong className="text-green-600 dark:text-green-400">1000 XAF</strong> is required.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Your Brand Kit Includes:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Professional logo designs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Brand color palette
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Typography recommendations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Brand guidelines
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Marketing materials
            </li>
          </ul>
        </div>

        {/* Payment button */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isInitializing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isInitializing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay 500 XAF & Generate Brand
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
