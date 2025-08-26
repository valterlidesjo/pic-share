import { CommentLikes } from "@/hooks/comments/useGetCommentLikes";

export const extractUserIdIntoArray = (comments: CommentLikes[]) => {
  const commentIdList: string[] = [];
  comments.map((comment) => {
    commentIdList.push(comment.userId);
  });
  return commentIdList;
};
