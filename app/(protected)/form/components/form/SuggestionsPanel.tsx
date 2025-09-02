// SuggestionsPanel.tsx
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface SuggestionsPanelProps {
  suggestions: string[];
  isLoading: boolean;
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  suggestions,
  isLoading,
  onSelectSuggestion,
}) => (
  <div className="p-4 bg-yellow-50 dark:bg-gray-700 border border-yellow-200 dark:border-yellow-600 rounded shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Sparkles className="w-5 h-5 text-yellow-600" />
      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-600">
        AI Suggestions (click to use):
      </span>
    </div>
    {isLoading ? (
      <div className="flex items-center justify-center py-3">
        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
        <span className="ml-2 text-sm text-yellow-700">Loading suggestions...</span>
      </div>
    ) : suggestions.length > 0 ? (
      <div className="space-y-2 dark:text-white">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="block w-full text-left p-3 bg-white dark:bg-gray-800 border dark:border-yellow-600 border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            "{suggestion}"
          </button>
        ))}
      </div>
    ) : (
      <p className="text-sm text-yellow-700 dark:text-yellow-400 py-2">No suggestions available for this question.</p>
    )}
  </div>
);
export default SuggestionsPanel;