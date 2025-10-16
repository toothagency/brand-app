"use client";

import React from "react";
import { useUserBrands } from "../../../hooks/hooks";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Palette,
  Download,
  Eye,
  Users,
  Target,
  Clock,
  Award,
} from "lucide-react";

const AnalyticsPage = () => {
  const { data: userBrandsData, isLoading } = useUserBrands();

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-4 text-[#3467AA]" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading analytics...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const brands = userBrandsData?.brands || [];
  const paidBrands = brands.filter(brand => brand.payment_status);
  const freeBrands = brands.filter(brand => !brand.payment_status);

  // Calculate analytics
  const totalBrands = brands.length;
  const premiumBrands = paidBrands.length;
  const freeBrandsCount = freeBrands.length;
  const premiumRate = totalBrands > 0 ? (premiumBrands / totalBrands) * 100 : 0;

  // Monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthBrands = brands.filter(brand => {
    const brandDate = new Date(brand.id);
    return brandDate.getMonth() === currentMonth && brandDate.getFullYear() === currentYear;
  });

  // Last month stats
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthBrands = brands.filter(brand => {
    const brandDate = new Date(brand.id);
    return brandDate.getMonth() === lastMonth && brandDate.getFullYear() === lastMonthYear;
  });

  const monthlyGrowth = lastMonthBrands.length > 0 
    ? ((thisMonthBrands.length - lastMonthBrands.length) / lastMonthBrands.length) * 100 
    : 0;

  // Weekly stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekBrands = brands.filter(brand => new Date(brand.id) >= oneWeekAgo);

  // Recent activity
  const recentBrands = brands
    .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Track your brand creation performance and insights"
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Palette className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalBrands}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Premium Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {premiumBrands}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Premium Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {premiumRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {thisMonthBrands.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3467AA]" />
              Monthly Growth
            </CardTitle>
              <CardDescription>
                Brand creation growth compared to last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    This Month
                  </span>
                  <span className="font-semibold">{thisMonthBrands.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Last Month
                  </span>
                  <span className="font-semibold">{lastMonthBrands.length}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Growth</span>
                  <div className="flex items-center gap-1">
                    {monthlyGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {Math.abs(monthlyGrowth).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3467AA]" />
              Recent Activity
            </CardTitle>
              <CardDescription>
                Your latest brand creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBrands.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  recentBrands.map((brand, index) => (
                    <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {brand.logo && (
                          <img
                            src={brand.logo}
                            alt="Brand Logo"
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {brand.name || "Untitled Brand"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(brand.id).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {brand.payment_status ? (
                          <Star className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#3467AA]" />
              Brand Distribution
            </CardTitle>
              <CardDescription>
                Breakdown of your brand types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Premium Brands
                    </span>
                  </div>
                  <span className="font-semibold">{premiumBrands}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${totalBrands > 0 ? (premiumBrands / totalBrands) * 100 : 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Free Brands
                    </span>
                  </div>
                  <span className="font-semibold">{freeBrandsCount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${totalBrands > 0 ? (freeBrandsCount / totalBrands) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#3467AA]" />
              Achievements
            </CardTitle>
              <CardDescription>
                Your brand creation milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  totalBrands >= 1 ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    totalBrands >= 1 ? "bg-green-500" : "bg-gray-300"
                  }`}>
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">First Brand</p>
                    <p className="text-xs text-gray-500">Create your first brand</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  totalBrands >= 5 ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    totalBrands >= 5 ? "bg-green-500" : "bg-gray-300"
                  }`}>
                    <span className="text-white text-sm font-bold">5</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Brand Builder</p>
                    <p className="text-xs text-gray-500">Create 5 brands</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  premiumBrands >= 1 ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    premiumBrands >= 1 ? "bg-yellow-500" : "bg-gray-300"
                  }`}>
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium Creator</p>
                    <p className="text-xs text-gray-500">Create a premium brand</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
