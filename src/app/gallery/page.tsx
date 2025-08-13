"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import React from "react";
import GuestGalleryContent from "./components/GuestGalleryContent";
import GalleryContent from "./components/GalleryContent";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";

const Gallery = () => {
  const { user } = useAuthGuard();
  const { images } = useGetPersonalImages(user?.uid);
  if (!user) {
    return <div>Could not find user</div>;
  }
  if (user?.isAnonymous) {
    return <GuestGalleryContent ownImages={images} />;
  }
  if (!user) {
    return <div>Loading...</div>;
  }
  return <GalleryContent user={user} />;
};

export default Gallery;
