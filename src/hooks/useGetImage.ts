import { useEffect, useState } from "react";
import { FirestoreImage, Image } from "./useGetAllImages";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export const useGetImage = (imageId: string) => {
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const docRef = doc(db, "images", imageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreImage;
          const uploadedAtDate = data.uploadedAt?.toDate
            ? data.uploadedAt.toDate()
            : new Date();
          setImage({
            id: docSnap.id,
            userId: data.userId,
            imageUrl: data.imageUrl,
            fileName: data.fileName,
            uploadedAt: uploadedAtDate,
            email: data.email || "Unknown",
            username: data.username || "Unknown",
          });
        } else {
          setError("No image found");
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setError("Could not load image");
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [imageId]);
  return { image, loading, error };
};
