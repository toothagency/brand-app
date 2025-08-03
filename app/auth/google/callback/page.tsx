"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "@/app/configs/axiosConfigs";
import ErrorBoundary from "@/app/components/ErrorBoundary";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing your authentication...");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage("Authentication was cancelled or failed");
          toast.error("Google authentication failed");
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage("No authorization code received");
          toast.error("Authentication failed - no authorization code");
          return;
        }

        // Call the backend callback endpoint
        const response = await axios.get(
          `/auth/google/callback?code=${code}&state=${state || ""}`
        );
        const data = response.data;

        if (data.success && data.user) {
          // Store user data
          const userData = {
            userId: data.user.userId,
            username: data.user.username,
            email: data.user.email,
            profile_picture: data.user.profile_picture,
            auth_provider: data.user.auth_provider,
          };

          // Store in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));

          setStatus("success");
          setMessage(data.message || "Authentication successful!");
          toast.success(data.message || "Successfully signed in with Google");

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/form");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Authentication failed");
          toast.error(data.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        setMessage("An error occurred during authentication");
        toast.error("Authentication failed");
      }
    };

    // Wrap in try-catch to handle any synchronous errors
    try {
      handleCallback();
    } catch (error) {
      console.error("Error in useEffect:", error);
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  }, [searchParams, router]);

  // Don't render anything until component is mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {status === "loading" && (
                <>
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <h2 className="text-xl font-semibold mb-2">
                    Processing Authentication
                  </h2>
                  <p className="text-gray-600">{message}</p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h2 className="text-xl font-semibold mb-2 text-green-800">
                    Success!
                  </h2>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <p className="text-sm text-gray-500">
                    Redirecting you to the form...
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h2 className="text-xl font-semibold mb-2 text-red-800">
                    Authentication Failed
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push("/login")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="w-full"
                    >
                      Go Home
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default GoogleCallbackPage;
