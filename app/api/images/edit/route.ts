import { NextRequest, NextResponse } from 'next/server';
import { editImageSchema } from '@/lib/validators';
import { editImage } from '@/lib/gemini';
import { saveImageFromBase64 } from '@/lib/storage';
// import { prisma } from '@/lib/db'; // In a real scenario, you'd use Prisma
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = editImageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { prompt, imageDataUrl } = validation.data;
    const jobId = randomUUID();
    const parentArtifactId = body.parentArtifactId; // Not in schema, but passed for history

    // --- Mock DB Interaction ---
    console.log(`[API] Creating mock ImageJob (ID: ${jobId}) for editing.`);
    
    const { text, imageBase64 } = await editImage(prompt, imageDataUrl);
    
    const imageUrl = await saveImageFromBase64(imageBase64, jobId);

    // --- Mock DB Interaction: Link to parent artifact ---
     console.log(`[API] Updating mock ImageJob (ID: ${jobId}), linking to parent: ${parentArtifactId}`);


    const artifactData = {
        id: randomUUID(),
        type: 'image' as const,
        url: imageUrl,
        prompt: prompt, // The edit prompt
        text: text, // Text response from Gemini
        createdAt: new Date().toISOString(),
        jobId: jobId,
        parentId: parentArtifactId
    };

    return NextResponse.json(artifactData);

  } catch (error) {
    console.error('[API Edit Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `API Error: ${errorMessage}` }, { status: 500 });
  }
}
