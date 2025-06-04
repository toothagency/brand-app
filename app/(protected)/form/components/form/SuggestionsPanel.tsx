import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestionsPanelProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions, onSelectSuggestion }) => (
  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-center gap-2 mb-3">
      <Sparkles className="w-5 h-5 text-yellow-600" />
      <span className="text-sm font-medium text-yellow-800"> AI Suggestions (click to use): </span>
    </div>
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          className="block w-full text-left p-3 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors text-sm shadow-sm hover:shadow-md"
        >
          "{suggestion}"
        </button>
      ))}
    </div>
  </div>
);

export default SuggestionsPanel;