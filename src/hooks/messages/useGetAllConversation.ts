import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Conversation, FirestoreConversation } from "./useGetConversation";

export const useGetAllConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId || !db) {
      setConversations([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "conversations"),
      where("userIds", "array-contains", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationList = snapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreConversation;
        const createdAtDate = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date();
        const updatedAtDate = data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date();
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const latestReadByUser = data.readBy
          ? Object.keys(data.readBy).reduce(
              (acc: Record<string, Date>, userId: string) => {
                acc[userId] = (data.readBy as Record<string, any>)[
                  userId
                ].toDate();
                return acc;
              },
              {}
            )
          : {};
        /* eslint-enable @typescript-eslint/no-explicit-any */
        return {
          id: doc.id,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
          readBy: latestReadByUser,
          userIds: data.userIds,
        };
      });
      setConversations(conversationList);
    });
    return () => unsubscribe();
  }, [userId]);
  return { conversations, loading };
};
