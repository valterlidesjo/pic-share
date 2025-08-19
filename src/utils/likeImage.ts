import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const likeImage = async (
  userId: string | undefined,
  likedImageId: string
) => {
  if (!userId || !likedImageId) {
    console.log("Could not find user, could not like image");
  }
  try {
    const likedRef = collection(db, "likes");

    await addDoc(likedRef, {
      userId: userId,
      imageId: likedImageId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error with follow", error);
  }
};
