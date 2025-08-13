import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const addCommentToImage = async (
  imageId: string,
  userId: string,
  email: string,
  commentText: string
) => {
  try {
    const commentsCollectionRef = collection(db, "images", imageId, "comments");

    await addDoc(commentsCollectionRef, {
      text: commentText,
      userId: userId,
      email: email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with comment", error);
  }
};
