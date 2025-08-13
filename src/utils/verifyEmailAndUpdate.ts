import { auth, db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const checkAndUpdateEmailVerified = async (userId: string) => {
  await auth.currentUser?.reload(); // Refresh user info
  if (auth.currentUser?.emailVerified) {
    await updateDoc(doc(db, "users", userId), { emailVerified: true });
    return true;
  }
  return false;
};
