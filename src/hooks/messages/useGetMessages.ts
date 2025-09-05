import { db } from "@/firebaseConfig";
import { Timestamp } from "@google-cloud/firestore";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
export type Messages = {
  id: string;
  message: string;
  from: string;
  to: string;
  createdAt: Date;
};

export type FirestoreMessages = Omit<Messages, "createdAt"> & {
  createdAt: Timestamp;
};

export const useGetMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!conversationId || !db) {
      setMessages([]);
      setLoading(false);
      console.error("Error, no conversationId or db provided");
      return;
    }
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreMessages;
        const createdAtDate = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date();
        return {
          id: doc.id,
          message: data.message,
          from: data.from,
          to: data.to,
          createdAt: createdAtDate,
        };
      });
      setMessages(messagesList);
    });
    setLoading(false);
    return () => unsubscribe();
  }, [conversationId]);
  return { messages, loading };
};
