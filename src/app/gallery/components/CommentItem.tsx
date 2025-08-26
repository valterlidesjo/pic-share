import useCheckCommentLikeCount from "@/hooks/comments/useCheckCommentLikeCount";
import { Comment } from "@/hooks/comments/useGetComments";
import { likeComment } from "@/utils/likeComment";
import { removeCommentLike } from "@/utils/removeCommentLike";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useMemo, useState } from "react";
import { useGetCommentLikes } from "@/hooks/comments/useGetCommentLikes";
import { extractUserIdIntoArray } from "@/utils/extractUserIdToArray";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { addCommentToComment } from "@/utils/addCommentToComment";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import useCheckCommentCommentCount from "@/hooks/comments/useCheckCommentCommentCount";
import { CommentAnswerItem } from "./CommentAnswerItem";
import useGetCommentComments from "@/hooks/comments/useGetCommentComments";
import { deleteComment } from "@/utils/deleteComment";

const CommentItem = ({
  comment,
  userId,
  imageId,
}: {
  comment: Comment;
  userId: string | undefined;
  imageId: string;
}) => {
  const [usersThatLiked, setUsersThatLiked] = useState<string[]>([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isOwnComment, setIsOwnComment] = useState(false);

  const [commentComment, setCommentComment] = useState("");
  const [isAnswersShowing, setIsAnswersShowing] = useState(false);
  const { commentLikeCount } = useCheckCommentLikeCount(comment.id);
  const { commentCommentCount } = useCheckCommentCommentCount(
    comment.id,
    imageId
  );
  const { commentLikes } = useGetCommentLikes(comment.id);
  const { commentComments } = useGetCommentComments(imageId, comment.id);
  const { user } = useAuthGuard();
  const userIdsList = useMemo(
    () => extractUserIdIntoArray(commentLikes),
    [commentLikes]
  );

  useEffect(() => {
    if (userIdsList.length > 0) {
      const imageIds = userIdsList.map((users) => users);
      setUsersThatLiked(imageIds);
    }
    if (user?.email === comment.email) {
      setIsOwnComment(true);
    }
  }, [userIdsList, comment.email, user?.email]);

  const handleCheckIfCommentIsLiked = (userId: string | undefined) => {
    if (!userId) {
      return;
    }
    if (usersThatLiked.includes(userId)) {
      setUsersThatLiked(usersThatLiked.filter((id) => id !== userId));
    } else {
      setUsersThatLiked([...usersThatLiked, userId]);
    }
  };
  if (!userId) {
    return;
  }
  const liked = usersThatLiked.includes(userId);

  return (
    <div
      key={comment.id}
      className="mb-4 w-full flex flex-col justify-start items-start border-b-black border-b-[1px]"
    >
      <div className="w-full flex justify-start items-start">
        <div className="flex flex-col justify-center items-start gap-2 pb-2">
          <p className="text-s text-black max-w-[150px] break-words sm:max-w-md">
            {comment.text}
          </p>
          <p className="text-s text-gray-500">{comment.email}</p>
          <p className="text-s text-gray-500">
            {comment.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-start justify-center h-[70px]">
          {liked ? (
            <>
              {isOwnComment && (
                <div
                  className="cursor-pointer"
                  onClick={() => deleteComment(comment.id, imageId)}
                >
                  <DeleteIcon />
                </div>
              )}

              <div
                onClick={() => {
                  handleCheckIfCommentIsLiked(userId);
                  removeCommentLike(userId, comment.id);
                }}
                className="cursor-pointer"
              >
                <FavoriteIcon sx={{ color: "red" }} />
              </div>
            </>
          ) : (
            <>
              {isOwnComment && (
                <div
                  className="cursor-pointer"
                  onClick={() => deleteComment(comment.id, imageId)}
                >
                  <DeleteIcon />
                </div>
              )}
              <div
                onClick={() => {
                  handleCheckIfCommentIsLiked(userId);
                  likeComment(userId, comment.id);
                }}
                className="cursor-pointer"
              >
                <FavoriteBorderIcon />
              </div>
            </>
          )}
        </div>
        {isCommenting ? (
          <div
            className="flex items-end justify-center h-[70px] cursor-pointer"
            onClick={() => setIsCommenting(false)}
          >
            <p>Cancel</p>
          </div>
        ) : (
          <div
            className="flex items-end justify-center h-[70px] cursor-pointer"
            onClick={() => setIsCommenting(true)}
          >
            <p>Answer</p>
          </div>
        )}

        <div className="flex items-start justify-center h-[70px]">
          <p className="text-[0.8rem] pr-0.5">{commentLikeCount}</p>
          <FavoriteIcon
            sx={{
              fontSize: "0.8rem",
              paddingTop: "2px",
              paddingRight: "5px",
              color: "red",
            }}
          />
        </div>
        <div className="flex items-start justify-center h-[70px]">
          <p className="text-[0.8rem] pr-0.5">{commentCommentCount}</p>
          <CommentIcon sx={{ fontSize: "0.8rem", paddingTop: "2px" }} />
        </div>
      </div>
      {isCommenting && (
        <div className="w-full flex justify-start items-center">
          <TextField
            label="Answer the comment"
            value={commentComment}
            onChange={(e) => setCommentComment(e.target.value)}
            sx={{ width: "75%" }}
          />
          <Button
            variant="outlined"
            sx={{ width: "25%", fontSize: "4.5rem", height: "56px" }}
            onClick={() => {
              addCommentToComment(
                imageId,
                comment.id,
                comment.userId,
                user?.email,
                commentComment
              );
              setCommentComment("");
            }}
          >
            <SendIcon />
          </Button>
        </div>
      )}
      {commentCommentCount != null && commentCommentCount > 0 && (
        <div className="w-full flex flex-col justify-center items-start pl-8">
          {!isAnswersShowing && (
            <p
              className="text-s text-gray-700"
              onClick={() => setIsAnswersShowing(true)}
            >
              Show {commentCommentCount} answer
            </p>
          )}

          {isAnswersShowing && (
            <>
              {commentComments.map((answer) => (
                <CommentAnswerItem commentsComment={answer} key={answer.id} />
              ))}
              <p onClick={() => setIsAnswersShowing(false)}>Hide answers</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
