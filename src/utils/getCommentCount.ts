import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const getCommentCount = async (imageId: string): Promise<number> => {
  if (!imageId) return 0;
  const commentsCollectionRef = collection(db, "images", imageId, "comments");
  const snapshot = await getDocs(commentsCollectionRef);
  return snapshot.size;
};
