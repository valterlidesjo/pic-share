import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuthGuard from "../auth/useAuthGuard";

export type AlbumImage = {
  id: string;
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuthGuard();
  useEffect(() => {
    if (!user || !db) {
      setAlbums([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe = () => {};

    const processDocs = async (docs: QueryDocumentSnapshot<DocumentData>[]) => {
      let albumList: Album[] = [];
      try {
        const albumsWithImagesPromises = docs.map(async (doc) => {
          const data = doc.data() as FirestoreAlbum;

          const imagesCollectionRef = collection(
            db,
            "albums",
            doc.id,
            "images"
          );
          const imagesSnapshot = await getDocs(imagesCollectionRef);

          const albumImages: AlbumImage[] = imagesSnapshot.docs.map(
            (imgDoc) => {
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
            }
          );
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
        albumList = await Promise.all(albumsWithImagesPromises);
      } catch (error) {
        console.error("Error fetching albums, ", error);
      } finally {
        setAlbums(albumList);
        setLoading(false);
      }
    };

    if (albumId) {
      const docRef = doc(db, "albums", albumId);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          processDocs([docSnap]);
        } else {
          setAlbums([]);
          setLoading(false);
        }
      });
    } else {
      let q;
      if (!userId) {
        q = query(collection(db, "albums"), orderBy("createdAt", "desc"));
      } else {
        q = query(collection(db, "albums"), where("createdBy", "==", userId));
      }
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        processDocs(querySnapshot.docs);
      });
    }

    return () => unsubscribe();
  }, [user, userId, albumId]);
  return { albums, loading };
};
