import { useGetAllImages } from "@/hooks/useGetAllImages";
import React from "react";
import { Images } from "./Images";

const GalleryContent = () => {
  const { images } = useGetAllImages();

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[#1976D2] font-bold text-2xl">Gallery</h1>
        <div className="px-8 w-full text-2xl pb-8">
          <p className="mb-2">
            Welcome to the Gallery! This is the place to explore and find new
            pictures, users and comment!
          </p>
          <p>
            Click on a Picture that looks interesting to see more and comment
          </p>
        </div>

        <Images images={images} showComments={true} showLikes={true} />
      </div>
    </>
  );
};

export default GalleryContent;
