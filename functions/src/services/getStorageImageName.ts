export const getStorageImageName = (imageURL: string): string | null => {
  try {
    const url = new URL(imageURL);
    const oIndex = url.pathname.indexOf("/o/");
    if (oIndex === -1) {
      console.error("Invalid image URL format, '/o/' not found:", imageURL);
      return null;
    }
    const pathWithEncodedSlashes = url.pathname.substring(oIndex + 3);
    const decodedPath = decodeURIComponent(pathWithEncodedSlashes);
    return decodedPath;
  } catch (error) {
    console.error("Error parsing image URL:", error);
    return null;
  }
};
