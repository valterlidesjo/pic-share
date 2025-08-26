"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { CircularProgress } from "@mui/material";
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
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }
  if (!user) {
    return <div>Could not find user</div>;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
