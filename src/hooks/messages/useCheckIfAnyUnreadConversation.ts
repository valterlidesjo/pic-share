import { db } from "@/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirestoreConversation } from "./useGetConversation";
import useAuthGuard from "../auth/useAuthGuard";

export const useCheckIfAnyUnreadConversation = (conversationIds: string[]) => {
  const [isAnyConversationUnread, setIsAnyConversationUnread] =
    useState<boolean>(false);
  const [conversationsUnread, setConversationsUnread] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthGuard();

  useEffect(() => {
    if (!conversationIds || conversationIds.length === 0 || !user) {
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
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const latestReadByUser = data.readBy
            ? Object.keys(data.readBy).reduce(
                (acc: Record<string, Date>, userId: string) => {
                  const timestamp = (data.readBy as Record<string, any>)[
                    userId
                  ];
                  if (timestamp) {
                    acc[userId] = timestamp.toDate();
                  }
                  return acc;
                },
                {}
              )
            : {};
          /* eslint-enable @typescript-eslint/no-explicit-any */
          const currentUserLastReadTime = latestReadByUser[user.uid];

          const isUnread =
            updatedAtDate &&
            currentUserLastReadTime &&
            currentUserLastReadTime < updatedAtDate;
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
  }, [conversationIds]);
  return { isAnyConversationUnread, conversationsUnread, loading };
};
