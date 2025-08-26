import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useCheckFollowerCount from "@/hooks/followers/useCheckFollowerCount";
import useGetFollowers from "@/hooks/followers/useGetFollowers";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Followers = () => {
  const [open, setOpen] = useState(false);

  const { user, loading } = useAuthGuard();
  const { followerCount } = useCheckFollowerCount(user?.uid);
  const { followers } = useGetFollowers(user?.uid);

  const router = useRouter();

  if (loading)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <div className="flex py-8 w-full justify-start items-center">
        <Button
          variant="text"
          sx={{ fontSize: "1rem" }}
          onClick={() => setOpen(true)}
        >
          Followers:
        </Button>
        <p className="text-xl">{followerCount}</p>
      </div>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Your followers"}</DialogTitle>
        <DialogContent>
          <p className="text-xs text-gray-500 mb-4">
            Click on a user to see their page
          </p>
          {followers?.map((follower) => (
            // <div >
            <div
              className="flex flex-col justify-center items-start cursor-pointer pr-2 mb-2"
              onClick={() => router.push(`/users/${follower.followedId}`)}
              key={follower.id}
            >
              {follower.followerUserUsername ? (
                <p className="font-bold">{follower.followerUserUsername}</p>
              ) : (
                <p className="font-bold text-xs">User has no username</p>
              )}
              <p className="text-xs">{follower.followerUserEmail}</p>
            </div>
            // </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Followers;
