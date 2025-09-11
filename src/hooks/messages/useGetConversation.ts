import { db } from "@/firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export type Conversation = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: Record<string, Date>;
  userIds: string[];
};

export type FirestoreConversation = Omit<Conversation, "createdAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readBy: Record<string, Timestamp>;
};

export const useGetConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!conversationId || !db) {
      setConversation(null);
      setLoading(false);
      console.error("Error, no conversationId or db provided");
      return;
    }
    const fetchConversation = async () => {
      try {
        const conversationRef = doc(db, "conversations", conversationId);
        const docSnap = await getDoc(conversationRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreConversation;
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

          setConversation({
            id: docSnap.id,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
            readBy: latestReadByUser,
            userIds: data.userIds,
          });
        } else {
          setConversation(null);
          setLoading(false);
          console.error("Could not find conversation");
        }
      } catch (error) {
        console.error("Error fetching conversation", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [conversationId]);
  return { conversation, loading };
};
