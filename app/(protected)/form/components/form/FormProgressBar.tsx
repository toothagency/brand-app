import React from "react";
import type { StepDefinition } from "../../utils/types"; // Adjust path as needed

interface ProgressBarProps {
  progress: number;
  color: StepDefinition["color"];
  currentStep: number;
  totalSteps: number;
  currentStepTitle: string;
  currentQuestionIndex: number;
  totalQuestionsInStep: number;
}

const FormProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  currentStep,
  totalSteps,
  currentStepTitle,
  currentQuestionIndex,
  totalQuestionsInStep,
}) => (
  <div className="mb-8 md:px-4 px-2">
    <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
      <span className="font-medium text-gray-700">
        Step {currentStep} of {totalSteps}: {currentStepTitle}{" "}
        <span className="text-gray-500">
          (Q{currentQuestionIndex + 1}/{totalQuestionsInStep})
        </span>
      </span>
      <span className={`text-sm font-semibold text-blue-600`}>
        {Math.round(progress)}% Complete
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default FormProgressBar;
