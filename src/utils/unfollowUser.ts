import { db } from "@/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const unfollowUser = async (userId: string, followedUserId: string) => {
  try {
    const q = query(
      collection(db, "followers"),
      where("followerId", "==", userId),
      where("followedId", "==", followedUserId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];

      await deleteDoc(doc(db, "followers", docToDelete.id));
      return true;
    } else {
      console.error("Could not find a followers relation");
      return false;
    }
  } catch (error) {
    console.error("Error with unfollow", error);
    return false;
  }
};
