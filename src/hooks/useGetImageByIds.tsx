import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { FirestoreImage, Image } from "./useGetAllImages";

export const useGetImagesByIds = (imageIds: string[]) => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    if (imageIds.length === 0) {
      setImages([]);
      return;
    }
    const q = query(
      collection(db, "images"),
      where(documentId(), "in", imageIds)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
          username: data.username,
        };
      });
      setImages(imageList);
    });
    return () => unsubscribe();
  }, [imageIds]);

  return { images };
};
