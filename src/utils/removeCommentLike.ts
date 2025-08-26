import { db } from "@/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const removeCommentLike = async (
  userId: string | undefined,
  commentId: string
) => {
  if (!userId || !commentId) {
    console.log("Could not remove like, userId or commentId is missing.");
  }
  try {
    const q = query(
      collection(db, "commentLikes"),
      where("userId", "==", userId),
      where("commentId", "==", commentId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];

      await deleteDoc(doc(db, "commentLikes", docToDelete.id));
      return true;
    } else {
      console.error("Could not find a commentLike relation");
      return false;
    }
  } catch (error) {
    console.error("Error with removing like", error);
    return false;
  }
};
