'use client';

import { Artifact } from "@/lib/types";
import { useState } from "react";
import HistoryTimeline from "./HistoryTimeline";

interface ArtifactsPanelProps {
    artifacts: Artifact[];
    selectedArtifact: Artifact | null;
    onSelectArtifact: (artifact: Artifact | null) => void;
    onNewArtifact: (artifact: Artifact) => void;
    onError: (message: string) => void;
}

const ActionButton = ({ children, ...props }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button 
        {...props}
        className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);


export default function ArtifactsPanel({ artifacts, selectedArtifact, onSelectArtifact, onNewArtifact, onError }: ArtifactsPanelProps) {
    
    const [isActionLoading, setIsActionLoading] = useState(false);
    const currentArtifact = selectedArtifact || artifacts[0] || null;

    const handleDuplicateOrRevert = async () => {
        if (!currentArtifact || isActionLoading) return;
        
        setIsActionLoading(true);

        try {
            const response = await fetch('/api/artifacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'duplicate',
                    sourceArtifact: currentArtifact,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'פעולה נכשלה');
            }

            const newArtifact: Artifact = await response.json();
            onNewArtifact(newArtifact);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };
    
    const handleCompare = () => {
        if (!currentArtifact?.parentId) return;
        const parentArtifact = artifacts.find(art => art.id === currentArtifact.parentId);
        if (parentArtifact) {
            onSelectArtifact(parentArtifact);
        } else {
             onError('תוצר מקור לא נמצא בהיסטוריה הנוכחית.');
        }
    };


    return (
        <div className="flex flex-col h-full bg-gray-900">
            <header className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">תוצרים</h1>
                <p className="text-sm text-gray-400">נהל ושפר את היצירות שלך.</p>
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
                            <h3 className="font-bold mb-2">פרטים</h3>
                            <p className="text-sm text-gray-300 break-words"><strong>פרומפט:</strong> {currentArtifact.prompt}</p>
                            <p className="text-xs text-gray-400 mt-2">מזהה: {currentArtifact.jobId}</p>
                            <p className="text-xs text-gray-400">נוצר ב: {new Date(currentArtifact.createdAt).toLocaleString()}</p>
                         </div>
                         <div className="bg-gray-800 p-4 rounded-lg">
                             <h3 className="font-bold mb-3">פעולות</h3>
                             <div className="flex flex-wrap gap-2">
                                <ActionButton disabled={isActionLoading}>שפר</ActionButton>
                                <ActionButton onClick={handleDuplicateOrRevert} disabled={isActionLoading}>שכפל</ActionButton>
                                <ActionButton onClick={handleCompare} disabled={!currentArtifact.parentId || isActionLoading}>השווה</ActionButton>
                                <ActionButton onClick={handleDuplicateOrRevert} disabled={isActionLoading}>שחזר</ActionButton>
                             </div>
                             {isActionLoading && <p className="text-sm text-gray-400 mt-2 animate-pulse">מעבד...</p>}
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">עדיין לא נוצרו תוצרים.</p>
                </div>
            )}


            <footer className="p-4 border-t border-gray-700 h-48 flex-shrink-0">
                <h3 className="font-bold mb-2">היסטוריה</h3>
                <HistoryTimeline 
                    artifacts={artifacts}
                    selectedArtifactId={currentArtifact?.id || null}
                    onSelectArtifact={onSelectArtifact}
                />
            </footer>
        </div>
    );
}