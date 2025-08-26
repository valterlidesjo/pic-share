"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import React from "react";
import GalleryContent from "./components/GalleryContent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CircularProgress } from "@mui/material";

const Gallery = () => {
  const { user, loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center pt-8 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return <div>Could not find user</div>;
  }

  return <GalleryContent />;
};

const GalleryPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Gallery />
    </ProtectedRoute>
  );
};

export default GalleryPage;
