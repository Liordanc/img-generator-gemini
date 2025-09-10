'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import type { Message, Artifact } from '@/lib/types';
import ModeEditor from './ModeEditor';

interface ChatPanelProps {
  onNewArtifact: (artifact: Artifact) => void;
  selectedImage: string | null;
  onError: (message: string) => void;
}

export default function ChatPanel({ onNewArtifact, selectedImage, onError }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModeEditorOpen, setIsModeEditorOpen] = useState(false);
  const [mode, setMode] = useState('image_edit');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectTemplate = (template: string) => {
    setPrompt(template);
    setIsModeEditorOpen(false); // Close editor after selection for better UX
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage, { role: 'model', text: '', isLoading: true }]);
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      let response;
      let body;
      let endpoint;

      if (selectedImage) {
        endpoint = '/api/images/edit';
        body = JSON.stringify({ prompt: currentPrompt, imageDataUrl: selectedImage, mode });
      } else {
        endpoint = '/api/images/generate';
        body = JSON.stringify({ prompt: currentPrompt, mode });
      }

      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'משהו השתבש');
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
      onError(err.message);
      setMessages((prev) => prev.slice(0, -1)); // Remove loading message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
        <header className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div className="text-center">
            <h1 className="text-xl font-bold">צ'אט תמונות Gemini 🎨</h1>
            <p className="text-sm text-gray-400">תאר את התמונה שברצונך ליצור</p>
          </div>

          <button
            onClick={() => setIsModeEditorOpen(!isModeEditorOpen)}
            className="w-full mt-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm flex justify-between items-center"
            aria-expanded={isModeEditorOpen}
          >
            <span>בחר מצב</span>
            <span className={`transform transition-transform duration-300 ${isModeEditorOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isModeEditorOpen ? 'max-h-[1000px] mt-3' : 'max-h-0'}`}
          >
            <ModeEditor onSelectTemplate={handleSelectTemplate} onModeChange={setMode} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">התחל שיחה כדי ליצור את התמונה הראשונה שלך.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 animate-fade-in-up ${
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
                    <div className="w-full">
                        <p className="mb-2 animate-pulse">יוצר...</p>
                        <div className="w-64 h-64 bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-white">{msg.text}</p>
                        {msg.imageUrl && (
                        <img
                            src={msg.imageUrl}
                            alt="תמונה שנוצרה"
                            className="mt-3 rounded-lg"
                        />
                        )}
                    </>
                )}
              </div>
               {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800 z-10">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={selectedImage ? "תאר את העריכה..." : "תאר את התמונה..."}
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="הזן פרומפט"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="שלח פרומפט"
              disabled={isLoading || !prompt.trim()}
            >
              שלח
            </button>
          </form>
        </footer>
      </div>
  );
}