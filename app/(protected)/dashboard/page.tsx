"use client";

import React, { useState } from "react";
import {
  useUserBrands,
  useDeleteBrand,
  useDownloadBrand,
} from "../../hooks/hooks";
import { getCurrentUser } from "../../(auth)/hooks/authHooks";
import { Brand } from "../../contexts/BrandContext";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Trash2,
  Download,
  Eye,
  Plus,
  Loader2,
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
import Link from "next/link";
import { useGetBrand } from "@/app/hooks/useGetBrand";
import ResultsDisplay from "../form/components/results/ResultsDisplay";
import { DetailedBrandObject, FullBrand } from "../form/utils/types";
import { useGetFullResults } from "@/app/hooks/useGetFullResults";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
const DashboardPage = () => {
  const currentUser = getCurrentUser();
  const { data: userBrandsData, isLoading, error, refetch } = useUserBrands();
  const deleteBrandMutation = useDeleteBrand();
  const downloadBrandMutation = useDownloadBrand();
  const [selectedBrand, setSelectedBrand] =
    useState<DetailedBrandObject | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] =
    useState<DetailedBrandObject | null>(null);
  const { getBrand } = useGetBrand();
  const { getFullResults } = useGetFullResults();
  const [loader, setIsLoader] = useState(false);
  const [error2, setError2] = useState<string | null>();
  const [result, setShowResult] = useState<DetailedBrandObject | null>(null);
  const [fullResult, setShowFullResult] = useState<FullBrand | null>(null);
  const handleDeleteBrand = async (brand: DetailedBrandObject) => {
    if (!currentUser?.userId) return;

    try {
      await deleteBrandMutation.mutateAsync({
        brandId: brand.id,
        userId: currentUser.userId,
      });
      setShowDeleteModal(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  const handleDownloadBrand = async (brand: DetailedBrandObject) => {
    if (!currentUser?.userId) return;

    try {
      await downloadBrandMutation.mutateAsync({
        brandId: brand.id,
        userId: currentUser.userId,
      });
    } catch (error) {
      console.error("Failed to download brand:", error);
    }
  };

  const openDeleteModal = (brand: DetailedBrandObject) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  const view = (brand: DetailedBrandObject) => {
    if (!brand.premium) {
      freeBrand(brand.id);
    } else {
      fetchFullResults(brand.id);
    }
  };
  const freeBrand = (brandId: string) => {
    const fetchBrandData = async () => {
      if (!brandId) {
        setError2("No brand ID provided");
        setIsLoader(false);
        return;
      }

      try {
        setIsLoader(true);
        setError2(null);

        const result = await getBrand.mutateAsync(brandId);

        if (result.success) {
          // Store the brand data in localStorage for the ResultsDisplay component
          // The API returns { brand_results: {...}, message: "...", success: true }
          localStorage.setItem(
            "currentBrandData",
            JSON.stringify(result.brand_results)
          );
          setShowResult(result.brand_results);
          setIsLoader(false);
        } else {
          throw new Error(result.message || "Failed to fetch brand data");
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
        setError2(
          error instanceof Error ? error.message : "Failed to fetch brand data"
        );
        setIsLoader(false);
      }
    };

    fetchBrandData();
  };
  const fetchFullResults = async (brandId: string) => {
    setIsLoader(true);
    if (!brandId) {
      setError2("No brand ID provided");
      setIsLoader(false);
      return;
    }

    try {
      setIsLoader(true);
      const result = await getFullResults.mutateAsync(brandId);
      if (result.success) {
        setShowFullResult(result.full_brand);
        console.log("result", result.full_brand)
      } else {
        throw new Error(result.message || "Failed to fetch full brand results");
      }
    } catch (error) {
      console.error("Error fetching full brand results:", error);
    } finally {
      setIsLoader(false);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3467AA]/5 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3467AA]" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading your brands...
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <>
        <ResultsDisplay
          brandData={result}
        />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3467AA]/5 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading brands: {error.message}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (fullResult) {
    <FullBrandResultsContent brandData={fullResult} />;
  }

  const brands = userBrandsData?.brands || [];

  return (
    <div className="min-h-screen bg-[#3467AA]/5 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" passHref>
                <Button
                  variant="ghost"
                  className="size-16 p-0"
                  size="lg"
                  asChild
                >
                  <span>
                    <ArrowLeft className="size-12 mr-2" />
                  </span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Brands
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage and download your generated brands
                </p>
              </div>
            </div>
            <Link href="/form">
              <Button className="bg-[#3467AA] hover:bg-[#3467AA]/90 dark:text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Brand
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No brands yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first brand to get started
            </p>
            <Link href="/form">
              <Button className="bg-[#3467AA] hover:bg-[#3467AA]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Brand
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-2 items-center">
                      {brand.logo && (
                        <div className="flex justify-center">
                          <div className="w-16 h-16  flex items-center justify-center">
                            <img
                              src={brand.logo}
                              alt="Brand Logo"
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {brand.name || "Untitled Brand"}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          Created on {new Date(brand.id).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {brand.payment_status == true ? "Paid" : "Free"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Brand Logo Preview */}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => view(brand)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadBrand(brand)}
                        disabled={downloadBrandMutation.isPending}
                      >
                        {downloadBrandMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-1" />
                        )}
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        onClick={() => openDeleteModal(brand)}
                        disabled={deleteBrandMutation.isPending}
                      >
                        {deleteBrandMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && brandToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Brand
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "
              {brandToDelete.name || "Untitled Brand"}"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={deleteBrandMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBrand(brandToDelete)}
                disabled={deleteBrandMutation.isPending}
              >
                {deleteBrandMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
interface brandDataProps {
  brandData: FullBrand;
}
const FullBrandResultsContent: React.FC<brandDataProps> = ({ brandData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  if (!brandData) {
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
              onClick={() => {}}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { brand, brand_assets } = brandData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => {}}
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
                        <span>{brand?.brand_strategy?.our_position?.name}</span>
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
                    <div className="text-sm text-gray-600">Business Cards</div>
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
                    <div className="text-sm text-gray-600">Email Templates</div>
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
                                <strong>Signature:</strong> {template.signature}
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
                        <h4 className="font-semibold mb-2">Hero Subheadline</h4>
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
                              <h4 className="font-semibold">Ad {index + 1}</h4>
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
  );
};
export default DashboardPage;
