import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import useAuthGuard from "../auth/useAuthGuard";

export default function useCheckIfUsernameExists(
  newUsername: string | undefined
) {
  const [usernameExists, setUsernameExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthGuard();
  useEffect(() => {
    const currentUserId = user?.uid;
    if (!currentUserId || !db || !newUsername) {
      setUsernameExists(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "users"),
      where("username", "==", newUsername)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usernames = snapshot.docs.map((doc) => doc.data().username);
      if (usernames.length > 0) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
    });
    setLoading(false);
    return () => unsubscribe();
  }, [user, newUsername]);

  return { usernameExists, loading };
}
