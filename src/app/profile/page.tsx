"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import useGetUserInfo from "@/hooks/users/useGetUserInfo";
import UsernameDialog from "@/app/profile/components/UsernameDialog";
import ProfileImageCard from "@/app/profile/components/ProfileImageCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { checkAndUpdateEmailVerified } from "@/utils/verifyEmailAndUpdate";
import { useGetPersonalImages } from "@/hooks/images/useGetOwnImages";
import useCheckFollowerCount from "@/hooks/followers/useCheckFollowerCount";
import EditAccountDialog from "./components/EditAccountDialog";
import CreateAlbumDialog from "./components/CreateAlbumDialog";
import { useGetAlbums } from "@/hooks/albums/useGetAlbums";
import AlbumImageCard from "./components/AlbumImageCard";
import { deleteAccount } from "@/utils/deleteAccount";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { user, loading } = useAuthGuard();
  const { userInfo, loading: userInfoLoading } = useGetUserInfo();
  const [status, setStatus] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { images } = useGetPersonalImages(user?.uid);
  const { followerCount } = useCheckFollowerCount(user?.uid);
  const { albums, loading: albumLoading } = useGetAlbums(user?.uid);
  const router = useRouter();

  const handleCheckVerification = async () => {
    if (user?.uid) {
      const updated = await checkAndUpdateEmailVerified(user?.uid);
      setStatus(
        updated
          ? "Email verified!"
          : "Still not verified. Please check your email."
      );
    } else {
      console.error("No user found");
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setStatus("Verification email sent!");
    }
  };

  if (loading || userInfoLoading || albumLoading)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );

  return (
    <>
      <div className="flex flex-col justify-center items-center px-8 mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl">Profile</h1>
        <div className="flex flex-col w-full justify-center items-center sm:max-w-[512px]">
          <p className="text-2xl w-full text-left">
            Welcome to your profile page,{" "}
            <strong>
              {userInfo?.username ? userInfo.username : userInfo?.email}
            </strong>
          </p>
          <div className="flex w-full justify-start items-center">
            <div className="flex py-8 w-full justify-start items-center">
              <Button variant="text" sx={{ fontSize: "1rem" }}>
                Followers:
              </Button>
              <p className="text-xl">{followerCount}</p>
            </div>
            <div className="flex py-8 w-full justify-start items-center">
              <Button variant="text" sx={{ fontSize: "1rem" }}>
                Follows:
              </Button>
              <p className="text-xl">{followerCount}</p>
            </div>
          </div>

          {!userInfo?.emailVerified && (
            <div className="flex flex-col justify-start items-center w-full mb-8">
              <p className="text-md w-full text-left">
                Please verify to complete your account, remember to check your
                spam inbox.
              </p>
              <div className="flex justify-between items-center gap-2 w-full mt-2">
                <Button
                  variant="outlined"
                  onClick={handleCheckVerification}
                  sx={{ width: "50%", color: "#E38724", fontSize: "0.7rem" }}
                >
                  I have verified my email
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResendVerification}
                  sx={{ width: "50%", color: "#E38724", fontSize: "0.7rem" }}
                >
                  Please resend verification
                </Button>
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
            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsDeleting(true)}
              sx={{ width: "100%" }}
            >
              Delete account
            </Button>
            {isDeleting && (
              <div className="flex gap-2 w-full sm:max-w-[512px]">
                <p>
                  Are you sure you want to delete your account? All you images,
                  albums and comments will disappear.
                </p>
                <DeleteForeverIcon
                  className="text-red-500 cursor-pointer"
                  onClick={async () => {
                    await deleteAccount(user?.uid);
                    await signOut(auth);
                    router.push("/sign-up");
                  }}
                />
                <CancelIcon
                  className="cursor-pointer"
                  onClick={() => setIsDeleting(false)}
                />
              </div>
            )}
          </div>
        </div>
        {!userInfo?.username && (
          <div className="flex flex-col justify-center items-center gap-2 w-full sm:max-w-[512px] pt-4">
            <UsernameDialog user={user} userInfo={userInfo} />
          </div>
        )}
        <div className="flex flex-col justify-center items-center gap-2 w-full sm:max-w-[512px] pt-4">
          {images.length > 0 && (
            <>
              <p className="text-2xl w-full text-left">
                Test out PicShare latest feature, <strong>Albums!</strong>{" "}
                <br />
                Gather all your favorite pictures in an album.
              </p>{" "}
              <CreateAlbumDialog user={user} />
            </>
          )}
        </div>
        {images.length > 0 && (
          <>
            <p className="text-[#1976D2] text-2xl w-full text-left font-bold mt-8 mb-4 max-w-5xl">
              Your Albums
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
              {albums.map((album) => (
                <AlbumImageCard
                  key={album.id}
                  album={album}
                  showUser={false}
                  showEdit={true}
                />
              ))}
            </div>
            <p className="text-[#1976D2] text-2xl w-full text-left font-bold mt-8 mb-4 max-w-5xl">
              Your Images
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl pb-8">
              {images.map((image) => (
                <ProfileImageCard key={image.id} image={image} />
              ))}
            </div>
          </>
        )}
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
