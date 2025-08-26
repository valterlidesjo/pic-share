import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const addCommentToImage = async (
  imageId: string,
  userId: string,
  personalUserId: string | undefined,
  email: string,
  commentText: string
) => {
  if (!imageId || !personalUserId) {
    console.error("Could not comment, no imageId or personalId");
    return;
  }
  try {
    const commentsCollectionRef = collection(db, "images", imageId, "comments");

    await addDoc(commentsCollectionRef, {
      text: commentText,
      userId: userId,
      personalUserId: personalUserId,
      email: email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with comment", error);
  }
};
