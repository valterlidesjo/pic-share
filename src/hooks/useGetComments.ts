import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export type Comment = {
  id: string;
  text: string;
  userId: string;
  email: string;
  createdAt: Date;
};

type FirestoreComment = Omit<Comment, "createdAt"> & {
  createdAt: Timestamp;
};

const useGetComments = (imageId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!imageId) return;

    const commentsCollectionRef = collection(db, "images", imageId, "comments");
    const q = query(commentsCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsList = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreComment;
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          return {
            id: doc.id,
            text: data.text,
            userId: data.userId,
            email: data.email,
            createdAt: createdAtDate,
          };
        });
        setComments(commentsList);
      },
      (error) => {
        console.error("Fel vid hämtning av kommentarer:", error);
      }
    );

    return () => unsubscribe();
  }, [imageId]);
  return { comments };
};

export default useGetComments;
