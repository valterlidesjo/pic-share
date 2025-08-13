import { Comment } from "@/hooks/useGetComments";

export const ImageComments = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="w-full py-4">
      {comments.length === 0 ? (
        <p>No comment on this one, be the first one to comment!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="mb-2">
            <p className="text-s text-black">{comment.text}</p>
            <p className="text-s text-gray-500">{comment.email}</p>
            <p className="text-s text-gray-500">
              {comment.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
