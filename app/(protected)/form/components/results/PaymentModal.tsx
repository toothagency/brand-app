"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Crown, Check, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadBlueprint: () => void;
  brandName?: string;
  brandId?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onDownloadBlueprint,
  brandName = "your brand",
  brandId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"blueprint" | "full">(
    "blueprint"
  );

  const handleDownloadBlueprint = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      onDownloadBlueprint();
      onClose();
      toast.success("Blueprint downloaded successfully!");
    }, 1000);
  };

  const handlePurchaseFull = () => {
    setIsProcessing(true);
    // Redirect to payment page with brand data
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      // Pass brand data to payment page
      const brandDataParam = encodeURIComponent(
        JSON.stringify({
          id: brandId || "temp-brand-id", // Use actual brand ID if available
          brand_communication: {
            brand_name: brandName,
          },
        })
      );
      window.location.href = `/initialize-payment?brandData=${brandDataParam}`;
    }, 1000);
  };

  const plans = [
    {
      id: "blueprint",
      title: "Free Blueprint",
      price: "Free",
      description: "Download your brand blueprint with recommendations",
      features: [
        "Complete brand strategy document",
        "Color palette recommendations",
        "Typography suggestions",
        "Logo design concepts",
        "Marketing strategy overview",
        "Content calendar sample",
      ],
      buttonText: "Download Blueprint",
      buttonVariant: "outline" as const,
      icon: Download,
      popular: false,
    },
    {
      id: "full",
      title: "Complete Brand Kit",
      price: "10,000 XAF",
      originalPrice: "20,000 XAF",
      description: "Get everything you need to launch your brand",
      features: [
        "Everything in Blueprint",
        "High-resolution logo files (AI, SVG, PNG)",
        "Complete brand guidelines document",
        "Social media templates (50+ designs)",
        "Business card designs",
        "Website mockups",
        "Email signature templates",
        "Print-ready files",
        "Lifetime updates",
        "Priority support",
      ],
      buttonText: "Purchase Full Kit",
      buttonVariant: "default" as const,
      icon: Crown,
      popular: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Choose Your Option
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Get your {brandName} brand materials
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => {
                  const IconComponent = plan.icon;
                  return (
                    <Card
                      key={plan.id}
                      className={`relative transition-all duration-200 hover:shadow-lg ${
                        selectedOption === plan.id
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : ""
                      } ${
                        plan.popular
                          ? "border-blue-200 dark:border-blue-700"
                          : ""
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                          Most Popular
                        </Badge>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-3">
                          <div
                            className={`p-3 rounded-full ${
                              plan.popular
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${
                                plan.popular
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            />
                          </div>
                        </div>

                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {plan.title}
                        </CardTitle>

                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                          {plan.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              {plan.originalPrice}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {plan.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant={plan.buttonVariant}
                          size="lg"
                          className={`w-full ${
                            plan.popular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : ""
                          }`}
                          onClick={
                            plan.id === "blueprint"
                              ? handleDownloadBlueprint
                              : handlePurchaseFull
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {plan.id === "full" && (
                                <CreditCard className="w-4 h-4" />
                              )}
                              {plan.buttonText}
                            </div>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Why Choose the Complete Brand Kit?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      The Complete Brand Kit includes all the files you need to
                      immediately start using your brand across all platforms.
                      Save time and ensure consistency with professionally
                      designed templates and high-resolution assets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
