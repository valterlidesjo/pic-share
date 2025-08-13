// src/components/UsernameDialog.tsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsernameDialog = ({ user, userInfo }: { user: any; userInfo: any }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  const handleAddUsername = async () => {
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { username });
      setUsernameMessage(`Username added successfully: ${username}`);
    } catch (error) {
      setUsernameMessage(`Error adding username`);
    }
  };

  if (userInfo?.username) return <p>Email: {userInfo.email}</p>;

  return (
    <>
      <p className="text-2xl pb-2 pt-8">
        Do you want to add a username to your account?
      </p>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", color: "#E38724" }}
      >
        Add username
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Add a username to your profile"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Adding a username to your profile will allow you to be recognized by
            other users. You can also change your username later if you want.{" "}
            <br />
            Without a username your email will be displayed instead.
          </DialogContentText>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Don't add
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
              handleAddUsername();
            }}
          >
            Add username
          </Button>
        </DialogActions>
      </Dialog>
      {usernameMessage && <p>{usernameMessage}</p>}
    </>
  );
};

export default UsernameDialog;
