'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import type { Message, Artifact } from '@/lib/types';


interface ChatPanelProps {
  onNewArtifact: (artifact: Artifact) => void;
  selectedImage: string | null;
}

export default function ChatPanel({ onNewArtifact, selectedImage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage, { role: 'model', text: '', isLoading: true }]);
    setIsLoading(true);
    setError(null);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      let response;
      let body;
      let endpoint;

      if (selectedImage) {
        endpoint = '/api/images/edit';
        body = JSON.stringify({ prompt: currentPrompt, imageDataUrl: selectedImage });
      } else {
        endpoint = '/api/images/generate';
        body = JSON.stringify({ prompt: currentPrompt });
      }

      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const artifact: Artifact = await response.json();
      
      const modelMessage: Message = {
        role: 'model',
        text: artifact.prompt,
        imageUrl: artifact.url,
      };
      
      setMessages((prev) => [...prev.slice(0, -1), modelMessage]);
      onNewArtifact(artifact);

    } catch (err: any) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1)); // Remove loading message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
        <header className="p-4 border-b border-gray-700 text-center sticky top-0 bg-gray-800 z-10">
          <h1 className="text-xl font-bold">Gemini Image Chat 🎨</h1>
          <p className="text-sm text-gray-400">Describe the image you want</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Start a conversation to create your first image.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
               {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>}
               <div
                className={`max-w-md p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}
              >
                {msg.isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating...</span>
                    </div>
                ) : (
                    <>
                        <p className="text-white">{msg.text}</p>
                        {msg.imageUrl && (
                        <img
                            src={msg.imageUrl}
                            alt="Generated"
                            className="mt-3 rounded-lg"
                        />
                        )}
                    </>
                )}
              </div>
               {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>}
            </div>
          ))}

          {error && <div className="text-red-400 text-center p-2 bg-red-900/50 rounded">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800 z-10">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={selectedImage ? "Describe your edit..." : "Describe an image..."}
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Enter prompt"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send prompt"
              disabled={isLoading || !prompt.trim()}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
  );
}
