import React, { useState, useCallback, useEffect } from 'react';
import { requestSuggestionsForInput } from '../services/geminiService';

interface InputWithSuggestionsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  description: string;
  onSuggestionClick: (value: string) => void;
}

export const InputWithSuggestions: React.FC<InputWithSuggestionsProps> = ({ name, description, onSuggestionClick, ...props }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Listen for messages from the extension host that contain suggestions
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.command === 'suggestionsLoaded' && message.payload.description === description) {
        setIsLoading(false);
        if (message.payload.suggestions) {
            setSuggestions(message.payload.suggestions);
        } else {
            setError('Failed to load suggestions.');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [description]);


  const fetchSuggestions = useCallback(() => {
    if (suggestions.length > 0 || isLoading) return;
    setIsLoading(true);
    setError(null);
    requestSuggestionsForInput(description);
  }, [description, isLoading, suggestions.length]);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setSuggestions([]); // Hide suggestions after one is clicked
  };

  return (
    <div>
      <input
        name={name}
        onFocus={fetchSuggestions}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {isLoading && <p className="text-xs text-gray-400 mt-2">Loading AI suggestions...</p>}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 bg-gray-700 hover:bg-blue-600 text-xs text-white rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
