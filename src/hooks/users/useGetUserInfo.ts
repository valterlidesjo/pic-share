import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import useAuthGuard from "../auth/useAuthGuard";

export interface UserInfo {
  email: string | null;
  username?: string | null;
  emailVerified?: boolean;
}

export default function useGetUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthGuard();
  useEffect(() => {
    const currentUserId = user?.uid;
    if (!currentUserId || !db) {
      setUserInfo(null);
      return;
    }
    setLoading(true);
    const docRef = doc(db, "users", currentUserId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserInfo;
          setUserInfo({
            email: data.email,
            emailVerified: data.emailVerified,
            username: data.username,
          });
        } else {
          setUserInfo(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user info, ", error);
        setUserInfo(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  return { userInfo, loading };
}
