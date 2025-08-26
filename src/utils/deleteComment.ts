import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteComment = async (commentId: string, imageId: string) => {
  if (!imageId || !commentId) {
    console.log("Could not remove like, userId or commentId is missing.");
  }
  try {
    await deleteDoc(doc(db, "images", imageId, "comments", commentId));
  } catch (error) {
    console.error("Error with removing like", error);
    return false;
  }
};
