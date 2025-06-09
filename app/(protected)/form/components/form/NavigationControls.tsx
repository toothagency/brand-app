// NavigationControls.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isSubmitting?: boolean;
  isLastQuestion: boolean;
  stepColor: string;
  currentQuestionIndex: number;
  totalQuestionsInStep: number;
  isQuestionAnswered: (questionIndex: number) => boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  isSubmitting,
  isLastQuestion,
  stepColor, // This would be your single primary color if you standardized
  currentQuestionIndex,
  totalQuestionsInStep,
  isQuestionAnswered,
}) => (
  <div className="flex  sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
    <button
      onClick={onPrev}
      disabled={isPrevDisabled}
      className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 text-gray-600 bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 sm:mb-0"
      aria-label="Previous question"
    > <ChevronLeft className="w-5 h-5" /> Previous </button>

    <div className="flex gap-2 items-center my-3 sm:my-0">
      {Array.from({ length: totalQuestionsInStep }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            i === currentQuestionIndex ? `bg-${stepColor}-600 scale-150` : // Use primary color
            isQuestionAnswered(i) ? `bg-${stepColor}-500` : 'bg-gray-300' // Green for answered is a common UX
          }`}
          title={`Question ${i+1} ${isQuestionAnswered(i) ? 'answered' : 'unanswered'}`}
        />
      ))}
    </div>

    <button
      onClick={onNext}
      disabled={isNextDisabled}
      className={`flex items-center justify-center gap-2 md:px-6 px-2 md:py-3 py-2 md:min-w-[160px] text-base font-medium text-white rounded transition-all duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed 
                  ${isSubmitting ? `bg-gray-400 hover:bg-gray-400 focus:ring-gray-300 cursor-wait` 
                                : `bg-${stepColor}-600 hover:bg-${stepColor}-700 focus:ring-${stepColor}-400`} `} // Use primary color
      aria-label={isLastQuestion ? "Generate My Brand" : "Next question"}
    >
      {isSubmitting ? (
        <> <Loader2 className="w-5 h-5 animate-spin" /> <span>Processing...</span> </>
      ) : isLastQuestion ? (
        <> <Sparkles className="w-5 h-5" /> <span>Generate Brand</span> </>
      ) : (
        <> <span>Next</span> <ChevronRight className="w-5 h-5" /> </>
      )}
    </button>
  </div>
);
export default NavigationControls;