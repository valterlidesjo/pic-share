import { useGetImage } from "@/hooks/useGetImage";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

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
    </div>
  );
};

export default AlbumImageCard;
