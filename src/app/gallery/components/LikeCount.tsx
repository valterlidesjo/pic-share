import useCheckLikeCount from "@/hooks/useCheckLikeCount";
import React, { useEffect, useState } from "react";

export const LikeCount = ({ imageId }: { imageId: string }) => {
  const [plural, setPlural] = useState(false);
  const { likeCount } = useCheckLikeCount(imageId);

  useEffect(() => {
    if (likeCount !== null && likeCount > 1) {
      setPlural(true);
    }
  }, [imageId, likeCount]);

  return (
    <p className="text-xs text-gray-500">
      {likeCount !== null
        ? `${likeCount} ${plural ? "likes" : "like"}`
        : "Loading..."}
    </p>
  );
};
