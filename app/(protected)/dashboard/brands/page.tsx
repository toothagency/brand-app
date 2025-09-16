"use client";

import React, { useState } from "react";
import {
  useUserBrands,
  useDeleteBrand,
  useDownloadBrand,
} from "../../../hooks/hooks";
import { getCurrentUser } from "../../../(auth)/hooks/authHooks";
import { DetailedBrandObject, FullBrand } from "../../form/utils/types";
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
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useGetBrand } from "@/app/hooks/useGetBrand";
import ResultsDisplay from "../../form/components/results/ResultsDisplay";
import { useGetFullResults } from "@/app/hooks/useGetFullResults";
import DashboardLayout from "../components/DashboardLayout";
import { Input } from "../../../../components/ui/input";

const BrandsPage = () => {
  const currentUser = getCurrentUser();
  const { data: userBrandsData, isLoading, error, refetch } = useUserBrands();
  const deleteBrandMutation = useDeleteBrand();
  const downloadBrandMutation = useDownloadBrand();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<DetailedBrandObject | null>(null);
  const { getBrand } = useGetBrand();
  const { getFullResults } = useGetFullResults();
  const [loader, setIsLoader] = useState(false);
  const [error2, setError2] = useState<string | null>();
  const [result, setShowResult] = useState<DetailedBrandObject | null>(null);
  const [fullResult, setShowFullResult] = useState<FullBrand | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "free">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
      <DashboardLayout title="My Brands">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#3467AA]" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading your brands...
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
      <DashboardLayout title="My Brands">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading brands: {error.message}
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
  
  // Filter brands based on search and status
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         "untitled brand".includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "paid" && brand.payment_status) ||
                         (filterStatus === "free" && !brand.payment_status);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      title="My Brands"
      subtitle="Manage and organize all your brand creations"
      actions={
        <Link href="/form">
          <Button className="bg-[#3467AA] hover:bg-[#3467AA]/90 dark:text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Brand
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "paid" | "free")}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Brands</option>
                <option value="paid">Premium</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {filteredBrands.length} of {brands.length} brands
          </p>
        </div>

        {/* Brands Grid/List */}
        {filteredBrands.length === 0 ? (
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
              {searchTerm || filterStatus !== "all" ? "No brands found" : "No brands yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first brand to get started"}
            </p>
            <Link href="/form">
              <Button className="bg-[#3467AA] hover:bg-[#3467AA]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Brand
              </Button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                className={`hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader className={viewMode === "list" ? "pb-3 flex-1" : "pb-3"}>
                  <div className={`flex ${viewMode === "list" ? "items-center" : "justify-between items-start"}`}>
                    <div className="flex space-x-2 items-center">
                      {brand.logo && (
                        <div className="flex justify-center">
                          <div className={`${viewMode === "list" ? "w-12 h-12" : "w-16 h-16"} flex items-center justify-center`}>
                            <img
                              src={brand.logo}
                              alt="Brand Logo"
                              className={`${viewMode === "list" ? "w-10 h-10" : "w-12 h-12"} object-contain`}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className={`${viewMode === "list" ? "text-base" : "text-lg"} font-semibold text-gray-900 dark:text-white truncate`}>
                          {brand.name || "Untitled Brand"}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(brand.id).toLocaleDateString()}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={viewMode === "list" ? "ml-2" : "ml-2"}>
                      {brand.payment_status ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Premium
                        </div>
                      ) : (
                        "Free"
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className={viewMode === "list" ? "pt-0 flex items-center" : "pt-0"}>
                  <div className={`space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className={`flex space-x-2 ${viewMode === "list" ? "justify-end" : ""}`}>
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

export default BrandsPage;
