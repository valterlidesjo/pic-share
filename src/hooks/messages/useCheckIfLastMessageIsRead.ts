import { db } from "@/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirestoreConversation } from "./useGetConversation";

export const useCheckIfLastMessageIsRead = (
  conversationId: string | undefined,
  userId: string | undefined
) => {
  const [isConversationRead, setIsConversationRead] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      setIsConversationRead(true);
      return;
    }
    const convDocRef = doc(db, "conversations", conversationId);
    const unsubscribe = onSnapshot(convDocRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLoading(false);
        setIsConversationRead(true);
        return;
      }
      const data = snapshot.data() as FirestoreConversation;
      if (!data.updatedAt || !data.readBy) {
        setLoading(false);
        setIsConversationRead(true);
        return;
      }

      const updatedAtDate = data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : new Date();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const latestReadByUser = data.readBy
        ? Object.keys(data.readBy).reduce(
            (acc: Record<string, Date>, userId: string) => {
              const timestamp = (data.readBy as Record<string, any>)[userId];
              if (timestamp) {
                acc[userId] = timestamp.toDate();
              }
              return acc;
            },
            {}
          )
        : {};
      /* eslint-enable @typescript-eslint/no-explicit-any */
      const currentUserLastReadTime = latestReadByUser[userId];

      if (currentUserLastReadTime && updatedAtDate) {
        if (currentUserLastReadTime > updatedAtDate) {
          setIsConversationRead(true);
          setLoading(false);
        } else {
          setIsConversationRead(false);
          setLoading(false);
        }
      } else {
        setIsConversationRead(true);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [conversationId]);
  return { isConversationRead, loading };
};
