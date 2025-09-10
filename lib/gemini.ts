import { GoogleGenAI, Modality, Part } from '@google/genai';

if (!process.env.API_KEY) {
    throw new Error("Missing API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert a Data URL (e.g., from a canvas or file reader) to a Gemini Part
function dataUrlToGoogleGenerativeAI_Part(dataUrl: string): Part {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid Data URL format');
  }
  const mimeType = match[1];
  const base64Data = match[2];

  return {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };
}

/**
 * Generates a new image from a text prompt.
 * @param prompt The text prompt describing the image.
 * @returns A base64 encoded string of the generated PNG image.
 */
export async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1', // Default to 1024x1024
        },
    });

    if (!response.generatedImages?.[0]?.image?.imageBytes) {
        throw new Error('Image generation failed, no image data returned.');
    }
    return response.generatedImages[0].image.imageBytes;
}

/**
 * Edits an existing image based on a text prompt.
 * @param prompt The text prompt describing the edit.
 * @param imageDataUrl The Data URL of the image to edit.
 * @returns An object containing the new image's base64 data and any accompanying text.
 */
export async function editImage(prompt: string, imageDataUrl: string): Promise<{ text: string, imageBase64: string }> {
    const imagePart = dataUrlToGoogleGenerativeAI_Part(imageDataUrl);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
      
    let textResponse = '';
    let imageBase64 = '';

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse = part.text;
      } else if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    if (!imageBase64) {
        throw new Error('Image edit failed, no image data returned.');
    }

    return { text: textResponse, imageBase64 };
}
