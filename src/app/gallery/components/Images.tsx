import { Image as ImageProp } from "@/hooks/useGetAllImages";
import { formatFileNameForDisplay } from "@/utils/formatFileName";
import { CommentCount } from "./CommentCount";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LikeCount } from "./LikeCount";

export const Images = ({
  images,
  showComments,
  showLikes,
}: {
  images: ImageProp[];
  showComments: boolean;
  showLikes: boolean;
}) => {
  const router = useRouter();
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl px-8 cursor-pointer">
        {images.map((image) => (
          <div
            key={image.id}
            className="border p-2 rounded-lg shadow-md mb-8"
            onClick={() => router.push(`/gallery/${image.id}`)}
          >
            <div className="relative w-full h-48 mb-2">
              <Image
                src={image.imageUrl}
                alt={image.fileName || "Galleri Bild"}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <p className="text-sm font-semibold truncate">
              {formatFileNameForDisplay(image.fileName)}
            </p>
            {showLikes && <LikeCount imageId={image.id} />}
            {showComments && <CommentCount imageId={image.id} />}
            <p className="text-xs text-gray-500">
              Uploaded: {image.uploadedAt.toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Image by user: {image.username || image.email || "Ghost user"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
