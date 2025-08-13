export const formatFileNameForDisplay = (fileName: string): string => {
  if (!fileName) {
    return "";
  }

  const lastDotIndex = fileName.lastIndexOf(".");

  let nameWithoutExtension = fileName;
  if (lastDotIndex > 0) {
    nameWithoutExtension = fileName.substring(0, lastDotIndex);
  }

  if (nameWithoutExtension.length === 0) {
    return "";
  }

  return (
    nameWithoutExtension.charAt(0).toUpperCase() + nameWithoutExtension.slice(1)
  );
};
