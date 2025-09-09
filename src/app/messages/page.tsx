"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useGetFollowedUsers, {
  FollowedUsers,
} from "@/hooks/followers/useGetFollowedUsers";
import { CircularProgress } from "@mui/material";
import MessageItem from "./components/MessageItem";
import NewConversationDialog from "./components/NewConversationDialog";
import { useGetAllConversations } from "@/hooks/messages/useGetAllConversations";
import StartedMessageItem from "./components/StartedMessageItem";
import { filterAndSortConversation } from "@/utils/filterAndSortConversations";
import { useEffect, useState } from "react";
import { Conversation } from "@/hooks/messages/useGetConversation";
import { getFollowedUsersWithoutConversation } from "@/utils/getFollowedUsersWithoutConversation";

const Messages = () => {
  const [conversationsWithMessages, setConversationsWithMessages] = useState<
    Conversation[]
  >([]);
  const [followedUsersToDisplay, setFollowedUsersToDisplay] = useState<
    FollowedUsers[] | null
  >([]);
  const { user, loading } = useAuthGuard();
  const { followedUsers, loading: followedUserLoading } = useGetFollowedUsers(
    user?.uid
  );
  console.log(followedUsers);
  const { conversations, loading: conversationsLoading } =
    useGetAllConversations(user?.uid);

  useEffect(() => {
    const processConversations = async () => {
      if (conversations) {
        const sortedConversations = await filterAndSortConversation(
          conversations
        );
        setConversationsWithMessages(sortedConversations);
      }
    };
    processConversations();
  }, [conversations]);

  useEffect(() => {
    if (conversationsWithMessages && conversationsWithMessages.length > 0) {
      const sortedFollowedUsers = getFollowedUsersWithoutConversation({
        followedUsers,
        conversationsWithMessages,
      });
      setFollowedUsersToDisplay(sortedFollowedUsers);
    } else {
      setFollowedUsersToDisplay(followedUsers);
    }
  }, [conversationsWithMessages, followedUsers]);

  if (loading || followedUserLoading || conversationsLoading)
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex justify-between items-center px-8 pt-4 mt-[60px] sm:max-w-[512px]">
          <h1 className="text-[#1976D2] font-bold text-2xl">Messages</h1>
          <NewConversationDialog userId={user?.uid} />
        </div>
        <CircularProgress />
      </div>
    );
  if (conversationsWithMessages.length === 0)
    return (
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex justify-between items-center px-8 pt-4 mt-[60px] sm:max-w-[512px]">
          <h1 className="text-[#1976D2] font-bold text-2xl">Messages</h1>
          <NewConversationDialog userId={user?.uid} />
        </div>
        <p className="w-full px-8">You have no conversations yet</p>
        <div className="w-full justify-start items-center px-8 py-4 sm:max-w-[512px]">
          <p className="text-[#1976D2] font-bold text-s">
            Start a new conversation with someone you follow
          </p>
        </div>
        <div className="w-full px-8 flex flex-col items-start justify-center sm:max-w-[512px]">
          {followedUsersToDisplay?.map((user) => (
            <MessageItem followedUser={user} key={user.id} />
          ))}
        </div>
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full pb-4">
        <div className="w-full flex justify-between items-center px-8 pt-4 mt-[60px] sm:max-w-[512px]">
          <h1 className="text-[#1976D2] font-bold text-2xl">Messages</h1>
          <NewConversationDialog userId={user?.uid} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full px-8 flex flex-col items-start justify-center sm:max-w-[512px]">
          {conversationsWithMessages?.map((conversation) => (
            <StartedMessageItem
              conversation={conversation}
              key={conversation.id}
            />
          ))}
        </div>
        <div className="w-full justify-start items-center px-8 py-4 sm:max-w-[512px]">
          <p className="text-[#1976D2] font-bold text-s">
            Start a new conversation with someone you follow
          </p>
        </div>
        <div className="w-full px-8 flex flex-col items-start justify-center sm:max-w-[512px]">
          {followedUsersToDisplay?.map((user) => (
            <MessageItem followedUser={user} key={user.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Messages;
