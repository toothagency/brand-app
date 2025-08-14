"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Globe,
  Smartphone,
  Building,
  CheckCircle,
  Star,
  Heart,
  Clock,
  Zap,
  Award,
  Lightbulb,
  BarChart3,
  MapPin,
  Phone,
  ExternalLink,
  Copy,
  Share2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useGetFullResults } from "../hooks/useGetFullResults";
import Providers from "../providers";
import ErrorBoundary from "../components/ErrorBoundary";
import { Suspense } from "react";
import { FullBrand } from "../(protected)/form/utils/types";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const FullBrandResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [fullBrandData, setFullBrandData] = useState<FullBrand | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { getFullResults } = useGetFullResults();
  const brandId = searchParams.get("brandId");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchFullResults = async () => {
      if (!brandId) {
        toast.error("No brand ID found");
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);
        const result = await getFullResults.mutateAsync(brandId);
        if (result.success) {
          setFullBrandData(result.full_brand);
          toast.success("Full brand results loaded successfully!");
        } else {
          throw new Error(
            result.message || "Failed to fetch full brand results"
          );
        }
      } catch (error) {
        console.error("Error fetching full brand results:", error);
        toast.error("Failed to load full brand results");
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId) {
      fetchFullResults();
    }
  }, [brandId]);

  const handleDownloadAsset = (imageUrl: string, assetName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${assetName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${assetName} downloaded successfully!`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Star },
    { id: "brand-assets", label: "Brand Assets", icon: ImageIcon },
    { id: "guidelines", label: "Brand Guidelines", icon: FileText },
    { id: "marketing", label: "Marketing Materials", icon: TrendingUp },
    { id: "social-media", label: "Social Media", icon: Share2 },
    { id: "strategy", label: "Business Strategy", icon: Target },
  ];

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
              Loading Your Complete Brand Kit
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we prepare your comprehensive brand materials...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fullBrandData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <XCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              No Brand Data Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unable to load your brand information.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { brand, brand_assets } = fullBrandData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 mt-20 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {brand?.brand_communication?.brand_name || "Your Brand"} -
                Complete Kit
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your comprehensive brand package
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-8 pb-12 print:pt-4 print:pb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 print:text-3xl">
          Your Full Brand Kit
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 print:text-base">
          Comprehensive strategy for{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {brand.brand_communication?.brand_name || "your business"}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 no-pdf">
          {" "}
          {/* Buttons hidden in PDF */}
          <Button
            onClick={() => {console.log("download blueprint")}}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            Download Kit
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
                {brand.brand_communication?.brand_name}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 italic">
                "{brand.brand_communication?.brand_tagline}"
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Primary Colors
                  </h3>
                  <div className="flex space-x-3">
                    {brand.brand_identity?.primary_colors?.map(
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
                    {brand.brand_identity?.typography?.map(
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
                {brand.brand_identity?.about_the_brand}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white mt-12 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Brand Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      Brand Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {brand?.brand_communication?.brand_name}
                        </h3>
                        <p className="text-lg italic text-gray-600 mb-4">
                          "{brand?.brand_communication?.brand_tagline}"
                        </p>
                        <p className="text-gray-700">
                          {brand?.brand_identity?.about_the_brand}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Target Audience:</span>
                          <span>
                            {brand?.brand_strategy?.our_position?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Positioning:</span>
                          <span>Family-focused convenience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="font-medium">Time Saved:</span>
                          <span>5+ hours per week</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {brand.logo.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Logo Variants</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {brand_assets?.full_brand_identity?.business_cards
                          ?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Business Cards
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {brand_assets.social_media_content?.ready_made_posts
                          ?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Social Posts</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {brand_assets?.premium_assets?.marketing_templates
                          ?.email_templates?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Email Templates
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Brand Assets Tab */}
            {activeTab === "brand-assets" && (
              <div className="space-y-8">
                {/* Logos */}
                {brand?.brand_identity?.logos &&
                  brand.brand_identity.logos.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                          Brand Logos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {brand.brand_identity.logos.map(
                            (logo: any, index: number) => (
                              <div key={index} className="space-y-4">
                                <div className="border rounded-lg p-4 bg-white">
                                  <img
                                    src={logo.image_url}
                                    alt={`Logo ${index + 1}`}
                                    className="w-full h-32 object-contain"
                                  />
                                </div>
                                <div className="text-sm text-gray-600">
                                  {logo.description}
                                </div>
                                <Button
                                  onClick={() =>
                                    handleDownloadAsset(
                                      logo.image_url,
                                      `logo_${index + 1}`
                                    )
                                  }
                                  className="w-full"
                                  size="sm"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Business Cards */}
                {brand_assets?.full_brand_identity?.business_cards && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-green-600" />
                        Business Cards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brand_assets.full_brand_identity.business_cards.map(
                          (card: any, index: number) => (
                            <div key={index} className="space-y-4">
                              <div className="border rounded-lg p-4 bg-white">
                                <img
                                  src={card.image_url}
                                  alt={`Business Card ${index + 1}`}
                                  className="w-full h-48 object-contain"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handleDownloadAsset(
                                    card.image_url,
                                    `business_card_${index + 1}`
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Other Assets */}
                {brand_assets?.full_brand_identity?.t_shirt_mockups && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        T-Shirt Mockups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brand_assets.full_brand_identity.t_shirt_mockups.map(
                          (tshirt: any, index: number) => (
                            <div key={index} className="space-y-4">
                              <div className="border rounded-lg p-4 bg-white">
                                <img
                                  src={tshirt.image_url}
                                  alt={`T-Shirt ${index + 1}`}
                                  className="w-full h-64 object-contain"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handleDownloadAsset(
                                    tshirt.image_url,
                                    `tshirt_${index + 1}`
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {brand_assets?.full_brand_identity?.cap_mockups && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Cap Mockups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brand_assets.full_brand_identity.t_shirt_mockups.map(
                          (cap: any, index: number) => (
                            <div key={index} className="space-y-4">
                              <div className="border rounded-lg p-4 bg-white">
                                <img
                                  src={cap.image_url}
                                  alt={`cap ${index + 1}`}
                                  className="w-full h-64 object-contain"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handleDownloadAsset(
                                    cap.image_url,
                                    `cap_${index + 1}`
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {brand_assets?.full_brand_identity?.letterheads && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Letterheads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brand_assets.full_brand_identity.letterheads.map(
                          (tshirt: any, index: number) => (
                            <div key={index} className="space-y-4">
                              <div className="border rounded-lg p-4 bg-white">
                                <img
                                  src={tshirt.image_url}
                                  alt={`letterhead${index + 1}`}
                                  className="w-full h-64 object-contain"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handleDownloadAsset(
                                    tshirt.image_url,
                                    `letterhead_${index + 1}`
                                  )
                                }
                                className="w-full"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Brand Guidelines Tab */}
            {activeTab === "guidelines" &&
              brand_assets?.premium_assets?.brand_guidelines && (
                <div className="space-y-8">
                  {/* Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-600" />
                        Brand Colors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {brand_assets.premium_assets.brand_guidelines.style_guide.color_usage.map(
                          (color: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                              <div
                                className="w-16 h-16 rounded-lg border"
                                style={{ backgroundColor: color.hex_value }}
                              ></div>
                              <div>
                                <h4 className="font-semibold">
                                  {color.color_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {color.hex_value}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {color.usage_context}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Typography */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-green-600" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {brand_assets.premium_assets.brand_guidelines.style_guide.typography_rules.map(
                          (font: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h4 className="font-semibold mb-2">
                                {font.font_family}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Size: {font.size_range} | Line Height:{" "}
                                {font.line_height}
                              </p>
                              <p className="text-sm text-gray-500">
                                {font.usage}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brand Voice */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Brand Voice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Tone</h4>
                          <p className="text-gray-700">
                            {
                              brand_assets.premium_assets.brand_guidelines
                                .brand_voice.tone
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Communication Style
                          </h4>
                          <p className="text-gray-700">
                            {
                              brand_assets.premium_assets.brand_guidelines
                                .brand_voice.communication_style
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Personality Traits
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {brand_assets.premium_assets.brand_guidelines.brand_voice.personality_traits.map(
                              (trait: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {trait}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Marketing Materials Tab */}
            {activeTab === "marketing" &&
              brand_assets?.premium_assets?.marketing_templates && (
                <div className="space-y-8">
                  {/* Email Templates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Email Templates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {brand_assets.premium_assets.marketing_templates.email_templates.map(
                          (template: any, index: number) => (
                            <div key={index} className="border rounded-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold">
                                  {template.template_name}
                                </h4>
                                <Button
                                  onClick={() =>
                                    copyToClipboard(
                                      JSON.stringify(template, null, 2),
                                      template.template_name
                                    )
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Subject:</strong>{" "}
                                  {template.subject_line}
                                </p>
                                <p>
                                  <strong>Greeting:</strong> {template.greeting}
                                </p>
                                <p>
                                  <strong>Body:</strong> {template.body}
                                </p>
                                <p>
                                  <strong>Closing:</strong> {template.closing}
                                </p>
                                <p>
                                  <strong>Signature:</strong>{" "}
                                  {template.signature}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Landing Page Copy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Landing Page Copy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Hero Headline</h4>
                          <p className="text-lg text-gray-700">
                            {
                              brand_assets.premium_assets.marketing_templates
                                .landing_page_copy.hero_headline
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Hero Subheadline
                          </h4>
                          <p className="text-gray-700">
                            {
                              brand_assets.premium_assets.marketing_templates
                                .landing_page_copy.hero_subheadline
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Call to Action</h4>
                          <p className="text-gray-700">
                            {
                              brand_assets.premium_assets.marketing_templates
                                .landing_page_copy.call_to_action
                            }
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Benefits</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {brand_assets.premium_assets.marketing_templates.landing_page_copy.benefits.map(
                              (benefit: string, index: number) => (
                                <li key={index} className="text-gray-700">
                                  {benefit}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Social Media Tab */}
            {activeTab === "social-media" &&
              brand_assets.social_media_content && (
                <div className="space-y-8">
                  {/* Ready Made Posts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-600" />
                        Ready-Made Social Media Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {brand_assets.social_media_content.ready_made_posts.map(
                          (post: any, index: number) => (
                            <div key={index} className="border rounded-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold">
                                  Post {index + 1}
                                </h4>
                                <Button
                                  onClick={() =>
                                    copyToClipboard(
                                      post.caption,
                                      `Post ${index + 1}`
                                    )
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Caption
                                </Button>
                              </div>
                              <div className="space-y-3">
                                <p className="text-gray-700">{post.caption}</p>
                                <div className="bg-gray-50 p-3 rounded">
                                  <p className="text-sm font-medium text-gray-600">
                                    Design Concept:
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {post.design_concept}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ad Copies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Ad Copies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {brand_assets.social_media_content.ad_copies.map(
                          (ad: string, index: number) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">
                                  Ad {index + 1}
                                </h4>
                                <Button
                                  onClick={() =>
                                    copyToClipboard(ad, `Ad ${index + 1}`)
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <p className="text-gray-700">{ad}</p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Business Strategy Tab */}
            {activeTab === "strategy" &&
              brand_assets?.premium_assets?.business_strategy && (
                <div className="space-y-8">
                  {/* SWOT Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        SWOT Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3">
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {brand_assets.premium_assets.business_strategy.swot_analysis.strengths.map(
                              (strength: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{strength}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3">
                            Weaknesses
                          </h4>
                          <ul className="space-y-2">
                            {brand_assets.premium_assets.business_strategy.swot_analysis.weaknesses.map(
                              (weakness: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0">
                                    ×
                                  </div>
                                  <span className="text-sm">{weakness}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-600 mb-3">
                            Opportunities
                          </h4>
                          <ul className="space-y-2">
                            {brand_assets.premium_assets.business_strategy.swot_analysis.opportunities.map(
                              (opportunity: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{opportunity}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-600 mb-3">
                            Threats
                          </h4>
                          <ul className="space-y-2">
                            {brand_assets.premium_assets.business_strategy.swot_analysis.threats.map(
                              (threat: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0">
                                    ⚠
                                  </div>
                                  <span className="text-sm">{threat}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Competitive Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Competitive Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {brand_assets.premium_assets.business_strategy.competitive_analysis.map(
                          (competitor: any, index: number) => (
                            <div key={index} className="border rounded-lg p-6">
                              <h4 className="font-semibold text-lg mb-4">
                                {competitor.competitor_name}
                              </h4>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h5 className="font-medium text-green-600 mb-2">
                                    Strengths
                                  </h5>
                                  <ul className="space-y-1">
                                    {competitor.strengths.map(
                                      (strength: string, idx: number) => (
                                        <li
                                          key={idx}
                                          className="text-sm text-gray-700"
                                        >
                                          • {strength}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-red-600 mb-2">
                                    Weaknesses
                                  </h5>
                                  <ul className="space-y-1">
                                    {competitor.weaknesses.map(
                                      (weakness: string, idx: number) => (
                                        <li
                                          key={idx}
                                          className="text-sm text-gray-700"
                                        >
                                          • {weakness}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FullBrandResultsPage = () => {
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
          <FullBrandResultsContent />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default FullBrandResultsPage;
