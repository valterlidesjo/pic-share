"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import React from "react";
import GuestGalleryContent from "./components/GuestGalleryContent";
import GalleryContent from "./components/GalleryContent";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";
import { useGhostGuard } from "@/hooks/useGhostGuard";

const Gallery = () => {
  useGhostGuard();
  const { user, loading } = useAuthGuard();
  const { images } = useGetPersonalImages(user?.uid);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Could not find user</div>;
  }
  if (user?.isAnonymous) {
    return <GuestGalleryContent ownImages={images} />;
  }
  return <GalleryContent />;
};

export default Gallery;
