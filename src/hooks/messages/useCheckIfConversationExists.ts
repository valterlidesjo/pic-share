import { db } from "@/firebaseConfig";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirestoreMessages } from "./useGetMessages";

export const useCheckIfConversationExists = (
  userIdA: string,
  userIdB: string
) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userIdA || !userIdB || !db) {
      setLatestMessage(null);
      setConversationId(null);
      setLoading(false);
      return;
    }
    const sortedUserIds = [userIdA, userIdB].sort();
    const q = query(
      collection(db, "conversations"),
      where("userIds", "==", sortedUserIds),
      limit(1)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setConversationId(null);
        setLatestMessage(null);
        setLoading(false);
      } else {
        const conversationDoc = snapshot.docs[0];
        setConversationId(conversationDoc.id);
        const messagesRef = collection(
          db,
          "conversations",
          conversationDoc.id,
          "messages"
        );
        const latestMessageQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const unsubscribeMessages = onSnapshot(
          latestMessageQuery,
          (msgSnapshot) => {
            if (!msgSnapshot.empty) {
              const data = msgSnapshot.docs[0].data() as FirestoreMessages;
              setLatestMessage(data.message);
            } else {
              setLatestMessage(null);
            }
            setLoading(false);
          }
        );
        return () => unsubscribeMessages();
      }
    });
    return () => unsubscribe();
  }, [userIdA, userIdB]);
  if (!userIdA || !userIdB) {
    return { conversationId, latestMessage, loading };
  }
  return { conversationId, latestMessage, loading };
};
