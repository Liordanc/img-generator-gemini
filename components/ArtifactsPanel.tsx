'use client';

import { Artifact } from "@/lib/types";

interface ArtifactsPanelProps {
    artifacts: Artifact[];
    selectedArtifact: Artifact | null;
    onSelectArtifact: (artifact: Artifact | null) => void;
}

const ActionButton = ({ children }: { children: React.ReactNode }) => (
    <button className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
        {children}
    </button>
);


export default function ArtifactsPanel({ artifacts, selectedArtifact, onSelectArtifact }: ArtifactsPanelProps) {
    
    const currentArtifact = selectedArtifact || artifacts[0] || null;

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <header className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">Artifacts</h1>
                <p className="text-sm text-gray-400">Manage and refine your creations.</p>
            </header>

            {currentArtifact ? (
                <div className="flex-1 flex p-4 gap-4 overflow-y-auto">
                    {/* Main View */}
                    <div className="flex-1 flex flex-col items-center justify-center bg-black/20 rounded-lg p-4">
                        <img 
                            src={currentArtifact.url}
                            alt={currentArtifact.prompt}
                            className="max-w-full max-h-full object-contain rounded-md"
                        />
                    </div>
                    {/* Details & Actions Sidebar */}
                    <div className="w-72 flex-shrink-0 flex flex-col gap-4">
                         <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-bold mb-2">Details</h3>
                            <p className="text-sm text-gray-300 break-words"><strong>Prompt:</strong> {currentArtifact.prompt}</p>
                            <p className="text-xs text-gray-400 mt-2">ID: {currentArtifact.jobId}</p>
                            <p className="text-xs text-gray-400">Created: {new Date(currentArtifact.createdAt).toLocaleString()}</p>
                         </div>
                         <div className="bg-gray-800 p-4 rounded-lg">
                             <h3 className="font-bold mb-3">Actions</h3>
                             <div className="flex flex-wrap gap-2">
                                <ActionButton>Refine</ActionButton>
                                <ActionButton>Duplicate</ActionButton>
                                <ActionButton>Compare</ActionButton>
                                <ActionButton>Revert</ActionButton>
                             </div>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">No artifacts generated yet.</p>
                </div>
            )}


            <footer className="p-4 border-t border-gray-700 h-40 flex-shrink-0">
                <h3 className="font-bold mb-2">History</h3>
                <div className="flex gap-2 overflow-x-auto">
                    {artifacts.map(art => (
                        <div key={art.id} onClick={() => onSelectArtifact(art)} className={`cursor-pointer border-2 rounded-md p-1 ${selectedArtifact?.id === art.id ? 'border-blue-500' : 'border-transparent'}`}>
                            <img 
                                src={art.url}
                                alt={art.prompt}
                                className="w-24 h-24 object-cover rounded-sm"
                            />
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
}
