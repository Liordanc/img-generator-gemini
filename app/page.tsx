'use client';

import ArtifactsPanel from '@/components/ArtifactsPanel';
import ChatPanel from '@/components/ChatPanel';
import { useState } from 'react';
import type { Artifact } from '@/lib/types';


export default function Home() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const handleNewArtifact = (artifact: Artifact) => {
    setArtifacts(prev => [artifact, ...prev]);
    setSelectedArtifact(artifact);
  };
  
  return (
    <main className="flex h-screen w-full bg-gray-900 text-white font-sans">
      {/* Left Panel: Chat Interface */}
      <div className="flex flex-col w-full lg:w-1/3 border-r border-gray-700 h-screen">
        <ChatPanel 
          onNewArtifact={handleNewArtifact}
          selectedImage={selectedArtifact?.imageUrl || null}
        />
      </div>

      {/* Right Panel: Artifacts Display */}
      <div className="hidden lg:flex flex-col w-2/3 h-screen">
        <ArtifactsPanel 
          artifacts={artifacts}
          selectedArtifact={selectedArtifact}
          onSelectArtifact={setSelectedArtifact}
        />
      </div>
    </main>
  );
}
