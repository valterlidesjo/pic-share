import { Album } from "@/hooks/useGetAlbums";

export const extractIdIntoArray = (albums: Album[]) => {
  const imageIdList: string[] = [];
  albums.map((album) => {
    album.images.map((image) => {
      imageIdList.push(image.imageId);
    });
  });
  return imageIdList;
};
