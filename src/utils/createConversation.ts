import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const createConversation = async (
  userId: string,
  secondUserId: string
) => {
  if (!userId || !secondUserId || !db) {
    console.error(
      "Could not create conversation, no userId, secondUserId or db connection."
    );
    return;
  }
  const sortedUserIds = [userId, secondUserId].sort();

  try {
    const conversationCollectionRef = collection(db, "conversations");

    const result = await addDoc(conversationCollectionRef, {
      userIds: sortedUserIds,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return result.id;
  } catch (error) {
    console.error("Error with creating conversation", error);
    return null;
  }
};
