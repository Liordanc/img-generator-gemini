import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
// import { prisma } from '@/lib/db';

// GET /api/artifacts
export async function GET(req: NextRequest) {
  // In a real app, you'd fetch from the DB
  // const artifacts = await prisma.artifact.findMany({ orderBy: { createdAt: 'desc' } });
  const mockArtifacts = [
      { id: '1', type: 'image', url: '/placeholder.png', prompt: 'A placeholder image', createdAt: new Date().toISOString() },
  ];
  return NextResponse.json(mockArtifacts);
}

// POST /api/artifacts
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, sourceArtifact } = body;

        if (action === 'duplicate' && sourceArtifact) {
            // Basic validation
            if (!sourceArtifact.id || !sourceArtifact.url) {
                return NextResponse.json({ error: 'Invalid source artifact data' }, { status: 400 });
            }

            const newArtifact = {
                ...sourceArtifact,
                id: randomUUID(),
                jobId: randomUUID(),
                parentId: sourceArtifact.id, // The new artifact is a child of the source
                createdAt: new Date().toISOString(),
            };

            console.log(`[API] Duplicated artifact ${sourceArtifact.id} into new artifact ${newArtifact.id}`);
            return NextResponse.json(newArtifact);
        }
        
        return NextResponse.json({ error: 'Invalid action or missing data' }, { status: 400 });

    } catch (error) {
        console.error('[API Artifacts POST Error]', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `API Error: ${errorMessage}` }, { status: 500 });
    }
}