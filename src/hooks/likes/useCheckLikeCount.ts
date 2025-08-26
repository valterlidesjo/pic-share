import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckLikeCount = (imageId: string | undefined) => {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  useEffect(() => {
    if (!imageId || !db) {
      setLikeCount(null);
      return;
    }
    const q = query(collection(db, "likes"), where("imageId", "==", imageId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLikeCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [imageId]);
  return { likeCount };
};

export default useCheckLikeCount;
