"use client";
export const dynamic = "force-dynamic";
import { useGetPersonalImages } from "@/hooks/images/useGetOwnImages";
import useGetUser from "@/hooks/users/useGetUser";
import React, { use } from "react";
import Button from "@mui/material/Button";
import { followUser } from "@/utils/followUser";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useCheckIfUserFollow from "@/hooks/followers/useCheckIfUserFollow";
import { unfollowUser } from "@/utils/unfollowUser";
import { CircularProgress } from "@mui/material";
import { Images } from "@/app/gallery/components/Images";
import useCheckFollowerCount from "@/hooks/followers/useCheckFollowerCount";
import AlbumImageCard from "@/app/profile/components/AlbumImageCard";
import { useGetAlbums } from "@/hooks/albums/useGetAlbums";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserPage: React.FC<UserPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { userId } = resolvedParams;
  const { user, loading } = useGetUser(userId);
  const { user: personalUser } = useAuthGuard();
  const { images } = useGetPersonalImages(userId);
  const { isFollowing } = useCheckIfUserFollow(personalUser?.uid, userId);
  const { followerCount } = useCheckFollowerCount(userId);
  const { albums, loading: albumLoading } = useGetAlbums(userId, undefined);

  if (loading || albumLoading) {
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }
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

  if (images.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-[60px]">
        <p className="text-3xl font-bold max-w-[80%] truncate sm:max-w-5xl py-4">
          {user?.username === "Unknown" ? user?.email : user?.username}&apos;s
          page
        </p>
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex justify-start items-center">
            <Button variant="text" sx={{ fontSize: "1rem" }}>
              Followers:
            </Button>
            <p className="text-xl">{followerCount}</p>
          </div>
          <Button
            variant="outlined"
            onClick={handleFollowClick}
            sx={{ fontSize: "1rem" }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
        <p className="text-2xl font-bold">
          User has not uploaded any pictures yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center mt-[60px]">
        <p className="text-3xl font-bold max-w-[80%] break-words sm:max-w-5xl py-4">
          {user?.username === "Unknown" ? user?.email : user?.username}&apos;s
          page
        </p>
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex justify-start items-center">
            <Button variant="text" sx={{ fontSize: "1rem" }}>
              Followers:
            </Button>
            <p className="text-xl">{followerCount}</p>
          </div>
          <Button
            variant="outlined"
            onClick={handleFollowClick}
            sx={{ fontSize: "1rem" }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl px-8 cursor-pointer">
          {albums.map((album) => (
            <AlbumImageCard
              key={album.id}
              album={album}
              showUser={true}
              showEdit={false}
            />
          ))}{" "}
        </div>
        <Images showComments={true} showLikes={true} images={images} />
      </div>
    </>
  );
};

export default UserPage;
