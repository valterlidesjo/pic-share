import { db, storage } from "@/firebaseConfig";
import useAuthGuard from "@/hooks/useAuthGuard";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";
import useGetUserInfo from "./useGetUserInfo";
import { useGhostGuard } from "./useGhostGuard";

interface UseImageUploadReturn {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploading: boolean;
  uploadError: string | null;
  downloadURL: string | null;
  handleUpload: (uniqueFilename: string) => Promise<void>;
  resetUploadState: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const { user } = useAuthGuard();
  const { user: ghostUser } = useGhostGuard();
  const { userInfo } = useGetUserInfo();

  const resetUploadState = useCallback(() => {
    setSelectedFile(null);
    setUploading(false);
    setUploadError(null);
    setDownloadURL(null);
  }, []);

  const handleUpload = useCallback(
    async (uniqueFilename: string) => {
      if (!db) {
        console.warn("Firestore not initialized");
        return;
      }
      if (!user || !ghostUser) {
        setUploadError(
          "You were not able to upload the image. You are not logged in or a anonymous user."
        );
        return;
      }
      const userId = user?.uid || ghostUser?.uid;
      if (!selectedFile) {
        setUploadError("Please choose a file to upload.");
        return;
      }

      setUploading(true);
      setUploadError(null);
      setDownloadURL(null);

      const filePath = `images/${userId}/${selectedFile.name}`;
      const imageRef = ref(storage, filePath);

      try {
        const snapshot = await uploadBytes(imageRef, selectedFile);
        const url = await getDownloadURL(snapshot.ref);
        setDownloadURL(url);
        await addDoc(collection(db, "images"), {
          userId: userId,
          imageUrl: url,
          fileName: uniqueFilename || selectedFile.name,
          uploadedAt: serverTimestamp(),
          email: user?.email || "",
          username: userInfo?.username || "",
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError(`Failed to upload: ${error}`);
      } finally {
        setUploading(false);
        setSelectedFile(null);
      }
    },
    [selectedFile, user, ghostUser, userInfo]
  );
  return {
    selectedFile,
    setSelectedFile,
    uploading,
    uploadError,
    downloadURL,
    handleUpload,
    resetUploadState,
  };
};
