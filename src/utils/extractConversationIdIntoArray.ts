import { Conversation } from "@/hooks/messages/useGetConversation";

export const extractConversationIdIntoArray = (
  conversations: Conversation[]
) => {
  const conversationIdList: string[] = [];
  conversations.map((conversation) => {
    conversationIdList.push(conversation.id);
  });
  return conversationIdList;
};
