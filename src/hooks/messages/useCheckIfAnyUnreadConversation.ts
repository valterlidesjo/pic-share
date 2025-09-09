import { db } from "@/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirestoreConversation } from "./useGetConversation";

export const useCheckIfAnyUnreadConversation = (conversationIds: string[]) => {
  const [isAnyConversationUnread, setIsAnyConversationUnread] =
    useState<boolean>(false);
  const [conversationsUnread, setConversationsUnread] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!conversationIds || conversationIds.length === 0) {
      setLoading(false);
      setIsAnyConversationUnread(false);
      setConversationsUnread([]);
      return;
    }
    const unsubscribers: (() => void)[] = [];
    const localUnreadIds: string[] = [];
    let processedCount = 0;
    conversationIds.forEach((conversationId) => {
      const convDocRef = doc(db, "conversations", conversationId);

      const unsubscribe = onSnapshot(convDocRef, (snapshot) => {
        processedCount++;
        if (snapshot.exists()) {
          const data = snapshot.data() as FirestoreConversation;
          const updatedAtDate = data.updatedAt?.toDate();
          const latestConversationReadDate =
            data.latestConversationRead?.toDate();
          const isUnread =
            updatedAtDate &&
            latestConversationReadDate &&
            latestConversationReadDate < updatedAtDate;
          const index = localUnreadIds.indexOf(conversationId);

          if (isUnread && index === -1) {
            localUnreadIds.push(conversationId);
          } else if (!isUnread && index !== -1) {
            localUnreadIds.splice(index, 1);
          }
        }
        if (processedCount === conversationIds.length) {
          const changed =
            conversationsUnread.length !== localUnreadIds.length ||
            conversationsUnread.some((id) => !localUnreadIds.includes(id));
          if (changed) {
            setConversationsUnread([...localUnreadIds]);
            setIsAnyConversationUnread(localUnreadIds.length > 0);
          }
          setLoading(false);
        }
      });
      unsubscribers.push(unsubscribe);
    });
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [JSON.stringify(conversationIds)]);
  return { isAnyConversationUnread, conversationsUnread, loading };
};
