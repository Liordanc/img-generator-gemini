import { NextRequest, NextResponse } from 'next/server';
import { generateImageSchema } from '@/lib/validators';
import { generateImage } from '@/lib/gemini';
import { saveImageFromBase64 } from '@/lib/storage';
// import { prisma } from '@/lib/db'; // In a real scenario, you'd use Prisma
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = generateImageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { prompt } = validation.data;
    const jobId = randomUUID();

    // --- Mock DB Interaction: Create ImageJob & Artifact records ---
    console.log(`[API] Creating mock ImageJob (ID: ${jobId}) for prompt: "${prompt}"`);
    // const job = await prisma.imageJob.create({ ... });
    // const artifact = await prisma.artifact.create({ ... });

    const imageBase64 = await generateImage(prompt);
    
    const imageUrl = await saveImageFromBase64(imageBase64, jobId);

    // --- Mock DB Interaction: Update records with status and URL ---
    console.log(`[API] Updating mock ImageJob (ID: ${jobId}) with status 'completed' and URL: ${imageUrl}`);

    const artifactData = {
        id: randomUUID(),
        type: 'image' as const,
        url: imageUrl,
        prompt: prompt,
        createdAt: new Date().toISOString(),
        jobId: jobId
    };

    return NextResponse.json(artifactData);

  } catch (error) {
    console.error('[API Generate Error]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `API Error: ${errorMessage}` }, { status: 500 });
  }
}
