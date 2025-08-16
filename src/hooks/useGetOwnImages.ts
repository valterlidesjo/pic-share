import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { FirestoreImage, Image } from "./useGetAllImages";

export const useGetPersonalImages = (userId: string | undefined) => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      console.log("Skipping image fetch - userId or db not available");
      setError(null);

      setImages([]);
      return;
    }
    const q = query(collection(db, "images"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const imageList = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreImage;
          const uploadedAtDate = data.uploadedAt?.toDate
            ? data.uploadedAt.toDate()
            : new Date();

          return {
            id: doc.id,
            userId: data.userId,
            imageUrl: data.imageUrl,
            fileName: data.fileName,
            uploadedAt: uploadedAtDate,
            email: data.email,
          } as Image;
        });
        setImages(imageList);
      },
      (err) => {
        console.error("Error collecting images:", err);
        setError("Could not load images");
      }
    );
    return () => unsubscribe();
  }, [userId]);
  return { images, error };
};
