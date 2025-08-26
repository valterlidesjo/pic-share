"use client";

import { useGetAlbums } from "@/hooks/albums/useGetAlbums";
import AlbumImageCard from "../profile/components/AlbumImageCard";
import { CircularProgress } from "@mui/material";

const Albums = () => {
  const { albums } = useGetAlbums();
  if (albums.length === 0)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <div className="flex flex-col justify-center items-center px-8 mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl">Albums</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
          {albums.map((album) => (
            <AlbumImageCard
              key={album.id}
              album={album}
              showUser={true}
              showEdit={false}
            />
          ))}{" "}
        </div>
      </div>
    </>
  );
};

export default Albums;
