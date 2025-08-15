import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import useAuthGuard from "./useAuthGuard";

export interface UserInfo {
  email: string | null;
  username?: string | null;
  emailVerified?: boolean;
}

export default function useGetUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { user } = useAuthGuard();
  useEffect(() => {
    const fetchUserInfo = async () => {
      const currentUserId = user?.uid;
      const currentUserEmail = user?.email || "";
      if (!currentUserId) {
        setUserInfo(null);
        return;
      }
      try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserInfo({
            email: currentUserEmail,
            ...userDoc.data(),
          });
        } else {
          setUserInfo({ email: currentUserEmail });
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [user]);

  return { userInfo };
}
