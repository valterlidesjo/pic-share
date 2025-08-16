import { useEffect, useState } from "react";
import { FirestoreImage, Image } from "./useGetAllImages";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const useGetFollowedUsersImages = (followedIds: string[]) => {
  const [followedUsersImages, setFollowedUsersImages] = useState<Image[]>([]);

  useEffect(() => {
    if (!followedIds || followedIds.length === 0 || !db) {
      setFollowedUsersImages([]);
      return;
    }
    const q = query(
      collection(db, "images"),
      where("userId", "in", followedIds)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const imageList = snapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreImage;
          const uploadedAtDate = data.uploadedAt.toDate
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
          } as Image;
        });
        imageList.sort(
          (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
        );

        setFollowedUsersImages(imageList);
      },
      (error) => {
        console.error("Error collecting followed users images: ", error);
      }
    );
    return () => unsubscribe();
  }, [followedIds]);
  return { followedUsersImages };
};

export default useGetFollowedUsersImages;
