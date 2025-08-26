import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const likeComment = async (
  userId: string | undefined,
  commentId: string
) => {
  if (!userId || !commentId) {
    console.log("Could not find user or comment, could not like comment");
  }
  try {
    const likedRef = collection(db, "commentLikes");

    await addDoc(likedRef, {
      userId: userId,
      commentId: commentId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with follow", error);
  }
};
