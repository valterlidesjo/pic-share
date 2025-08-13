import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useCheckIfUserFollow = (
  userId: string | null | undefined,
  followedId: string
) => {
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (!userId || !followedId) {
      setIsFollowing(false);
      return;
    }
    const q = query(
      collection(db, "followers"),
      where("followerId", "==", userId),
      where("followedId", "==", followedId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsFollowing(!snapshot.empty);
    });
    return () => unsubscribe();
  }, [userId, followedId]);
  return { isFollowing };
};

export default useCheckIfUserFollow;
