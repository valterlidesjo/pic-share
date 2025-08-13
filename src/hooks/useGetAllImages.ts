import { db } from "@/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuthGuard from "./useAuthGuard";

export type Image = {
  id: string;
  userId: string;
  imageUrl: string;
  fileName: string;
  uploadedAt: Date;
  email: string;
  username: string;
};

export const useGetAllImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const { user } = useAuthGuard();
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "images"), orderBy("uploadedAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const imageList = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Image, "id" | "uploadedAt"> & {
            uploadedAt: any;
          };
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
    }
  }, [user]);
  return { images };
};
