import { useEffect, useState } from "react";
import { FirestoreImage, Image } from "./useGetAllImages";
import useAuthGuard from "./useAuthGuard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const useGetCategorizedImages = (category: string) => {
  const [categorizedImages, setCategorizedImages] = useState<Image[]>([]);
  const { user } = useAuthGuard();
  useEffect(() => {
    if (!user || !db) {
      setCategorizedImages([]);
      return;
    }
    if (user) {
      const q = query(
        collection(db, "images"),
        where("category", "==", category)
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
            category: data.category,
            uploadedAt: uploadedAtDate,
            email: data.email,
            username: data.username,
          };
        });
        setCategorizedImages(imageList);
      });
      return () => unsubscribe();
    }
  }, [user]);
  return { categorizedImages };
};

export default useGetCategorizedImages;
