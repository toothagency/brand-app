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
import { Trash2, Download, Eye, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const currentUser = getCurrentUser();
  const { data: userBrandsData, isLoading, error, refetch } = useUserBrands();
  const deleteBrandMutation = useDeleteBrand();
  const downloadBrandMutation = useDownloadBrand();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const handleDeleteBrand = async (brand: Brand) => {
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

  const handleDownloadBrand = async (brand: Brand) => {
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

  const openDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading your brands...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading brands: {error.message}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const brands = userBrandsData?.brands || [];

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Brands</h1>
              <p className="text-gray-600 mt-1">
                Manage and download your generated brands
              </p>
            </div>
            <Link href="/form">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No brands yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first brand to get started
            </p>
            <Link href="/form">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {brand.name || "Untitled Brand"}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Created on {new Date(brand.id).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Brand Logo Preview */}
                    {brand.logo && (
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
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

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedBrand(brand)}
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedBrand.name || "Untitled Brand"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBrand(null)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Logo */}
                {selectedBrand.logo && (
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Brand Logo</h3>
                    <div className="flex justify-center">
                      <img
                        src={selectedBrand.logo}
                        alt="Brand Logo"
                        className="max-w-xs max-h-48 object-contain rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Brand Strategy */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Brand Strategy</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedBrand.brand_strategy}
                    </pre>
                  </div>
                </div>

                {/* Brand Identity */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Brand Identity</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedBrand.brand_identity}
                    </pre>
                  </div>
                </div>

                {/* Brand Communication */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">
                    Brand Communication
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedBrand.brand_communication}
                    </pre>
                  </div>
                </div>

                {/* Marketing Strategy */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">
                    Marketing & Social Media Strategy
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedBrand.marketing_and_social_media_strategy}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBrand(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadBrand(selectedBrand)}
                  disabled={downloadBrandMutation.isPending}
                >
                  {downloadBrandMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && brandToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Brand
            </h3>
            <p className="text-gray-600 mb-6">
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

export default DashboardPage;
