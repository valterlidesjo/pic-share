import { db } from "@/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirestoreConversation } from "./useGetConversation";

export const useCheckIfLastMessageIsRead = (
  conversationId: string | undefined
) => {
  const [isConversationRead, setIsConversationRead] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!conversationId) {
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
      if (!data.updatedAt || !data.latestConversationRead) {
        setLoading(false);
        setIsConversationRead(true);
        return;
      }

      const updatedAtDate = data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : new Date();
      const latestConversationReadDate = data.latestConversationRead?.toDate
        ? data.latestConversationRead.toDate()
        : new Date();
      if (latestConversationReadDate > updatedAtDate) {
        setIsConversationRead(true);
      } else {
        setIsConversationRead(false);
      }
    });
    return () => unsubscribe();
  }, [conversationId]);
  return { isConversationRead, loading };
};
