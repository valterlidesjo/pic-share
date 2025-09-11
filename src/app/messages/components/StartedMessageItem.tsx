import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { useCheckIfConversationExists } from "@/hooks/messages/useCheckIfConversationExists";
import { useCheckIfLastMessageIsRead } from "@/hooks/messages/useCheckIfLastMessageIsRead";
import { Conversation } from "@/hooks/messages/useGetConversation";
import useGetUser from "@/hooks/users/useGetUser";
import { addLatestRead } from "@/utils/addLatestRead";
import { createConversation } from "@/utils/createConversation";
import { formatDateRelative } from "@/utils/formatDateRelative";
import { getExistingConversationId } from "@/utils/getExistingConversationId";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";

const StartedMessageItem = ({
  conversation,
  userId,
}: {
  conversation: Conversation;
  userId: string | undefined;
}) => {
  const { latestMessage, latestMessageDate } = useCheckIfConversationExists(
    conversation.userIds[0],
    conversation.userIds[1]
  );
  const router = useRouter();
  const messageDate = formatDateRelative(latestMessageDate);
  const secondUserId = conversation.userIds.find((id) => id !== userId);
  const { user: otherUser } = useGetUser(secondUserId);

  const { isConversationRead, loading: lastMessageLoading } =
    useCheckIfLastMessageIsRead(conversation.id, userId);

  const handleMessageClick = async (
    userId: string | null | undefined,
    secondUserId: string | undefined
  ) => {
    if (!userId || !secondUserId) {
      console.error(
        "Could not start conversation, no userId or secondUserId provided"
      );
      return;
    }
    if (userId === secondUserId) {
      console.error("User IDs are identical, aborting");
      return;
    }
    let conversationId: string | null | undefined =
      await getExistingConversationId(userId, secondUserId);
    if (!conversationId) {
      conversationId = await createConversation(userId, secondUserId);
    }
    await addLatestRead(conversationId, userId);
    router.push(`/messages/${conversationId}`);
  };

  if (lastMessageLoading || !userId)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );

  return (
    <div
      key={conversation.id}
      className="flex justify-start items-center border-b-[1px] border-gray-500 w-full mb-1 cursor-pointer"
      onClick={() => handleMessageClick(userId, secondUserId)}
    >
      <AccountCircleIcon
        sx={{
          fontSize: "2rem",
          marginRight: "0.5rem",
          color: "#1976D2",
        }}
      />
      <div className="flex flex-col items-start justify-center w-full mb-1 gap-1 max-w-[85%]">
        <div className="flex justify-between items-center w-full">
          <p
            className={`text-xs ${
              isConversationRead === false ? "font-extrabold text-black" : ""
            }`}
          >
            {otherUser?.username ? otherUser.username : otherUser?.email}
          </p>
          <p
            className={`text-[8px] text-gray-500 ${
              isConversationRead === false ? "font-extrabold text-black" : ""
            }`}
          >
            {messageDate}
          </p>
        </div>
        {isConversationRead ? (
          <p className="text-xs text-gray-500 line-clamp-1 max-w-[85%] overflow-hidden break-words">
            {latestMessage ? latestMessage : "No conversation yet"}
          </p>
        ) : (
          <div className="flex justify-between items-center w-full ">
            <p className="text-xs line-clamp-1 max-w-[85%] overflow-hidden break-words font-extrabold text-black">
              {latestMessage ? latestMessage : "No conversation yet"}
            </p>
            <NotificationsIcon sx={{ color: "blue", fontSize: "1.5rem" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StartedMessageItem;
