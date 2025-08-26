"use client";
export const dynamic = "force-dynamic";
import { useGetAlbums } from "@/hooks/albums/useGetAlbums";
import { useGetImagesByIds } from "@/hooks/images/useGetImageByIds";
import { extractAlbumIdIntoArray } from "@/utils/extractAlbumIdIntoArray";
import React, { use, useMemo } from "react";
import { Images } from "../../gallery/components/Images";
import { CircularProgress } from "@mui/material";

interface AlbumPageProps {
  params: Promise<{
    albumId: string;
  }>;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { albumId } = resolvedParams;
  const { albums } = useGetAlbums(undefined, albumId);
  const imageIdList = useMemo(() => extractAlbumIdIntoArray(albums), [albums]);
  const { images: albumImages } = useGetImagesByIds(imageIdList);
  if (albums.length === 0)
    return (
      <div className="w-full flex justify-center items-center pt-8 mt-[60px]">
        <CircularProgress />
      </div>
    );
  const album = albums[0];

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl break-words max-w-[80%]">
          Album {album.title}
        </h1>
        <Images showComments={true} showLikes={true} images={albumImages} />
      </div>
    </>
  );
};

export default AlbumPage;
