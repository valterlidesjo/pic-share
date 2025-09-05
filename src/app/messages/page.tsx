"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useGetFollowedUsers from "@/hooks/followers/useGetFollowedUsers";
import { CircularProgress } from "@mui/material";
import MessageItem from "./components/MessageItem";

const Messages = () => {
  const { user, loading } = useAuthGuard();
  const { followedUsers, loading: followedUserLoading } = useGetFollowedUsers(
    user?.uid
  );

  if (loading || followedUserLoading)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center px-8 mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl">Messages</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full px-8 flex flex-col items-start justify-center sm:max-w-[512px]">
          {followedUsers?.map((user) => (
            <MessageItem followedUser={user} key={user.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Messages;
