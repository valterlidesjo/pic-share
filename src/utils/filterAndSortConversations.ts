import { db } from "@/firebaseConfig";
import { Conversation } from "@/hooks/messages/useGetConversation";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export const filterAndSortConversation = async (
  conversations: Conversation[]
): Promise<Conversation[]> => {
  const conversationsWithMessages: Conversation[] = [];
  for (const conversation of conversations) {
    const conversationRef = doc(db, "conversations", conversation.id);
    const messagesRef = collection(conversationRef, "messages");

    const messagesSnapshot = await getDocs(
      query(messagesRef, where("createdAt", "<=", Timestamp.now()))
    );

    if (!messagesSnapshot.empty) {
      conversationsWithMessages.push(conversation);
    }
  }
  conversationsWithMessages.sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return conversationsWithMessages;
};
