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
      <div className="flex flex-col items-center justify-center px-8 gap-4">
        <h1>Welcome to the gallery!</h1>
        <p className="text-xl">
          You are currently browsing as a guest. Please sign up or sign in to
          get the full PicShare experience. Be able to upload images to
          everyone, browse the full gallery, follow your favorites, and see
          their feed and comment on their images!
        </p>
        <div className="flex items-center justify-evenly gap-4 mb-4">
          <Button
            variant="outlined"
            onClick={() => router.push("/sign-up")}
            sx={{ fontSize: "1.5rem" }}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/sign-in")}
            sx={{ fontSize: "1.5rem" }}
          >
            Sign In
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 gap-4">
        <h2>Here you can see your own pictures, if you have any uploaded</h2>
        <h2>
          You can{" "}
          <Button variant="outlined" onClick={() => router.push("/sign-in")}>
            Upload
          </Button>{" "}
          pictures here or sign in to get the full PicShare experience.
        </h2>

        <Images images={ownImages} showComments={false} showLikes={false} />
      </div>
    </>
  );
};

export default GuestGalleryContent;
