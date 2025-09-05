import { db } from "@/firebaseConfig";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export const getExistingConversationId = async (
  userIdA: string,
  userIdB: string
) => {
  const sortedUserIds = [userIdA, userIdB].sort();

  const q = query(
    collection(db, "conversations"),
    where("userIds", "==", sortedUserIds),
    limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  }
  return null;
};
