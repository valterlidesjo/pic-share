import { FollowedUsers } from "@/hooks/followers/useGetFollowedUsers";
import { useCheckIfConversationExists } from "@/hooks/messages/useCheckIfConversationExists";
import { createConversation } from "@/utils/createConversation";
import { getExistingConversationId } from "@/utils/getExistingConversationId";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

const MessageItem = ({ followedUser }: { followedUser: FollowedUsers }) => {
  const { latestMessage } = useCheckIfConversationExists(
    followedUser.followerId,
    followedUser.followedId
  );
  const router = useRouter();

  const handleMessageClick = async (userId: string, secondUserId: string) => {
    let conversationId: string | null | undefined =
      await getExistingConversationId(userId, secondUserId);
    if (!conversationId) {
      conversationId = await createConversation(userId, secondUserId);
    }
    router.push(`/messages/${conversationId}`);
  };

  return (
    <div
      key={followedUser.id}
      className="flex justify-start items-center border-b-[1px] border-gray-500 w-full mb-1"
      onClick={() =>
        handleMessageClick(followedUser.followerId, followedUser.followedId)
      }
    >
      <AccountCircleIcon
        sx={{
          fontSize: "2rem",
          marginRight: "0.5rem",
          color: "#1976D2",
        }}
      />
      <div className="flex flex-col items-start justify-center w-full mb-1 gap-1">
        <div className="flex justify-between items-center w-full">
          <p className="text-xs">
            {followedUser.followedUserUsername
              ? followedUser.followedUserUsername
              : followedUser.followedUserEmail}
          </p>
          <p className="text-[8px] text-gray-500">69 aug.</p>
        </div>
        <p className="text-xs text-gray-500">
          {latestMessage ? latestMessage : "No conversation yet"}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
