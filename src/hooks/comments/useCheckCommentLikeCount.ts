import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckCommentLikeCount = (commentId: string | undefined) => {
  const [commentLikeCount, setCommentLikeCount] = useState<number | null>(null);
  useEffect(() => {
    if (!commentId || !db) {
      setCommentLikeCount(null);
      return;
    }
    const q = query(
      collection(db, "commentLikes"),
      where("commentId", "==", commentId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommentLikeCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [commentId]);
  return { commentLikeCount };
};

export default useCheckCommentLikeCount;
