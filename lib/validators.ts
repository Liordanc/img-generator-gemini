import { z } from 'zod';

// Schema for generating a new image
export const generateImageSchema = z.object({
  prompt: z.string().min(3, { message: "Prompt must be at least 3 characters long." }),
  mode: z.string().optional(), // e.g., 'tech_infographics'
});

// Schema for editing an existing image
export const editImageSchema = z.object({
  prompt: z.string().min(3, { message: "Prompt must be at least 3 characters long." }),
  // Expecting a Data URL for the image
  imageDataUrl: z.string().startsWith('data:image/', { message: "Invalid image data URL format." }),
  mode: z.string().optional(),
});


// Schema for creating a new artifact manually (e.g., uploading)
export const createArtifactSchema = z.object({
    type: z.enum(["image", "text"]),
    url: z.string().url(),
    metadata: z.record(z.any()).optional(),
});

// Schema for updating an artifact (e.g., adding metadata)
export const updateArtifactSchema = z.object({
    metadata: z.record(z.any()).optional(),
});
