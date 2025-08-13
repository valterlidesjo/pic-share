"use client";
import React from "react";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useRouter } from "next/navigation";

const Upload = () => {
  const {
    selectedFile,
    setSelectedFile,
    uploading,
    uploadError,
    downloadURL,
    handleUpload,
  } = useImageUpload();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push("/gallery")}
        className="absolute top-5 left-5"
      >
        Back to gallery
      </Button> */}
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
          <img
            src={downloadURL}
            alt="Uploaded"
            className="max-w-full h-auto mt-4 px-8"
          />
        </div>
      )}
    </>
  );
};

export default Upload;
