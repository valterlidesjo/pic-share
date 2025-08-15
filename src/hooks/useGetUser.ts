import { db } from "@/firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "./useGetVerifiedUsers";

type FirestoreUser = Omit<User, "createdAt"> & {
  createdAt: Timestamp;
};

const useGetUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreUser;
          const createdAtDate = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date();
          setUser({
            userId: data.userId,
            createdAt: createdAtDate,
            emailVerified: data.emailVerified,
            email: data.email || "Unknown",
            username: data.username || "Unknown",
          });
        } else {
          console.error("Could not fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);
  return { user };
};

export default useGetUser;
