import { model } from "@/firebaseConfig";
import { Part } from "firebase/ai";

async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString().split(",")[1]);
      } else {
        resolve("");
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function runCategoryPrompt() {
  const imageInput = document.getElementById("promt-input");
  if (imageInput instanceof HTMLInputElement) {
    if (imageInput.files) {
      const file = imageInput.files[0];
      if (file) {
        const imagePart = await fileToGenerativePart(file);
        const prompt =
          "Check the image and give it a category. The categories you can choose from is 'friends and family', 'food and drinks', 'sports', 'work and tech', 'travel and vacation', 'animals', 'nature', 'hobbies', 'events and celebrations', 'art and architecture'. Answer with only the word of the category you have choosen.";
        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();
        return text;
      } else {
        console.log("No files choosen");
        return null;
      }
    }
  } else {
    console.error(
      "Elementet med ID 'promt-input' hittades inte eller är inte ett input-element."
    );
    return null;
  }
}
