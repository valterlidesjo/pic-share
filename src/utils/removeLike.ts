import { db } from "@/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const removeLike = async (
  userId: string | undefined,
  imageId: string
) => {
  if (!userId || !imageId) {
    console.log("Could not remove like, userId or imageId is missing.");
  }
  try {
    const q = query(
      collection(db, "likes"),
      where("userId", "==", userId),
      where("imageId", "==", imageId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];

      await deleteDoc(doc(db, "likes", docToDelete.id));
      return true;
    } else {
      console.error("Could not find a like relation");
      return false;
    }
  } catch (error) {
    console.error("Error with removing like", error);
    return false;
  }
};
