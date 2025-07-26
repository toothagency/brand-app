// QuestionArea.tsx
import React from "react";
// --- ADJUST PATHS AS NEEDED ---
import InputRenderer from "./InputRenderer";
import SuggestionsPanel from "./SuggestionsPanel";
import NavigationControls from "./NavigationControls";
import type {
  StepDefinition,
  QuestionDefinition,
  FormData,
} from "../../utils/types"; // Path to types
import { isClientAnswerFormatValid } from "../../utils/helperFunctions"; // Path to helpers
import { Loader2, AlertCircle, Sparkles as SuggestionIcon } from "lucide-react"; // Added SuggestionIcon
// --- END ADJUST PATHS ---

interface QuestionAreaProps {
  currentStepData: StepDefinition;
  currentQuestionData: QuestionDefinition;
  currentQuestionIndex: number;
  formData: FormData;
  handleInputChange: (value: string) => void;
  handleCheckboxChange: (option: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  isLastQuestion: boolean;
  isPrevDisabled: boolean;
  isNextButtonDisabled: boolean;
  isSubmittingQuestion?: boolean;
  currentQuestionError?: string | null;
  suggestions: string[];
  isLoadingSuggestions: boolean;
  showSuggestionsUI: boolean;
  onSelectSuggestion: (suggestionValue: string) => void;
  onManualSuggestionFetch: () => void; // For the button
  canShowManualSuggestButton: boolean; // To control button visibility
}

const QuestionArea: React.FC<QuestionAreaProps> = ({
  currentStepData,
  currentQuestionData,
  currentQuestionIndex,
  formData,
  handleInputChange,
  handleCheckboxChange,
  nextQuestion,
  prevQuestion,
  isLastQuestion,
  isPrevDisabled,
  isNextButtonDisabled,
  isSubmittingQuestion,
  currentQuestionError,
  suggestions,
  isLoadingSuggestions,
  showSuggestionsUI,
  onSelectSuggestion,
  onManualSuggestionFetch,
  canShowManualSuggestButton,
}) => {
  const isQuestionAnswered = (questionIndexInStep: number): boolean => {
    const questionDef = currentStepData.questions[questionIndexInStep];
    if (!questionDef) return false;
    const answer = formData[questionDef.id];
    return isClientAnswerFormatValid(answer, questionDef.type);
  };

  if (!currentQuestionData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6 flex flex-col min-h-[450px] justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Loading question content...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 sm:p-8 mb-6 flex flex-col min-h-[450px] sm:min-h-[600px] ">
      <div className="flex-grow mb-6">
        {" "}
        {/* Main content wrapper */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 bg-${currentStepData.color}-100 dark:bg-${currentStepData.color}-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
          >
            {" "}
            <span
              className={`text-${currentStepData.color}-600 dark:text-${currentStepData.color}-400 font-bold text-xl`}
            >
              {" "}
              {currentQuestionIndex + 1}{" "}
            </span>{" "}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {" "}
              {currentQuestionData.question}{" "}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {" "}
              {currentQuestionData.subtitle}{" "}
            </p>
          </div>
        </div>
        {currentQuestionError && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-400 rounded-md flex items-center gap-2 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{currentQuestionError}</p>
          </div>
        )}
        <InputRenderer
          question={currentQuestionData}
          value={formData[currentQuestionData.id]}
          onChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
        {/* Manual "Generate Suggestions" Button */}
        {canShowManualSuggestButton && (
          <div className="mt-6 mb-2 text-center">
            {" "}
            {/* Adjusted margin */}
            <button
              onClick={onManualSuggestionFetch}
              disabled={isLoadingSuggestions || isSubmittingQuestion}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors
                          bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-yellow-900 dark:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                          disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
              <SuggestionIcon className="w-4 h-4" />
              Generate Suggestions
            </button>
          </div>
        )}
      </div>{" "}
      {/* End of flex-grow for main content (input, error, manual button) */}
      {/* Suggestions Panel - shown if showSuggestionsUI is true */}
      {showSuggestionsUI && (
        <div className="mb-6">
          {" "}
          {/* This div ensures spacing if suggestions are shown */}
          <SuggestionsPanel
            suggestions={suggestions}
            isLoading={isLoadingSuggestions}
            onSelectSuggestion={onSelectSuggestion}
          />
        </div>
      )}
      <NavigationControls
        onPrev={prevQuestion}
        onNext={nextQuestion}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextButtonDisabled}
        isSubmitting={isSubmittingQuestion}
        isLastQuestion={isLastQuestion}
        stepColor={currentStepData.color}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestionsInStep={currentStepData.questions.length}
        isQuestionAnswered={isQuestionAnswered}
      />
    </div>
  );
};
export default React.memo(QuestionArea);
