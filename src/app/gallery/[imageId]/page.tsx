"use client";
export const dynamic = "force-dynamic";
import React, { use, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { formatFileNameForDisplay } from "@/utils/formatFileName";
import { addCommentToImage } from "@/utils/addCommentToImage";
import useGetComments from "@/hooks/useGetComments";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { ImageComments } from "../components/ImageComments";
import { useGetImage } from "@/hooks/useGetImage";
import Image from "next/image";

interface ImagePageProps {
  params: Promise<{
    imageId: string;
  }>;
}

const ImagePage: React.FC<ImagePageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { imageId } = resolvedParams;
  const { comments } = useGetComments(imageId);
  const { user } = useAuthGuard();
  const { image, loading, error } = useGetImage(imageId);
  const [imageComment, setImageComment] = useState("");
  const router = useRouter();

  const userEmail: string = user?.email || "";

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading image...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Fel: {error}</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Ingen bild att visa.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center justify-center w-full pt-8">
          <h1 className="text-2xl font-bold mb-4">
            {formatFileNameForDisplay(image.fileName)}
          </h1>
          <div className="relative w-full aspect-video h-auto mb-4">
            <Image
              src={image.imageUrl}
              alt={image.fileName || ""}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          {image.email === "Unknown" ? (
            <p>{image.username === "Unknown" ? image.email : image.username}</p>
          ) : (
            <Button
              variant="outlined"
              onClick={() => handleUserClick(image.userId)}
            >
              {image.username === "Unknown" ? image.email : image.username}
            </Button>
          )}

          <p className="text-md text-gray-500 pt-2">
            Uploaded at: {image.uploadedAt.toLocaleDateString()}
          </p>
        </div>
        <ImageComments comments={comments} />

        <div className="flex flex-col gap-2 w-full pb-8">
          <TextField
            label={`Leave a comment on ${formatFileNameForDisplay(
              image.fileName
            )}`}
            value={imageComment}
            onChange={(e) => setImageComment(e.target.value)}
            sx={{
              width: "100%",
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addCommentToImage(imageId, image.userId, userEmail, imageComment);
              setImageComment("");
            }}
            sx={{
              width: "100%",
            }}
          >
            Comment
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImagePage;
