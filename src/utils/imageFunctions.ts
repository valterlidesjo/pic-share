import { db } from "@/firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export const updateFileName = async (imageId: string, newFileName: string) => {
  try {
    const imageRef = doc(db, "images", imageId);
    await updateDoc(imageRef, {
      fileName: newFileName,
    });
    console.log(`Image ${imageId} updated with new file name: ${newFileName}`);
  } catch (error) {
    console.error("Error updating filename:", error);
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    const imageRef = doc(db, "images", imageId);
    await deleteDoc(imageRef);
    console.log(`Image ${imageId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
