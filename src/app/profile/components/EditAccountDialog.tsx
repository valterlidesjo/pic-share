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
import { User as UserProps } from "firebase/auth";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditAccountDialog = ({
  user,
}: {
  user: UserProps | null | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);

  const handleEditUsername = async () => {
    if (!user?.uid) return;

    try {
      await updateDoc(doc(db, "users", user.uid), { username: newUsername });
      setUsernameMessage(`Username edited to ${newUsername} successfully!`);
    } catch (error) {
      console.error("Error editing username: ", error);
      setUsernameMessage(`Error editing username`);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ width: "100%", color: "#E38724" }}
      >
        Edit Account
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Edit the username of your profile"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            A username is a perfect way to uniquify your account.
            <br />
            Here you can edit your username.
          </DialogContentText>
          <TextField
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Don&apos;t edit
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOpen(false);
              handleEditUsername();
            }}
          >
            Edit username
          </Button>
        </DialogActions>
      </Dialog>
      {usernameMessage && <p>{usernameMessage}</p>}
    </>
  );
};

export default EditAccountDialog;
