"use client";
export const dynamic = "force-dynamic";
import React, { use, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { formatFileNameForDisplay } from "@/utils/formatFileName";
import { addCommentToImage } from "@/utils/addCommentToImage";
import useGetComments from "@/hooks/comments/useGetComments";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { useRouter } from "next/navigation";
import { ImageComments } from "../components/ImageComments";
import { useGetImage } from "@/hooks/images/useGetImage";
import Image from "next/image";
import { likeImage } from "@/utils/likeImage";
import useCheckIfImageIsLiked from "@/hooks/likes/useCheckIfImageIsLiked";
import { removeLike } from "@/utils/removeLike";
import useCheckLikeCount from "@/hooks/likes/useCheckLikeCount";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { CircularProgress } from "@mui/material";

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
  const { isLiked } = useCheckIfImageIsLiked(user?.uid, imageId);
  const { likeCount } = useCheckLikeCount(imageId);
  const { image, loading, error } = useGetImage(imageId);
  const [imageComment, setImageComment] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();

  const userEmail: string = user?.email || "";

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleLikeClick = async () => {
    if (isLiked) {
      await removeLike(user?.uid, imageId);
      return;
    }
    await likeImage(user?.uid, imageId);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 mt-[60px]">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex justify-center items-center h-screen mt-[60px]">
        <p>No image to show.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center px-8 mt-[60px]">
        <div className="flex flex-col items-center justify-center w-full pt-8">
          <p className="text-2xl font-bold mb-4 break-words max-w-[80%]">
            {formatFileNameForDisplay(image.fileName)}
          </p>
          <div className="w-full h-auto flex justify-end items-center max-w-5xl cursor-pointer">
            <FullscreenIcon onClick={() => setIsFullscreen(true)} />
          </div>
          <div className="relative w-full aspect-video h-auto mb-4 sm:max-h-[70vh]">
            <Image
              src={image.imageUrl}
              alt={image.fileName || ""}
              fill
              className="object-contain rounded-lg"
            />
          </div>

          <div className="flex gap-4 justify-center items-center">
            <Button
              variant="outlined"
              onClick={() => handleUserClick(image.userId)}
            >
              {image.username ? image.username : image.email}
            </Button>
            <div onClick={handleLikeClick}>
              {isLiked ? (
                <FavoriteIcon sx={{ color: "red", fontSize: "2rem" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: "2rem" }} />
              )}
            </div>
          </div>
          <p className="text-md text-gray-500 pt-2">Likes: {likeCount}</p>

          <p className="text-md pt-2">
            {capitalizeFirstLetter(image.category)}
          </p>
          <p className="text-md text-gray-500 pt-2">
            Uploaded at: {image.uploadedAt.toLocaleDateString()}
          </p>
        </div>
        <ImageComments comments={comments} imageId={imageId} />

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
              addCommentToImage(
                imageId,
                image.userId,
                user?.uid,
                userEmail,
                imageComment
              );
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
      {isFullscreen && (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
          <div className="relative w-full h-full">
            <Image
              src={image.imageUrl}
              alt={image.fileName || ""}
              fill
              className="object-contain"
            />
            <div className="absolute top-24 right-8 cursor-pointer">
              <FullscreenExitIcon onClick={() => setIsFullscreen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePage;
