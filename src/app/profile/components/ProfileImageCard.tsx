import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatFileNameForDisplay } from "@/utils/formatFileName";
import { updateFileName, deleteImage } from "@/utils/imageFunctions";
import Image from "next/image";
import { Image as ImageProps } from "@/hooks/useGetAllImages";

const ProfileImageCard = ({ image }: { image: ImageProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedFileName, setEditedFileName] = useState("");

  return (
    <div className="border p-2 rounded-lg shadow-md mb-8">
      <div className="relative w-full h-48 mb-2">
        <Image
          src={image.imageUrl}
          alt={image.fileName || "Galleri Bild"}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex items-center justify-start gap-2">
        {isEditing ? (
          <>
            <TextField
              label={image.fileName}
              value={editedFileName}
              onChange={(e) => setEditedFileName(e.target.value)}
            />
            <CheckCircleIcon
              onClick={() => {
                updateFileName(image.id, editedFileName);
                setIsEditing(false);
                setEditedFileName("");
              }}
            />
            <CancelIcon
              onClick={() => {
                setIsEditing(false);
                setEditedFileName("");
              }}
            />
          </>
        ) : (
          <>
            <p className="text-base font-semibold truncate">
              {formatFileNameForDisplay(image.fileName)}
            </p>
            <EditIcon fontSize="small" onClick={() => setIsEditing(true)} />
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 py-2">
        Uploaded: {image.uploadedAt.toLocaleDateString()}
      </p>
      <div>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleting(!isDeleting)}
        >
          Delete
        </Button>
      </div>
      {isDeleting && (
        <div className="flex items-center justify-start gap-2 mt-2">
          <p>Are you sure you want to delete this image?</p>
          <DeleteForeverIcon
            className="text-red-500 cursor-pointer"
            onClick={() => {
              deleteImage(image.id);
              setIsDeleting(false);
            }}
          />
          <CancelIcon
            className="cursor-pointer"
            onClick={() => setIsDeleting(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileImageCard;
