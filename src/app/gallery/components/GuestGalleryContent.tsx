import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { Images } from "./Images";
import { Image } from "@/hooks/useGetAllImages";

interface GuestGalleryProps {
  ownImages: Image[];
}

const GuestGalleryContent: React.FC<GuestGalleryProps> = ({ ownImages }) => {
  const router = useRouter();
  if (!ownImages) return <div>Could not find users images</div>;

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>Welcome to the gallery!</h1>
        <p>
          You are currently browsing as a guest. Please sign up or sign in to
          view and comment on pictures.
        </p>
        <Button variant="outlined" onClick={() => router.push("/sign-up")}>
          Sign Up
        </Button>
        <Button variant="outlined" onClick={() => router.push("/sign-in")}>
          Sign In
        </Button>
      </div>
      <div>
        <h2>Here you can see your own pictures, if you have any uploaded</h2>
        <h2>
          You can{" "}
          <Button variant="outlined" onClick={() => router.push("/sign-in")}>
            Upload
          </Button>{" "}
          pictures here or sign in to get the full PicShare experience.
        </h2>

        <Images images={ownImages} showComments={false} />
      </div>
    </>
  );
};

export default GuestGalleryContent;
