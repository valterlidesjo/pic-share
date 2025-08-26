import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckFollowerCount = (userId: string | undefined) => {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  useEffect(() => {
    if (!userId || !db) {
      setFollowerCount(null);
      return;
    }
    const q = query(
      collection(db, "followers"),
      where("followedId", "==", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFollowerCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [userId]);
  return { followerCount };
};

export default useCheckFollowerCount;
