import { useGetImage } from "@/hooks/images/useGetImage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import EditAlbumDialog from "./EditAlbumDialog";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { Album, useGetAlbums } from "@/hooks/albums/useGetAlbums";
import { extractAlbumIdIntoArray } from "@/utils/extractAlbumIdIntoArray";
import { CircularProgress } from "@mui/material";

const AlbumImageCard = ({
  showUser,
  showEdit,
  album,
}: {
  album: Album;
  showUser: boolean;
  showEdit: boolean;
}) => {
  const router = useRouter();
  const { user } = useAuthGuard();
  const { albums, loading: albumLoading } = useGetAlbums(undefined, album.id);
  const imageIdList = useMemo(() => extractAlbumIdIntoArray(albums), [albums]);

  if (!album.images || album.images.length === 0) {
    return (
      <div className="border p-2 rounded-lg shadow-md mb-8">
        <div
          className="relative w-full h-48 mb-2 bg-[#1976D2]"
          onClick={() => router.push(`/albums/${album.id}`)}
        ></div>

        <p className="text-base font-semibold truncate">{album.title}</p>
        <p className="text-xs text-gray-500 py-2">
          Uploaded: {album.createdAt.toLocaleDateString()}
        </p>
      </div>
    );
  }
  const { image, loading } = useGetImage(album.images[0].imageId);

  if (!image || loading || albumLoading) {
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="border p-2 rounded-lg shadow-md mb-8">
      <div
        className="relative w-full h-48 mb-2"
        onClick={() => router.push(`/albums/${album.id}`)}
      >
        <Image
          src={image.imageUrl}
          alt={image.fileName || "Galleri Bild"}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <p className="text-base font-semibold truncate">{album.title}</p>
      {showUser && (
        <p className="text-xs text-gray-500">
          <span className="text-black font-bold">Album</span> by:{" "}
          {image.username || image.email || "Ghost user"}
        </p>
      )}

      <p className="text-xs text-gray-500 py-2">
        Uploaded: {album.createdAt.toLocaleDateString()}
      </p>
      {showEdit && (
        <EditAlbumDialog
          albumId={album.id}
          user={user}
          initialImages={imageIdList}
        />
      )}
    </div>
  );
};

export default AlbumImageCard;
