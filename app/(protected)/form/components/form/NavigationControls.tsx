import React from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { StepDefinition } from "../../utils/types"; // Adjust path as needed

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isLastQuestion: boolean;
  stepColor: StepDefinition["color"];
  currentQuestionIndex: number;
  totalQuestionsInStep: number;
  isQuestionAnswered: (questionIndex: number) => boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  isLastQuestion,
  stepColor,
  currentQuestionIndex,
  totalQuestionsInStep,
  isQuestionAnswered,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
    <button
      onClick={onPrev}
      disabled={isPrevDisabled}
      className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded hover:bg-gray-100 mb-4 sm:mb-0"
      aria-label="Previous question"
    >
      <ChevronLeft className="w-5 h-5" /> Previous
    </button>

    <div className="flex gap-2 items-center my-3 sm:my-0">
      {Array.from({ length: totalQuestionsInStep }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            i === currentQuestionIndex
              ? `bg-blue-600 scale-150`
              : isQuestionAnswered(i)
              ? "bg-blue-400"
              : "bg-gray-300"
          }`}
          title={`Question ${i + 1} ${
            isQuestionAnswered(i) ? "answered" : "unanswered"
          }`}
        />
      ))}
    </div>

    <button
      onClick={onNext}
      disabled={isNextDisabled}
      className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
      aria-label={isLastQuestion ? "Generate My Brand" : "Next question"}
    >
      {isLastQuestion ? (
        <>
          <Sparkles className="w-5 h-5" /> Generate My Brand
        </>
      ) : (
        <>
          Next <ChevronRight className="w-5 h-5" />
        </>
      )}
    </button>
  </div>
);

export default NavigationControls;
