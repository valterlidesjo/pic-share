import { CommentComment } from "@/hooks/comments/useGetCommentComments";

export const CommentAnswerItem = ({
  commentsComment,
}: {
  commentsComment: CommentComment;
}) => {
  return (
    <div
      key={commentsComment.id}
      className="mb-4 w-full flex flex-col justify-start items-start"
    >
      <div className="w-full flex justify-start items-start">
        <div className="flex flex-col justify-center items-start gap-2 pb-2">
          <p className="text-s text-black">{commentsComment.text}</p>
          <p className="text-s text-gray-500">{commentsComment.email}</p>
          <p className="text-s text-gray-500">
            {commentsComment.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
