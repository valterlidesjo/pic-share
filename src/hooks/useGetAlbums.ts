import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuthGuard from "./useAuthGuard";

export type AlbumImage = {
  userId: string;
  imageId: string;
  createdAt: Date;
};

export type Album = {
  id: string;
  createdBy: string;
  title: string;
  createdAt: Date;
  images: AlbumImage[];
};

export type FirestoreAlbum = Omit<Album, "createdAt" | "images"> & {
  createdAt: Timestamp;
};

export const useGetAlbums = (userId?: string, albumId?: string) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { user } = useAuthGuard();
  useEffect(() => {
    if (!user || !db) {
      setAlbums([]);
      return;
    }
    const fetchAlbums = async () => {
      let q;
      let snapshot;
      if (albumId) {
        const docRef = doc(db, "albums", albumId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          snapshot = { docs: [docSnap] };
        } else {
          setAlbums([]);
          return;
        }
      } else {
        if (!userId) {
          q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
        } else {
          q = query(collection(db, "albums"), where("createdBy", "==", userId));
        }
        snapshot = await getDocs(q);
      }
      const albumDocs = snapshot.docs;

      const albumsWithImagesPromises = albumDocs.map(async (doc) => {
        const data = doc.data() as FirestoreAlbum;

        const imagesCollectionRef = collection(db, "albums", doc.id, "images");
        const imagesSnapshot = await getDocs(imagesCollectionRef);

        const albumImages: AlbumImage[] = imagesSnapshot.docs.map((imgDoc) => {
          const imgData = imgDoc.data();
          const createdAtDate = imgData.createdAt?.toDate
            ? imgData.createdAt.toDate()
            : new Date();

          return {
            id: doc.id,
            userId: imgData.userId,
            imageId: imgData.imageId,
            createdAt: createdAtDate,
          };
        });
        const createdAtDate = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date();
        return {
          id: doc.id,
          createdBy: data.createdBy,
          title: data.title,
          createdAt: createdAtDate,
          images: albumImages,
        };
      });
      const albumList = await Promise.all(albumsWithImagesPromises);

      setAlbums(albumList);
    };
    fetchAlbums();
  }, [user, userId, albumId]);
  return { albums };
};
