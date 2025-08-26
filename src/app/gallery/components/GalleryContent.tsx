import { useGetAllImages } from "@/hooks/images/useGetAllImages";
import React, { useState } from "react";
import { Images } from "./Images";
import CategorySelect from "@/components/ui/CategorySelect";
import useGetCategorizedImages from "@/hooks/images/useGetCategorizedImages";

const GalleryContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { images } = useGetAllImages();
  const { categorizedImages } = useGetCategorizedImages(selectedCategory);

  const imagesToShow =
    !selectedCategory || selectedCategory === "all"
      ? images
      : categorizedImages;

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl">Gallery</h1>
        <div className="flex w-full justify-start items-center px-8 max-w-5xl">
          <div className="w-[15rem]">
            <CategorySelect
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>
        <Images images={imagesToShow} showComments={true} showLikes={true} />
      </div>
    </>
  );
};

export default GalleryContent;
