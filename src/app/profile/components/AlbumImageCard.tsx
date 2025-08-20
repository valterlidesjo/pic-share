import { useGetImage } from "@/hooks/useGetImage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import EditAlbumDialog from "./EditAlbumDialog";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useGetAlbums } from "@/hooks/useGetAlbums";
import { extractIdIntoArray } from "@/utils/extractIdIntoArray";

const AlbumImageCard = ({
  imageId,
  title,
  albumId,
  createdAt,
  showUser,
}: {
  imageId: string;
  title: string;
  albumId: string;
  showUser: boolean;
  createdAt: Date;
}) => {
  const { image } = useGetImage(imageId);
  const router = useRouter();
  const { user } = useAuthGuard();
  const { albums } = useGetAlbums(undefined, albumId);
  const imageIdList = useMemo(() => extractIdIntoArray(albums), [albums]);

  if (!image) {
    return <div>Could not find image.</div>;
  }
  return (
    <div className="border p-2 rounded-lg shadow-md mb-8">
      <div
        className="relative w-full h-48 mb-2"
        onClick={() => router.push(`/albums/${albumId}`)}
      >
        <Image
          src={image.imageUrl}
          alt={image.fileName || "Galleri Bild"}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <p className="text-base font-semibold truncate">{title}</p>
      {showUser && (
        <p className="text-xs text-gray-500">
          Album by: {image.username || image.email || "Ghost user"}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Uploaded: {createdAt.toLocaleDateString()}
      </p>
      <EditAlbumDialog
        albumId={albumId}
        user={user}
        initialImages={imageIdList}
      />
    </div>
  );
};

export default AlbumImageCard;
