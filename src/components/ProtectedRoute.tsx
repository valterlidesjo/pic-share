"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.isAnonymous)) {
      if (window.location.pathname !== "sign-in") {
        router.push("/sign-in");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return null;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
