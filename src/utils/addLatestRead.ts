import { db } from "@/firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export const addLatestRead = async (messageId: string | null | undefined) => {
  if (!messageId) {
    console.error(
      "No messageId provided, could not add latestConversationRead"
    );
    return;
  }
  const conversationDocRef = doc(db, "conversations", messageId);
  await updateDoc(conversationDocRef, {
    latestConversationRead: serverTimestamp(),
  });
};
