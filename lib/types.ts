export interface Artifact {
    id: string;
    type: 'image' | 'text';
    url: string;
    prompt: string;
    metadata?: Record<string, any>;
    createdAt: string;
    jobId: string;
    parentId?: string | null;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  isLoading?: boolean;
}
