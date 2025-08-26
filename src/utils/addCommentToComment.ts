import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const addCommentToComment = async (
  imageId: string,
  commentId: string,
  userId: string,
  email: string | null | undefined,
  commentText: string
) => {
  if (!userId || !email) {
    console.log("Could not comment on comment, no userId och Email");
  }
  try {
    const commentsCollectionRef = collection(
      db,
      "images",
      imageId,
      "comments",
      commentId,
      "commentComments"
    );

    await addDoc(commentsCollectionRef, {
      text: commentText,
      userId: userId,
      email: email,
      commentId: commentId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with commenting on comment", error);
    return null;
  }
};
