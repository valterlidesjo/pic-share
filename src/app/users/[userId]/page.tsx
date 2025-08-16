"use client";
export const dynamic = "force-dynamic";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";
import useGetUser from "@/hooks/useGetUser";
import { formatFileNameForDisplay } from "@/utils/formatFileName";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import Button from "@mui/material/Button";
import { followUser } from "@/utils/followUser";
import useAuthGuard from "@/hooks/useAuthGuard";
import useCheckIfUserFollow from "@/hooks/useCheckIfUserFollow";
import { unfollowUser } from "@/utils/unfollowUser";
import Image from "next/image";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserPage: React.FC<UserPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { userId } = resolvedParams;
  const { user } = useGetUser(userId);
  const { user: personalUser } = useAuthGuard();
  const { images } = useGetPersonalImages(userId);
  const { isFollowing } = useCheckIfUserFollow(personalUser?.uid, userId);
  const router = useRouter();
  if (!personalUser) {
    return <h1>Could not find personal user</h1>;
  }

  const handleFollowClick = async () => {
    if (isFollowing) {
      await unfollowUser(personalUser.uid, userId);
      return;
    }
    await followUser(personalUser.uid, userId);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">
          {user?.username === "Unknown" ? user?.email : user?.username}&apos;s
          page
        </h1>
        <Button
          variant="outlined"
          onClick={handleFollowClick}
          sx={{ fontSize: "1rem" }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <h3 className="my-4 mx-8 text-2xl">
          Here you can see all their uploaded pictures
        </h3>
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl px-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="border p-2 rounded-lg shadow-md mb-8"
                onClick={() => router.push(`/gallery/${image.id}`)}
              >
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={image.imageUrl}
                    alt={image.fileName || "Galleri Bild"}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <p className="text-sm font-semibold truncate">
                  {formatFileNameForDisplay(image.fileName)}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded: {image.uploadedAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>This user have not yet uploaded to PicShare</p>
        )}
      </div>
    </>
  );
};

export default UserPage;
