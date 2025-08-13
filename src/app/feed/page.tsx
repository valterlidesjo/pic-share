"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import useGetFollowedUsers from "@/hooks/useGetFollowedUsers";
import React, { useMemo } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { Images } from "../gallery/components/Images";
import useGetFollowedUsersImages from "@/hooks/useGetFollowedUsersImages";

const Feed = () => {
  const { user } = useAuthGuard();
  const router = useRouter();
  const { followedUsers } = useGetFollowedUsers(user?.uid);
  const followedIds = useMemo(() => {
    return followedUsers ? followedUsers.map((user) => user.followedId) : [];
  }, [followedUsers]);
  const { followedUsersImages } = useGetFollowedUsersImages(followedIds);

  if (!followedUsers) {
    return (
      <div>
        <p>
          You have no feed since you have not followed anyone yet. <br /> Check
          out{" "}
          <Button variant="outlined" onClick={() => router.push("/users")}>
            Users
          </Button>{" "}
          to see our verified users and begin to follow some!
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center px-8">
        <h1 className="text-[#1976D2] font-bold text-2xl">Feed</h1>
        <p className="w-full text-2xl pb-8">
          Welcome to the Feed! This is the place to see all the pictures
          uploaded from people you follow!
        </p>
      </div>
      <Images images={followedUsersImages} showComments={true} />
      <div className="w-full flex flex-col justify-center items-center p-8 text-2xl">
        <p className="mb-4">
          Head over to users if you want to find more people to follow!
        </p>
        <Button
          variant="outlined"
          onClick={() => router.push("/users")}
          sx={{
            color: "#E38724",
            fontSize: "1.5rem",
          }}
        >
          Users
        </Button>{" "}
      </div>
    </>
  );
};

export default Feed;
