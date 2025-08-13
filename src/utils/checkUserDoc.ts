// src/utils/ensureUserDoc.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const checkUserDoc = async (email: string, userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email,
      userId,
      createdAt: new Date(),
    });
    return true;
  }
  return false; // Already existed
};
