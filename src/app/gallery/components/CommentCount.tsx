import React, { useEffect, useState } from "react";
import { getCommentCount } from "@/utils/getCommentCount";

export const CommentCount = ({ imageId }: { imageId: string }) => {
  const [count, setCount] = useState<number | null>(null);
  const [plural, setPlural] = useState(false);

  useEffect(() => {
    getCommentCount(imageId).then(setCount);
    if (count !== null && count > 1) {
      setPlural(true);
    }
  }, [imageId, count]);

  return (
    <p className="text-xs text-gray-500">
      {count !== null
        ? `${count} ${plural ? "comments" : "comment"}`
        : "Loading..."}
    </p>
  );
};
