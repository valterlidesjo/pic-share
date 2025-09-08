import { FollowedUsers } from "@/hooks/followers/useGetFollowedUsers";
import { Conversation } from "@/hooks/messages/useGetConversation";

export const getFollowedUsersWithoutConversation = ({
  followedUsers,
  conversationsWithMessages,
}: {
  followedUsers: FollowedUsers[] | null;
  conversationsWithMessages: Conversation[];
}): FollowedUsers[] => {
  if (!followedUsers || !conversationsWithMessages) {
    return [];
  }
  const conversationUserIds = new Set<string>();
  conversationsWithMessages.forEach((conv) => {
    conv.userIds.forEach((userId) => {
      conversationUserIds.add(userId);
    });
  });
  const usersWithoutConversation = followedUsers.filter((user) => {
    return !conversationUserIds.has(user.followedId);
  });
  return usersWithoutConversation;
};
