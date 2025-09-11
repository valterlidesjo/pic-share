import { db } from "@/firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export const addLatestRead = async (
  messageId: string | null | undefined,
  userId: string
) => {
  if (!messageId || !userId) {
    console.error(
      "No messageId or userId provided, could not add latestConversationRead"
    );
    return;
  }

  const conversationDocRef = doc(db, "conversations", messageId);
  await updateDoc(conversationDocRef, {
    [`readBy.${userId}`]: serverTimestamp(),
  });
};
