import { db } from "@/firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export const updateFileName = async (imageId: string, newFileName: string) => {
  try {
    const imageRef = doc(db, "images", imageId);
    await updateDoc(imageRef, {
      fileName: newFileName,
    });
  } catch (error) {
    console.error("Error updating filename:", error);
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    const imageRef = doc(db, "images", imageId);
    await deleteDoc(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
