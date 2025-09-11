import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { Messages } from "@/hooks/messages/useGetMessages";
import { formatDateRelative } from "@/utils/formatDateRelative";

export const PrivateMessageItem = ({ message }: { message: Messages }) => {
  const { user } = useAuthGuard();

  const isSentByCurrentUser = message.from === user?.uid;

  return (
    <div
      key={message.id}
      className={`flex w-full items-center my-2 ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow break-words ${
          isSentByCurrentUser
            ? "bg-blue-500 text-white ml-auto rounded-br-none"
            : "bg-gray-200 text-gray-800 mr-auto rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words whitespace-normal">
          {message.message}
        </p>
        <div className="text-xs text-right mt-1 opacity-75">
          {formatDateRelative(message.createdAt)}
          {/* {message.createdAt.toLocaleDateString("sv-SE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          {message.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} */}
        </div>
      </div>
    </div>
  );
};
