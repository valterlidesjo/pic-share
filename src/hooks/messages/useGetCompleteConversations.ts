import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Conversation, FirestoreConversation } from "./useGetConversation";

export const useGetCompleteConversations = (userId: string | undefined) => {
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
      const run = async () => {
        const conversationPromises = snapshot.docs.map(async (doc) => {
          const data = doc.data() as FirestoreConversation;
          const filteredUserIds = data.userIds.filter((id) => id != userId);
          const secondUserId = filteredUserIds[0];
          if (secondUserId) {
            const followRef = collection(db, "followers");
            const followBackQuery = query(
              followRef,
              where("followerId", "==", userId),
              where("followedId", "==", secondUserId)
            );
            const followBackSnapshot = await getDocs(followBackQuery);
            if (followBackSnapshot.empty) {
              return null;
            }
          }
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
        const results = await Promise.all(conversationPromises);
        const filtered = results.filter((c) => c !== null);
        setConversations(filtered);
        setLoading(false);
      };
      run().catch(() => {
        setConversations([]);
        setLoading(false);
      });
    });
    return () => unsubscribe();
  }, [userId]);
  return { conversations, loading };
};
