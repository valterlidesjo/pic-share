import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteAccount = async (userId: string | undefined) => {
  if (!userId) {
    console.log("Could not remove account, userId is missing.");
    return;
  }
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("Error with removing account", error);
    return false;
  }
};
