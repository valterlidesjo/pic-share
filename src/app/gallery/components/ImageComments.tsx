import { Comment } from "@/hooks/comments/useGetComments";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import CommentItem from "./CommentItem";
import { useState } from "react";

export const ImageComments = ({
  comments,
  imageId,
}: {
  comments: Comment[];
  imageId: string;
}) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const { user } = useAuthGuard();

  const commentsToDisplay = isShowMore ? comments : comments.slice(0, 2);
  const hasMoreThanTwoComments = comments.length > 2;

  return (
    <div className="w-full py-4">
      {comments.length === 0 ? (
        <p>No comment on this one, be the first one to comment!</p>
      ) : (
        <>
          {commentsToDisplay.map((comment) => (
            <CommentItem
              comment={comment}
              userId={user?.uid}
              key={comment.id}
              imageId={imageId}
            />
          ))}
          {hasMoreThanTwoComments && (
            <div className="flex justify-start items-center">
              <p
                className="text-s text-gray-700"
                onClick={() => setIsShowMore(!isShowMore)}
              >
                {isShowMore ? "Hide comments" : "Show all comments"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
