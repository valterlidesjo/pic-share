import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckIfImageIsLiked = (
  userId: string | null | undefined,
  imageId: string
) => {
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    if (!userId || !imageId || !db) {
      setIsLiked(false);
      return;
    }
    const q = query(
      collection(db, "likes"),
      where("userId", "==", userId),
      where("imageId", "==", imageId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsLiked(!snapshot.empty);
    });
    return () => unsubscribe();
  }, [userId, imageId]);
  return { isLiked };
};

export default useCheckIfImageIsLiked;
