'use client';

import ArtifactsPanel from '@/components/ArtifactsPanel';
import ChatPanel from '@/components/ChatPanel';
import ErrorToast from '@/components/ErrorToast';
import { useState } from 'react';
import type { Artifact } from '@/lib/types';


export default function Home() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleNewArtifact = (artifact: Artifact) => {
    setArtifacts(prev => [artifact, ...prev]);
    setSelectedArtifact(artifact);
  };
  
  const handleError = (message: string) => {
    setGlobalError(message);
    setTimeout(() => {
        setGlobalError(null);
    }, 5000); // Auto-dismiss after 5 seconds
  };

  return (
    <main className="flex h-screen w-full bg-gray-900 text-white font-sans">
      {/* Main Panel: Artifacts Display (now on the left) */}
      <div className="hidden lg:flex flex-col w-2/3 h-screen">
        <ArtifactsPanel 
          artifacts={artifacts}
          selectedArtifact={selectedArtifact}
          onSelectArtifact={setSelectedArtifact}
          onNewArtifact={handleNewArtifact}
          onError={handleError}
        />
      </div>

      {/* Sidebar: Chat Interface (now on the right) */}
      <div className="flex flex-col w-full lg:w-1/3 border-l border-gray-700 h-screen">
        <ChatPanel 
          onNewArtifact={handleNewArtifact}
          selectedImage={selectedArtifact?.url || null}
          onError={handleError}
        />
      </div>
      
      <ErrorToast message={globalError} onDismiss={() => setGlobalError(null)} />
    </main>
  );
}