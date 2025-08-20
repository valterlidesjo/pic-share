// src/components/UsernameDialog.tsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { TransitionProps } from "@mui/material/transitions";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { User } from "firebase/auth";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";
import Image from "next/image";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateAlbumDialog = ({ user }: { user: User | null | undefined }) => {
  const [open, setOpen] = useState(false);
  const [isAlbumCreated, setIsAlbumCreated] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumMessage, setAlbumMessage] = useState<string | null>(null);
  const [newAlbumId, setNewAlbumId] = useState<string | null>(null);

  const { images } = useGetPersonalImages(user?.uid);

  const handleImageSelect = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const createAlbum = async (userId: string | undefined, title: string) => {
    if (!userId) {
      setAlbumMessage("Could not find user.");
      return;
    }
    if (!title) {
      setAlbumMessage("You have to name your album. Please try again.");
      return;
    }
    try {
      const albumRef = collection(db, "albums");

      const newAlbumDocRef = await addDoc(albumRef, {
        createdBy: userId,
        title: title,
        createdAt: serverTimestamp(),
      });
      const newAlbumId = newAlbumDocRef.id;
      return newAlbumId;
    } catch (error) {
      console.error("Error with creating album", error);
      return null;
    }
  };

  const addImagesToAlbum = async (
    choosenImages: string[],
    userId: string | undefined,
    albumId: string | null
  ) => {
    const imagePromises = choosenImages.map((imageId) => {
      if (!userId || !albumId) {
        return Promise.reject("User ID or Album ID is missing.");
      }
      const albumCollectionRef = collection(db, "albums", albumId, "images");

      return addDoc(albumCollectionRef, {
        imageId: imageId,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    });
    try {
      await Promise.all(imagePromises);
      setAlbumMessage("The album is created with all the images.");
    } catch (error) {
      setAlbumMessage(
        "The album and the images could not be set. Please try again."
      );
    }
  };

  const handleCreateAlbum = async () => {
    const albumId = await createAlbum(user?.uid, albumTitle);
    if (albumId) {
      setNewAlbumId(albumId);
      setIsAlbumCreated(true);
    }
  };

  const handleAddPicturesToAlbum = async () => {
    if (user?.uid && newAlbumId) {
      await addImagesToAlbum(selectedImages, user.uid, newAlbumId);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", color: "#E38724" }}
      >
        Create Album
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        {isAlbumCreated ? (
          <>
            <DialogTitle>{"Choose pictures"}</DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-slide-description"
                sx={{ marginBottom: "1rem" }}
              >
                Please select all of the pictures you want in your album. You
                can max have 10 images in an album. You can always update your
                album by adding or removing pictures from it later on.
              </DialogContentText>
              {images.map((image) => (
                <ul
                  key={image.id}
                  className="flex justify-start items-center gap-2 mt-2"
                >
                  {selectedImages.includes(image.id) ? (
                    <div onClick={() => handleImageSelect(image.id)}>
                      <CheckBoxIcon />
                    </div>
                  ) : (
                    <div onClick={() => handleImageSelect(image.id)}>
                      <CheckBoxOutlineBlankIcon />
                    </div>
                  )}
                  <li>{image.fileName}</li>
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={image.imageUrl}
                      alt={image.fileName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </ul>
              ))}
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  handleAddPicturesToAlbum();
                }}
              >
                Add pictures
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>{"Create album"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                An album is a great way to gather your images from a trip, of
                your friend's or family or anything that is important to you!
                <br />
                Please start with naming your album.
              </DialogContentText>
              <TextField
                label="Album title"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="mt-2"
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAlbumCreated(true);
                  handleCreateAlbum();
                }}
              >
                Create Album
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {albumMessage && <p>{albumMessage}</p>}
    </>
  );
};

export default CreateAlbumDialog;
