"use client";

import { useGetAlbums } from "@/hooks/useGetAlbums";
import AlbumImageCard from "../profile/components/AlbumImageCard";

const Albums = () => {
  const { albums } = useGetAlbums();
  if (albums.length === 0) return <div>Loading...</div>;
  return (
    <>
      <div className="flex flex-col justify-center items-center px-8">
        <h1 className="text-[#1976D2] font-bold text-2xl">Albums</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
          {albums.map((album) => (
            <AlbumImageCard
              key={album.id}
              title={album.title}
              albumId={album.id}
              imageId={album.images[0].imageId}
              createdAt={album.createdAt}
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
