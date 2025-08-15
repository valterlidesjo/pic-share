"use client";
import React from "react";
import Button from "@mui/material/Button";
import { useImageUpload } from "@/hooks/useImageUpload";
import Image from "next/image";

const Upload = () => {
  const {
    selectedFile,
    setSelectedFile,
    uploading,
    uploadError,
    downloadURL,
    handleUpload,
  } = useImageUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center px-8 gap-4">
        <h1 className="text-[#1976D2] font-bold text-2xl">Upload</h1>
        <input
          type="file"
          className="cursor-pointer border p-2 w-full"
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="text-black"
        >
          {uploading ? "Uploading..." : "Upload image"}
        </Button>
      </div>

      {uploadError && <p className="text-red-600">{uploadError}</p>}
      {downloadURL && (
        <div>
          <p>Image uploaded successfully!</p>
          <div className="relative max-w-full h-auto mt-4 px-8">
            <Image
              src={downloadURL}
              alt="Uploaded"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
