import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { Messages } from "@/hooks/messages/useGetMessages";
import { CircularProgress } from "@mui/material";

export const PrivateMessageItem = ({ message }: { message: Messages }) => {
  const { user, loading: userLoading } = useAuthGuard();

  const isSentByCurrentUser = message.from === user?.uid;

  if (userLoading) {
    return (
      <div className="w-full flex justify-center items-center pt-4 mt-[60px]">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div
      key={message.id}
      className={`flex w-full my-2 ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow ${
          isSentByCurrentUser
            ? "bg-blue-500 text-white ml-auto rounded-br-none"
            : "bg-gray-200 text-gray-800 mr-auto rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words">{message.message}</p>
        <div className="text-xs text-right mt-1 opacity-75">
          {message.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
