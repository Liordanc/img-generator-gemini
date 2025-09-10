'use client';

import { Artifact } from "@/lib/types";
import { useMemo } from "react";

interface HistoryTimelineProps {
    artifacts: Artifact[];
    selectedArtifactId: string | null;
    onSelectArtifact: (artifact: Artifact | null) => void;
}

interface ArtifactNode extends Artifact {
    children: ArtifactNode[];
}

// Recursive component to render a single node and its children
const ArtifactNodeComponent = ({ node, selectedArtifactId, onSelectArtifact, level }: { 
    node: ArtifactNode, 
    selectedArtifactId: string | null,
    onSelectArtifact: (artifact: Artifact) => void,
    level: number
}) => {
    const isSelected = node.id === selectedArtifactId;
    return (
        <div style={{ paddingRight: `${level * 1.5}rem` }}>
            <div 
                onClick={() => onSelectArtifact(node)}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-900/50' : 'hover:bg-gray-700/50'}`}
            >
                <img src={node.url} alt={node.prompt} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                <p className="text-xs truncate text-gray-300">{node.prompt}</p>
            </div>
            {node.children.length > 0 && (
                <div className="border-r-2 border-gray-600 mr-5">
                    {node.children.map(child => (
                        <ArtifactNodeComponent 
                            key={child.id}
                            node={child}
                            selectedArtifactId={selectedArtifactId}
                            onSelectArtifact={onSelectArtifact}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export default function HistoryTimeline({ artifacts, selectedArtifactId, onSelectArtifact }: HistoryTimelineProps) {

    // useMemo will prevent recalculating the tree on every render unless artifacts change
    const artifactTree = useMemo(() => {
        const nodes: Record<string, ArtifactNode> = {};
        const roots: ArtifactNode[] = [];

        // First pass: create nodes and map them by ID
        for (const art of artifacts) {
            nodes[art.id] = { ...art, children: [] };
        }
        
        // Second pass: link children to their parents
        for (const art of artifacts) {
            if (art.parentId && nodes[art.parentId]) {
                // To avoid duplicates if data is messy
                if (!nodes[art.parentId].children.some(child => child.id === art.id)) {
                     nodes[art.parentId].children.push(nodes[art.id]);
                }
            } else {
                roots.push(nodes[art.id]);
            }
        }
        
        // Ensure that even if a parent is mentioned but not in the list, its children are treated as roots.
        const allChildIds = new Set(Object.values(nodes).flatMap(node => node.children.map(child => child.id)));
        const finalRoots = roots.filter(node => !allChildIds.has(node.id));

        return finalRoots;

    }, [artifacts]);

    if (artifacts.length === 0) {
        return <div className="text-center text-sm text-gray-500">ההיסטוריה תוצג כאן.</div>;
    }

    return (
        <div className="h-full w-full overflow-y-auto pr-2 space-y-1">
            {artifactTree.map(rootNode => (
                <ArtifactNodeComponent 
                    key={rootNode.id}
                    node={rootNode}
                    selectedArtifactId={selectedArtifactId}
                    onSelectArtifact={onSelectArtifact}
                    level={0}
                />
            ))}
        </div>
    );
}