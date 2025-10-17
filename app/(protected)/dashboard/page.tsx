"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to overview page
    router.replace('/dashboard/overview');
  }, [router]);

  return null; // This component just redirects
};
export default DashboardPage;
