'use client';

import { useState, useEffect } from 'react';

interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    } else {
      // Allow fade-out animation to complete before unmounting
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  if (!isVisible && !message) {
      return null;
  }

  const animationClass = message ? 'animate-slide-in-up' : 'animate-slide-out-down';

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm w-full bg-red-800 text-white p-4 rounded-lg shadow-lg flex justify-between items-center z-50 ${animationClass}`}
      role="alert"
    >
      <div>
        <p className="font-bold">שגיאה</p>
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 p-1 rounded-full hover:bg-red-700 transition-colors"
        aria-label="סגור התראה"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}