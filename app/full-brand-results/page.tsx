"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Image as ImageIcon, FileText, Palette, Target, MessageSquare, CalendarDays, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const FullBrandResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [brandData, setBrandData] = useState<any>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setBrandData(parsedData);
        console.log("Full brand results data:", parsedData);
      } catch (error) {
        console.error("Error parsing brand data:", error);
        toast.error("Error loading brand results");
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleDownloadAsset = (assetType: string, assetUrl: string) => {
    // Simulate download
    toast.success(`${assetType} download started`);
    console.log(`Downloading ${assetType}:`, assetUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your complete brand kit...</p>
        </div>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No brand data found</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="absolute top-6 left-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Complete Brand Kit</h1>
            </div>
            
            <p className="text-lg text-gray-600 mb-2">
              Your brand is ready! Download all assets below.
            </p>
            <p className="text-sm text-gray-500">
              All files are high-resolution and ready for professional use
            </p>
          </div>

          {/* Success Message */}
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Payment Successful!</h3>
                  <p className="text-green-700">Your complete brand kit has been generated and is ready for download.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Logo Files */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Logo Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Primary Logo (AI)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Primary Logo AI", brandData.logos?.primary?.ai)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Primary Logo (SVG)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Primary Logo SVG", brandData.logos?.primary?.svg)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Primary Logo (PNG)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Primary Logo PNG", brandData.logos?.primary?.png)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Guidelines */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Brand Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Complete Guidelines (PDF)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Brand Guidelines PDF", brandData.guidelines?.pdf)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Color Palette</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Color Palette", brandData.guidelines?.colors)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Typography Guide</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Typography Guide", brandData.guidelines?.typography)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Templates */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-orange-600" />
                  Social Media Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Instagram Posts (50+ designs)</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Instagram Templates", brandData.socialMedia?.instagram)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Facebook Covers</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Facebook Covers", brandData.socialMedia?.facebook)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">LinkedIn Banners</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("LinkedIn Banners", brandData.socialMedia?.linkedin)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Business Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Standard Business Card</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Standard Business Card", brandData.businessCards?.standard)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Premium Business Card</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Premium Business Card", brandData.businessCards?.premium)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Print-Ready Files</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Print-Ready Files", brandData.businessCards?.printReady)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Website Mockups */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Website Mockups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Homepage Design</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Homepage Design", brandData.website?.homepage)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">About Page</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("About Page", brandData.website?.about)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Contact Page</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Contact Page", brandData.website?.contact)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Signatures */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Email Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">HTML Email Signature</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("HTML Email Signature", brandData.emailSignatures?.html)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Outlook Signature</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Outlook Signature", brandData.emailSignatures?.outlook)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gmail Signature</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset("Gmail Signature", brandData.emailSignatures?.gmail)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download All Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                toast.success("Starting download of all assets...");
                console.log("Downloading all assets:", brandData);
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Assets
            </Button>
          </div>

          {/* Support Info */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-3">
                You have lifetime access to these assets and priority support. 
                If you need any modifications or have questions, our team is here to help.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  Request Modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FullBrandResults; 