import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckCommentCommentCount = (
  commentId: string | undefined,
  imageId: string
) => {
  const [commentCommentCount, setCommentCommentCount] = useState<number | null>(
    null
  );
  useEffect(() => {
    if (!commentId || !db || !imageId) {
      console.error("Error setting commentCommentCount, props or db i missing");
      setCommentCommentCount(null);
      return;
    }
    const q = query(
      collection(
        db,
        "images",
        imageId,
        "comments",
        commentId,
        "commentComments"
      )
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommentCommentCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [commentId, imageId]);
  return { commentCommentCount };
};

export default useCheckCommentCommentCount;
