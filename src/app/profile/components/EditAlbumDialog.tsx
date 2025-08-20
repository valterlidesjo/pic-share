import React, { useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import { TransitionProps } from "@mui/material/transitions";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { User as UserProps } from "firebase/auth";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";
import Image from "next/image";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditAlbumDialog = ({
  albumId,
  user,
  initialImages,
}: {
  albumId: string;
  user: UserProps | null | undefined;
  initialImages: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingImages, setIsEditingImages] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const { images } = useGetPersonalImages(user?.uid);
  useEffect(() => {
    if (initialImages.length > 0) {
      const imageIds = initialImages.map((image) => image);
      setSelectedImages(imageIds);
    }
  }, [initialImages]);

  const handleEditTitle = async () => {
    if (!albumId) {
      console.error("Could not edit title, no albumId.");
      return;
    }
    try {
      await updateDoc(doc(db, "albums", albumId), { title: newTitle });
      setUpdateMessage("Album title updated succesfully!");
    } catch (error) {
      console.error("Error updating album title: ", error);
      setUpdateMessage("Could not update album title, please try again.");
    }
  };

  const handleImageSelect = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const handleUpdateAlbumImages = async () => {
    if (!albumId) {
      console.error("Could not edit album images, no albumId.");
      return;
    }
    if (selectedImages.length > 10) {
      setUpdateMessage("You can max have 10 images in your album.");
      return;
    }

    const imagesRef = collection(db, "albums", albumId, "images");
    const existingImagesSnap = await getDocs(imagesRef);
    const existingImagesIds = existingImagesSnap.docs.map((doc) => doc.id);

    const batch = writeBatch(db);
    const imagesToRemove = existingImagesIds.filter(
      (id) => !selectedImages.includes(id)
    );

    imagesToRemove.forEach((id) => {
      const docRef = doc(imagesRef, id);
      batch.delete(docRef);
    });

    const imagesToAdd = selectedImages.filter(
      (id) => !existingImagesIds.includes(id)
    );

    imagesToAdd.forEach((imageId) => {
      const newDocRef = doc(imagesRef);
      batch.set(newDocRef, {
        userId: user?.uid,
        imageId: imageId,
        createdAt: serverTimestamp(),
      });
    });
    try {
      await batch.commit();
      setUpdateMessage("Updated album images successfully");
    } catch (error) {
      console.error("Could not updated album images, ", error);
      setUpdateMessage("Could not update album images, please try again.");
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      const albumRef = doc(db, "albums", albumId);
      await deleteDoc(albumRef);
      setUpdateMessage("Album deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
      setUpdateMessage("Could not delete album, please try again.");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", color: "#E38724" }}
      >
        Edit Album
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Edit your album"}</DialogTitle>
        {!isEditingTitle && !isEditingImages && (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                This is where you can update your album. You can edit the title
                of the album, add images and remove images.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setIsDeleting(!isDeleting)}
              >
                Delete
              </Button>

              <Button
                variant="outlined"
                onClick={() => setIsEditingTitle(true)}
              >
                Edit title
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditingImages(true)}
              >
                Edit images
              </Button>
            </DialogActions>
            <DialogContent>
              {isDeleting && (
                <div className="flex items-center justify-start gap-2 mt-2">
                  <p>Are you sure you want to delete this album?</p>
                  <DeleteForeverIcon
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      handleDeleteAlbum();
                      setIsDeleting(false);
                      setOpen(false);
                    }}
                  />
                  <CancelIcon
                    className="cursor-pointer"
                    onClick={() => setIsDeleting(false)}
                  />
                </div>
              )}
            </DialogContent>
          </>
        )}
        {isEditingTitle && !isEditingImages && (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                A title is a perfect way to uniquify your album.
                <br />
                Here you can edit your title.
              </DialogContentText>
              <TextField
                label="New Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                sx={{ marginTop: "1rem" }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  setIsEditingTitle(false);
                  setIsEditingImages(false);
                }}
              >
                Don&apos;t edit
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  handleEditTitle();
                  setIsEditingTitle(false);
                  setIsEditingImages(false);
                }}
              >
                Edit username
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(true);
                  handleEditTitle();
                  setIsEditingTitle(false);
                  setIsEditingImages(true);
                }}
              >
                Edit and continue
              </Button>
            </DialogActions>
          </>
        )}
        {isEditingImages && !isEditingTitle && (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Edit the images you have in your album. Click on the box to add
                or remove the image from this album. You can max add 10 images
                to an album.
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
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  setIsEditingTitle(false);
                  setIsEditingImages(false);
                }}
              >
                Don&apos;t edit
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                  setIsEditingTitle(false);
                  setIsEditingImages(false);
                  handleUpdateAlbumImages();
                }}
              >
                Update album images
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {updateMessage && <p>{updateMessage}</p>}
    </>
  );
};

export default EditAlbumDialog;
