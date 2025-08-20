"use client";
export const dynamic = "force-dynamic";
import { useGetAlbums } from "@/hooks/useGetAlbums";
import { useGetImagesByIds } from "@/hooks/useGetImageByIds";
import { extractIdIntoArray } from "@/utils/extractIdIntoArray";
import React, { use, useMemo } from "react";
import { Images } from "../../gallery/components/Images";

interface AlbumPageProps {
  params: Promise<{
    albumId: string;
  }>;
}

const AlbumPage: React.FC<AlbumPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { albumId } = resolvedParams;
  const { albums } = useGetAlbums(undefined, albumId);
  const imageIdList = useMemo(() => extractIdIntoArray(albums), [albums]);
  const { images: albumImages } = useGetImagesByIds(imageIdList);
  if (albums.length === 0) return <div>Loading...</div>;
  const album = albums[0];

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[#1976D2] font-bold text-2xl">
          Album {album.title}
        </h1>
        <Images showComments={true} showLikes={true} images={albumImages} />
      </div>
    </>
  );
};

export default AlbumPage;
