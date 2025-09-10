import fs from 'fs/promises';
import path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), 'public', 'artifacts');
const DATA_DIR = path.join(process.cwd(), 'artifacts', 'data');

/**
 * Ensures that a directory exists, creating it if necessary.
 * NOTE: In a real environment, this would run. In a simulated one, it's a no-op.
 */
const ensureDirExists = async (dirPath: string) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // In a read-only environment, this will fail. We'll proceed as if it exists.
    console.log(`Could not create directory ${dirPath}, assuming it exists.`);
  }
};

/**
 * Saves a Base64 encoded image to the public artifacts directory.
 * NOTE: This is a simulation. It does not actually write to the file system
 * in this restricted environment but returns the path where the file would be.
 * @param base64Data The Base64 string of the image (without the data:image/png;base64, prefix).
 * @param jobId The unique ID of the image job.
 * @returns The public URL path to the saved image.
 */
export async function saveImageFromBase64(base64Data: string, jobId: string): Promise<string> {
  await ensureDirExists(ARTIFACTS_DIR);
  const filePath = path.join(ARTIFACTS_DIR, `${jobId}.png`);
  const publicUrl = `/artifacts/${jobId}.png`;

  console.log(`[Storage] Simulating save of image to: ${filePath}`);
  // In a real Node.js environment, you would uncomment the following line:
  // await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
  
  return publicUrl;
}

/**
 * Persists in-memory data to a JSON file as a fallback mechanism.
 * @param filename The name of the JSON file (e.g., 'artifacts.json').
 * @param data The javascript object to serialize.
 */
export async function persistDataToJson(filename: string, data: any): Promise<void> {
    await ensureDirExists(DATA_DIR);
    const filePath = path.join(DATA_DIR, filename);
    console.log(`[Storage] Simulating persistence of data to: ${filePath}`);
    // In a real Node.js environment, you would uncomment the following line:
    // await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
