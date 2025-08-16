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
import { User } from "./useGetVerifiedUsers";

export type FollowedUsers = {
  id: string;
  createdAt: Date;
  followedId: string;
  followerId: string;
  followedUserUsername?: string;
  followedUserEmail?: string;
  followedUserEmailVerified?: boolean;
};

const useGetFollowedUsers = (userId: string | undefined) => {
  const [followedUsers, setFollowedUsers] = useState<FollowedUsers[] | null>(
    null
  );

  useEffect(() => {
    if (!userId || !db) {
      setFollowedUsers(null);
      return;
    }
    const q = query(
      collection(db, "followers"),
      where("followerId", "==", userId)
    );
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const fetchPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const followedId = data.followedId as string;

          const userDocRef = doc(db, "users", followedId);
          const userDocSnap = await getDoc(userDocRef);

          let followedUserUsername: string | undefined;
          let followedUserEmail: string | undefined;
          let followedUserEmailVerified: boolean | undefined;

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            followedUserUsername = userData.username;
            followedUserEmail = userData.email;
            followedUserEmailVerified = userData.emailVerified;
          }
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          return {
            id: docSnap.id,
            createdAt: createdAtDate,
            followedId: data.followedId,
            followerId: data.followerId,
            followedUserUsername: followedUserUsername,
            followedUserEmail: followedUserEmail,
            followedUserEmailVerified: followedUserEmailVerified,
          };
        });
        const results = await Promise.all(fetchPromises);
        setFollowedUsers(results);
      },
      (error) => {
        console.error("Error fetching followed users:", error);
        setFollowedUsers([]);
      }
    );

    return () => unsubscribe();
  }, [userId]);
  return { followedUsers };
};

export default useGetFollowedUsers;
