import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const followUser = async (userId: string, followedUserId: string) => {
  try {
    const followersRef = collection(db, "followers");

    await addDoc(followersRef, {
      followerId: userId,
      followedId: followedUserId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with follow", error);
  }
};
