import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";

export type CommentComment = {
  id: string;
  text: string;
  userId: string;
  commentId: string;
  email: string;
  createdAt: Date;
};

type FirestoreCommentComment = Omit<CommentComment, "createdAt"> & {
  createdAt: Timestamp;
};

const useGetCommentComments = (imageId: string, commentId: string) => {
  const [commentComments, setCommentComments] = useState<CommentComment[]>([]);

  useEffect(() => {
    if (!imageId || !commentId || !db) return;

    const commentsCollectionRef = collection(
      db,
      "images",
      imageId,
      "comments",
      commentId,
      "commentComments"
    );
    const q = query(commentsCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentCommentsList = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreCommentComment;
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          return {
            id: doc.id,
            text: data.text,
            userId: data.userId,
            commentId: data.commentId,
            email: data.email,
            createdAt: createdAtDate,
          };
        });
        setCommentComments(commentCommentsList);
      },
      (error) => {
        console.error("Fel vid hämtning av kommentarers svar:", error);
      }
    );

    return () => unsubscribe();
  }, [imageId, commentId]);
  return { commentComments };
};

export default useGetCommentComments;
