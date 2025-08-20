"use client";
import useAuthGuard from "@/hooks/useAuthGuard";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import UsernameDialog from "@/app/profile/components/UsernameDialog";
import ProfileImageCard from "@/app/profile/components/ProfileImageCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { checkAndUpdateEmailVerified } from "@/utils/verifyEmailAndUpdate";
import { useGetPersonalImages } from "@/hooks/useGetOwnImages";
import useCheckFollowerCount from "@/hooks/useCheckFollowerCount";
import EditAccountDialog from "./components/EditAccountDialog";
import CreateAlbumDialog from "./components/CreateAlbumDialog";
import { useGetAlbums } from "@/hooks/useGetAlbums";
import AlbumImageCard from "./components/AlbumImageCard";

const Profile = () => {
  const { user, loading } = useAuthGuard();
  const { userInfo } = useGetUserInfo();
  const [status, setStatus] = useState("");
  const [, setRefresh] = useState(0);

  const { images } = useGetPersonalImages(user?.uid);
  const { followerCount } = useCheckFollowerCount(user?.uid);
  const { albums } = useGetAlbums(user?.uid);
  const handleCheckVerification = async () => {
    if (user?.uid) {
      const updated = await checkAndUpdateEmailVerified(user?.uid);
      setStatus(
        updated
          ? "Email verified!"
          : "Still not verified. Please check your email."
      );
      setRefresh((r) => r + 1);
    } else {
      console.log("No user found");
    }
  };
  const handleResendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setStatus("Verification email sent!");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col justify-center items-center px-8">
        <h1 className="text-[#1976D2] font-bold text-2xl">Profile</h1>
        <div className="flex flex-col w-full justify-center items-center sm:max-w-[512px]">
          <p className="text-2xl w-full text-left">
            Welcome to your profile page{" "}
            {userInfo?.username ? userInfo.username : userInfo?.email}
          </p>
          <p className="text-2xl py-8 w-full text-left">
            Followers: {followerCount}
          </p>
          <p className="text-2xl pb-8">
            Scroll down to browse all your uploaded images, albums, add custom
            names, edit and delete.
          </p>
          {!userInfo?.emailVerified && (
            <div className="flex flex-col justify-start items-center w-full">
              <p className="text-2xl w-full text-left">
                Please verify to complete your account.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  variant="outlined"
                  onClick={handleCheckVerification}
                  sx={{ width: "100%", color: "#E38724" }}
                >
                  I have verified my email
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResendVerification}
                  sx={{ width: "100%", color: "#E38724" }}
                >
                  Please resend verification
                </Button>
                <p className="text-xl font-bold">
                  Remember to check your spam inbox.
                </p>
              </div>

              <p>{status}</p>
            </div>
          )}
          <div className="flex flex-col gap-2 w-full sm:max-w-[512px]">
            <EditAccountDialog user={user} />
            <Button
              variant="outlined"
              color="error"
              onClick={() => signOut(auth)}
              sx={{ width: "100%" }}
            >
              Log out
            </Button>
          </div>
        </div>
        {!userInfo?.username && (
          <UsernameDialog user={user} userInfo={userInfo} />
        )}
        <div className="flex flex-col justify-center items-center gap-2 w-full sm:max-w-[512px] pt-4">
          <p className="text-2xl w-full text-left">
            Test out PicShare latest feature, <strong>Albums!</strong> <br />
            Gather all your favorite pictures in an album.
          </p>
          {images.length > 0 && <CreateAlbumDialog user={user} />}
        </div>
        <p className="text-[#1976D2] text-2xl w-full text-left font-bold mt-8 mb-4">
          Your Albums
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
          {albums.map((album) => (
            <AlbumImageCard
              key={album.id}
              title={album.title}
              albumId={album.id}
              imageId={album.images[0].imageId}
              createdAt={album.createdAt}
              showUser={false}
            />
          ))}
        </div>
        <p className="text-[#1976D2] text-2xl w-full text-left font-bold mt-8 mb-4">
          Your Images
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
          {images.map((image) => (
            <ProfileImageCard key={image.id} image={image} />
          ))}
        </div>
      </div>
    </>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
};

export default ProfilePage;
