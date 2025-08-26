import { db } from "@/firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export type CommentLikes = {
  userId: string;
  commentId: string;
  createdAt: Date;
};

export type FirestoreCommentLike = Omit<CommentLikes, "createdAt"> & {
  createdAt: Timestamp;
};

export const useGetCommentLikes = (commentId?: string) => {
  const [commentLikes, setCommentLikes] = useState<CommentLikes[]>([]);
  useEffect(() => {
    if (!commentId || !db) {
      console.log("No commentId or Db connection");
      return;
    }

    const commentsLikesCollectionRef = collection(db, "commentLikes");
    const q = query(
      commentsLikesCollectionRef,
      where("commentId", "==", commentId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsLikesList = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreCommentLike;
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          return {
            id: doc.id,
            commentId: data.commentId,
            userId: data.userId,
            createdAt: createdAtDate,
          };
        });
        setCommentLikes(commentsLikesList);
      },
      (error) => {
        console.error("Error fecthing comment likes:", error);
      }
    );

    return () => unsubscribe();
  }, [commentId]);
  return { commentLikes };
};
