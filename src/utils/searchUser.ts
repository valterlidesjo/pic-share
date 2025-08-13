import { db } from "@/firebaseConfig";
import { User } from "@/hooks/useGetVerifiedUsers";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export const searchUser = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, "users"),
      where("username", "in", searchTerm)
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const userList: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId,
          email: data.email,
          username: data.username,
        } as User;
      });
      return userList;
    });
    return () => unsubscribe();
  } catch (error) {
    console.error("Error searching for user: ", error);
  }
};
