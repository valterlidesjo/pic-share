import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "../users/useGetVerifiedUsers";

export type Follower = {
  id: string;
  createdAt: Date;
  followedId: string;
  followerId: string;
  followerUserUsername?: string;
  followerUserEmail?: string;
  followerUserEmailVerified?: boolean;
};

const useGetFollowers = (userId: string | undefined) => {
  const [followers, setFollowers] = useState<Follower[] | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setFollowers(null);
      return;
    }
    const q = query(
      collection(db, "followers"),
      where("followedId", "==", userId)
    );
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const fetchPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const followerId = data.followerId as string;

          const userDocRef = doc(db, "users", followerId);
          const userDocSnap = await getDoc(userDocRef);

          let followerUserUsername: string | undefined;
          let followerUserEmail: string | undefined;
          let followerUserEmailVerified: boolean | undefined;

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            followerUserUsername = userData.username;
            followerUserEmail = userData.email;
            followerUserEmailVerified = userData.emailVerified;
          }
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          return {
            id: docSnap.id,
            createdAt: createdAtDate,
            followedId: data.followedId,
            followerId: data.followerId,
            followerUserUsername: followerUserUsername,
            followerUserEmail: followerUserEmail,
            followerUserEmailVerified: followerUserEmailVerified,
          };
        });
        const results: Follower[] = await Promise.all(fetchPromises);

        setFollowers(results);
      },
      (error) => {
        console.error("Error fetching follower users:", error);
        setFollowers([]);
      }
    );

    return () => unsubscribe();
  }, [userId]);
  return { followers };
};

export default useGetFollowers;
