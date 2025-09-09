"use client";
import React, { use, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { useGetConversation } from "@/hooks/messages/useGetConversation";
import { CircularProgress } from "@mui/material";
import { useGetMessages } from "@/hooks/messages/useGetMessages";
import { PrivateMessageItem } from "../components/PrivateMessageItem";
import useGetUser from "@/hooks/users/useGetUser";
import { useRouter } from "next/navigation";

interface PrivateMessagePageProps {
  params: Promise<{
    messageId: string;
  }>;
}

const PrivateMessage: React.FC<PrivateMessagePageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const { messageId } = resolvedParams;
  const [currentMessage, setCurrentMessage] = useState("");
  const { user, loading: userLoading } = useAuthGuard();
  const { conversation, loading } = useGetConversation(messageId);
  const toUserId = conversation?.userIds.find((id) => id !== user?.uid);
  const { messages, loading: messagesLoading } = useGetMessages(messageId);
  const { user: otherUser } = useGetUser(toUserId);
  const router = useRouter();

  const handleMessageSend = async () => {
    if (!currentMessage || !user?.uid || !toUserId) {
      console.error(
        "Could not send message, no message written, userId or toUserId."
      );
      return;
    }

    try {
      const messageCollectionRef = collection(
        db,
        "conversations",
        messageId,
        "messages"
      );

      await addDoc(messageCollectionRef, {
        message: currentMessage,
        from: user?.uid,
        to: toUserId,
        createdAt: serverTimestamp(),
      });

      setCurrentMessage("");
    } catch (error) {
      console.error("Error with message", error);
    }
  };

  if (loading || userLoading)
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-full h-[90vh] flex flex-col justify-between items-center px-8 mt-[60px]">
      <Button
        onClick={() => {
          router.push(`/users/${otherUser?.userId}`);
        }}
        sx={{ marginTop: "4rem", width: "100%" }}
      >
        <p className="text-[#1976D2] font-bold text-2xl break-words max-w-[calc(100%-2rem)]">
          {otherUser?.username ? otherUser.username : otherUser?.email}
        </p>
      </Button>

      {messagesLoading ? (
        <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col-reverse w-full overflow-y-auto h-screen p-4">
          {messages.map((message) => (
            <PrivateMessageItem message={message} key={message.id} />
          ))}
        </div>
      )}

      <div className="flex flex-col justify-center items-center w-full gap-1 mb-8">
        <TextField
          label="Write a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          sx={{ width: "100%" }}
        />
        <Button
          variant="contained"
          sx={{ width: "100%" }}
          onClick={handleMessageSend}
        >
          Send message
        </Button>
      </div>
    </div>
  );
};

export default PrivateMessage;
