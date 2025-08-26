"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useImageUpload } from "@/hooks/images/useImageUpload";
import { useGhostGuard } from "@/hooks/auth/useGhostGuard";
import TextField from "@mui/material/TextField";
import { runCategoryPrompt } from "@/utils/categoryPrompt";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const Upload = () => {
  const [uniqueFilename, setUniqueFilename] = useState<string>("");
  const {
    selectedFile,
    setSelectedFile,
    uploading,
    loading,
    uploadError,
    downloadURL,
    handleUpload,
  } = useImageUpload();
  useGhostGuard();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    const category = await runCategoryPrompt();
    if (category) {
      handleUpload(uniqueFilename, category);
    } else {
      console.log("Could not find category.");
    }
    setUniqueFilename("");
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center px-8 mt-[60px]">
        <div className="flex flex-col w-full justify-center items-start gap-4 sm:items-center sm:max-w-[512px]">
          <h1 className="text-[#1976D2] font-bold text-2xl">Upload</h1>
          <input
            type="file"
            className="cursor-pointer border p-2 w-full"
            onChange={handleFileChange}
            id="promt-input"
          />
          <TextField
            id="filename"
            label="Name you image"
            value={uniqueFilename}
            onChange={(e) => setUniqueFilename(e.target.value)}
            sx={{ width: "100%" }}
          />
          <Button
            variant="contained"
            onClick={() => {
              handleUploadClick();
            }}
            sx={{ width: "100%" }}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
          {uploadError && (
            <p className="text-red-600 text-xl font-bold">{uploadError}</p>
          )}
          {downloadURL && (
            <>
              <p className="text-xl font-bold">
                Image uploaded successfully! Go to gallery and check it out.
              </p>
              <Button
                variant="outlined"
                onClick={() => router.push("/gallery")}
                sx={{ width: "100%", color: "#E38724" }}
              >
                Gallery
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
