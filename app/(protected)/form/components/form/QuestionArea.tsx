import React, { useState, useMemo, useEffect } from "react";
import InputRenderer from "./InputRenderer";
import SuggestionsPanel from "./SuggestionsPanel";
import NavigationControls from "./NavigationControls";
import type {
  StepDefinition,
  QuestionDefinition,
  FormData,
} from "../../utils/types"; // Adjust path
import { generateSuggestions } from "../../utils/helperFunctions";

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
  isNextButtonDisabled: boolean; // Renamed for clarity
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
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = useMemo(
    () => generateSuggestions(formData, currentQuestionData),
    [formData, currentQuestionData]
  );

  useEffect(() => {
    const currentAnswer = formData[currentQuestionData.id];
    // Show suggestions if the answer is a string, longer than 10 chars, and suggestions exist
    if (
      typeof currentAnswer === "string" &&
      currentAnswer.length > 10 &&
      suggestions.length > 0
    ) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [formData, currentQuestionData.id, suggestions]);

  const isQuestionAnswered = (questionIndexInStep: number): boolean => {
    const questionId = currentStepData.questions[questionIndexInStep]?.id;
    if (!questionId) return false;
    const answer = formData[questionId];
    if (Array.isArray(answer)) return answer.length > 0;
    return !!answer; // Check if answer is truthy (not empty string, undefined, null, 0, false)
  };

  return (
    <div className="bg-white rounded shadow-lg p-6 sm:p-8 mb-6 flex flex-col h-[500px] sm:h-[550px] md:h-[500px]">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4 h-[80px]">
          <div
            className={`w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
          >
            <span
              className={`text-blue-600 font-bold text-lg`}
            >
              {currentQuestionIndex + 1}
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {currentQuestionData.question}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentQuestionData.subtitle}
            </p>
          </div>
        </div>
        <div className="h-[190px] p-1 overflow-y-auto">

        <InputRenderer
          question={currentQuestionData}
          value={formData[currentQuestionData.id]}
          onChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsPanel
          suggestions={suggestions}
          onSelectSuggestion={handleInputChange}
        />
      )}

      <NavigationControls
        onPrev={prevQuestion}
        onNext={nextQuestion}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextButtonDisabled}
        isLastQuestion={isLastQuestion}
        stepColor={currentStepData.color}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestionsInStep={currentStepData.questions.length}
        isQuestionAnswered={isQuestionAnswered}
      />
    </div>
  );
};

export default QuestionArea;
