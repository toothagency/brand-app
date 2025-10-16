"use client";

import React, { useState } from "react";
import { useClientAuth } from "../../../(auth)/hooks/useClientAuth";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import {
  Users,
  Copy,
  Share2,
  Gift,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Target,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ReferralsPage = () => {
  const { user } = useClientAuth();
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock data - replace with actual API calls
  const referralStats = {
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 2400, // XAF
    thisMonth: 3,
    lastMonth: 5,
  };

  const referralHistory = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "completed",
      date: "2024-01-15",
      reward: 300,
      brandCreated: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "pending",
      date: "2024-01-20",
      reward: 0,
      brandCreated: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "completed",
      date: "2024-01-18",
      reward: 300,
      brandCreated: true,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "completed",
      date: "2024-01-12",
      reward: 300,
      brandCreated: true,
    },
  ];

  const referralCode = user?.referral_code || user?.username?.toUpperCase() || 'USER';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`;

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast.error('Failed to copy referral code');
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied!');
    } catch (error) {
      toast.error('Failed to copy referral link');
    }
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on BrandHub',
        text: 'Create amazing brands with AI-powered tools!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Referrals"
      subtitle="Invite friends and earn rewards for every successful referral"
    >
      <div className="space-y-8">
        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Referrals
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {referralStats.totalReferrals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Successful
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {referralStats.successfulReferrals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {referralStats.pendingReferrals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-[#3467AA]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {referralStats.totalEarnings.toLocaleString()} XAF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code & Link */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#3467AA]" />
              Your Referral Code
            </CardTitle>
              <CardDescription>
                Share this code with friends to earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-lg font-semibold">
                  {referralCode}
                </code>
                <Button
                  variant="outline"
                  onClick={copyReferralCode}
                  className={copiedCode ? "bg-green-50 border-green-200 text-green-700" : ""}
                >
                  {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Earn 300 XAF for each friend who creates their first brand using your code!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#3467AA]" />
              Share Referral Link
            </CardTitle>
              <CardDescription>
                Direct link to share with friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                />
                <Button variant="outline" onClick={copyReferralLink}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={shareReferral}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share this link on social media, email, or messaging apps
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#3467AA]" />
              How Referrals Work
            </CardTitle>
            <CardDescription>
              Simple steps to earn rewards by referring friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <UserPlus className="w-8 h-8 text-[#3467AA] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">1. Share Your Code</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share your referral code or link with friends, family, or on social media
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-[#3467AA] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2. Friend Signs Up</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your friend registers using your referral code and creates their first brand
                </p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-[#3467AA] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3. Earn Rewards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You earn 300 XAF for each successful referral when they create their first brand
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3467AA]" />
              Referral History
            </CardTitle>
            <CardDescription>
              Track your referrals and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No referrals yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Start sharing your referral code to earn rewards!
                  </p>
                </div>
              ) : (
                referralHistory.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {referral.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {referral.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {referral.email}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(referral.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {referral.reward > 0 ? `${referral.reward} XAF` : 'Pending'}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(referral.status)}
                          {referral.brandCreated && (
                            <Star className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Referral Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3467AA]" />
              Tips for More Referrals
            </CardTitle>
            <CardDescription>
              Maximize your referral success with these strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Social Media</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Share on Facebook, Twitter, LinkedIn, and Instagram
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Create posts about your brand creation experience
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Use relevant hashtags like #BrandCreation #AI
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Personal Network</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Reach out to entrepreneurs and business owners
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Share with colleagues and professional contacts
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Email your referral link to friends and family
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReferralsPage;
