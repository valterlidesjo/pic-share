import { Album } from "@/hooks/albums/useGetAlbums";

export const extractAlbumIdIntoArray = (albums: Album[]) => {
  const imageIdList: string[] = [];
  albums.map((album) => {
    album.images.map((image) => {
      imageIdList.push(image.imageId);
    });
  });
  return imageIdList;
};
