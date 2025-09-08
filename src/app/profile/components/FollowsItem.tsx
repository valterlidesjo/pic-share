import useCheckIfUserFollow from "@/hooks/followers/useCheckIfUserFollow";
import { FollowedUsers } from "@/hooks/followers/useGetFollowedUsers";
import { followUser } from "@/utils/followUser";
import { unfollowUser } from "@/utils/unfollowUser";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const FollowsItem = ({ follow }: { follow: FollowedUsers }) => {
  const { isFollowing } = useCheckIfUserFollow(
    follow.followerId,
    follow.followedId
  );
  const router = useRouter();

  const handleFollowClick = async (followedUserId: string) => {
    if (isFollowing) {
      await unfollowUser(follow.followerId, followedUserId);
      return;
    }
    await followUser(follow.followerId, followedUserId);
  };
  return (
    <div key={follow.id} className="flex justify-between items-center mb-2">
      <div
        className="flex flex-col justify-center items-start cursor-pointer pr-2"
        onClick={() => router.push(`/users/${follow.followedId}`)}
      >
        {follow.followedUserUsername ? (
          <p className="font-bold">{follow.followedUserUsername}</p>
        ) : (
          <p className="font-bold text-xs">User has no username</p>
        )}
        <p className="text-xs">{follow.followedUserEmail}</p>
      </div>
      <Button
        variant="outlined"
        onClick={() => handleFollowClick(follow.followedId)}
        sx={{ fontSize: "1rem" }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowsItem;
