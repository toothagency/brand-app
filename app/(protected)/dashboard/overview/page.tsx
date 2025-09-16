"use client";

import React, { useState } from "react";
import {
  useUserBrands,
  useDeleteBrand,
  useDownloadBrand,
} from "../../../hooks/hooks";
import { getCurrentUser } from "../../../(auth)/hooks/authHooks";
import { Brand } from "../../../contexts/BrandContext";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import {
  Trash2,
  Download,
  Eye,
  Plus,
  Loader2,
  Palette,
  TrendingUp,
  Users,
  Calendar,
  Star,
  ArrowRight,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useGetBrand } from "@/app/hooks/useGetBrand";
import ResultsDisplay from "../../form/components/results/ResultsDisplay";
import { DetailedBrandObject, FullBrand } from "../../form/utils/types";
import { useGetFullResults } from "@/app/hooks/useGetFullResults";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";

const OverviewPage = () => {
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
      <DashboardLayout title="Dashboard Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3467AA]" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (result) {
    return <ResultsDisplay brandData={result} />;
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading dashboard: {error.message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (fullResult) {
    return <FullBrandResultsContent brandData={fullResult} />;
  }

  const brands = userBrandsData?.brands || [];
  const paidBrands = brands.filter(brand => brand.payment_status);
  const freeBrands = brands.filter(brand => !brand.payment_status);

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Welcome back! Here's what's happening with your brands."
      actions={
        <Link href="/form">
          <Button className="bg-[#3467AA] hover:bg-[#3467AA]/90 dark:text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Brand
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {brands.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Premium Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paidBrands.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Free Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {freeBrands.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {brands.filter(brand => {
                      const brandDate = new Date(brand.id);
                      const now = new Date();
                      return brandDate.getMonth() === now.getMonth() && 
                             brandDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Brands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Brands</span>
                <Link href="/dashboard/brands">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Your latest brand creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {brands.length === 0 ? (
                <div className="text-center py-8">
                  <Palette className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No brands yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                <div className="space-y-4">
                  {brands.slice(0, 3).map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {brand.logo && (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <img
                              src={brand.logo}
                              alt="Brand Logo"
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {brand.name || "Untitled Brand"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(brand.id).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {brand.payment_status ? "Paid" : "Free"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => view(brand)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/form">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Brand
                  </Button>
                </Link>
                <Link href="/dashboard/brands">
                  <Button className="w-full justify-start" variant="outline">
                    <Palette className="w-4 h-4 mr-2" />
                    Manage Brands
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
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
    </DashboardLayout>
  );
};

// Keep the existing FullBrandResultsContent component
interface brandDataProps {
  brandData: FullBrand;
}
const FullBrandResultsContent: React.FC<brandDataProps> = ({ brandData }) => {
  // ... existing implementation
  return <div>Full Brand Results</div>;
};

export default OverviewPage;
