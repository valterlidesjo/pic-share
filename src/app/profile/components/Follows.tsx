import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useGetFollowedUsers from "@/hooks/followers/useGetFollowedUsers";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useState } from "react";
import FollowsItem from "./FollowsItem";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Follows = () => {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuthGuard();
  const { followedUsers } = useGetFollowedUsers(user?.uid);

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
          Follows:
        </Button>
        <p className="text-xl">{followedUsers?.length}</p>
      </div>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {"Your follows"}
        </DialogTitle>
        <DialogContent>
          <p className="text-xs text-gray-500 mb-4">
            Click on a user to see their page
          </p>
          {followedUsers?.map((follow) => (
            <FollowsItem follow={follow} key={follow.id} />
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

export default Follows;
