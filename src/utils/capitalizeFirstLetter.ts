export function capitalizeFirstLetter(str: string | null | undefined): string {
  // Kontrollera att strängen är giltig
  if (!str || typeof str !== "string" || str.length === 0) {
    return "";
  }

  // Ta den första bokstaven, gör den stor, och lägg till resten av strängen.
  return str.charAt(0).toUpperCase() + str.slice(1);
}
