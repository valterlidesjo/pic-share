import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export type User = {
  userId: string;
  createdAt: Date;
  email?: string;
  username?: string;
  emailVerified: boolean;
};

const useGetVerifiedUsers = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("emailVerified", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map((doc) => {
        const data = doc.data() as User;
        return data;
      });
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);
  return { users };
};

export default useGetVerifiedUsers;
