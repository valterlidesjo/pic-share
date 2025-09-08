// src/components/UsernameDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TransitionProps } from "@mui/material/transitions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useGetAllConversations } from "@/hooks/messages/useGetAllConversations";
import useGetFollowedUsers from "@/hooks/followers/useGetFollowedUsers";
import { FirestoreUser } from "@/hooks/users/useGetUser";
import { User } from "@/hooks/users/useGetVerifiedUsers";
import { followUser } from "@/utils/followUser";
import { useRouter } from "next/navigation";

const Transition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewConversationDialog = ({ userId }: { userId: string | undefined }) => {
  const [open, setOpen] = useState(false);
  const [usersToFollowBack, setUsersToFollowBack] = useState<User[]>([]);
  const { conversations } = useGetAllConversations(userId);
  const { followedUsers } = useGetFollowedUsers(userId);
  const router = useRouter();

  useEffect(() => {
    const fetchUsersToFollowBack = async () => {
      if (!conversations || !followedUsers) {
        return;
      }

      const followingIds = new Set(
        followedUsers.map((follow) => follow.followedId)
      );

      const incompleteConversations = conversations.filter((conversation) => {
        const otherUserIdInConversation = conversation.userIds.find(
          (uid) => uid !== userId
        );
        return (
          otherUserIdInConversation &&
          !followingIds.has(otherUserIdInConversation)
        );
      });

      const userIdsToFollowBack = incompleteConversations
        .map((conversation) =>
          conversation.userIds.find((uid) => uid !== userId)
        )
        .filter((id): id is string => typeof id === "string");

      const usersDataPromises = userIdsToFollowBack.map(
        async (userToFollowBackId) => {
          const docRef = doc(db, "users", userToFollowBackId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as FirestoreUser;
            const createdAtDate = data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date();
            return {
              userId: data.userId,
              createdAt: createdAtDate,
              emailVerified: data.emailVerified,
              email: data.email,
              username: data.username,
            };
          }
          return null;
        }
      );

      const fetchedUsers = await Promise.all(usersDataPromises);
      const validUsers = fetchedUsers.filter((user) => user !== null);
      setUsersToFollowBack(validUsers);
    };

    fetchUsersToFollowBack();
  }, [conversations, followedUsers, userId]);

  const handleFollowClick = async (userToFollow: string) => {
    await followUser(userId, userToFollow);
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        <PersonAddIcon />
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"New conversation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This is where new conversations from users you don&apos;t already
            follow will appear. In order to start the conversation you have to
            start to follow the user aswell.
            <br />
            If you want to find more friends to start conversations with you can
            find them at{" "}
            <Button onClick={() => router.push("/users")} sx={{ padding: "0" }}>
              Users
            </Button>
          </DialogContentText>
          {usersToFollowBack.length > 0 ? (
            <ul>
              {usersToFollowBack.map((user) => (
                <li
                  key={user.userId}
                  className="flex justify-start items-center w-full"
                >
                  <p className="mr-4">
                    {user.username ? user.username : user.email}
                  </p>
                  <Button
                    variant="outlined"
                    onClick={() => handleFollowClick(user.userId)}
                  >
                    Follow
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4">You have no conversation requests.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewConversationDialog;
