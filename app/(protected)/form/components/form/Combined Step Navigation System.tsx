// StepNavigationSystem.tsx
import React from "react";
import type { StepDefinition } from "../../utils/types"; // Adjust path as needed
import { ChevronRight, Check } from 'lucide-react';

interface StepNavigationProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void; // Optional click handler for navigation
  currentQuestionIndex?: number;
  totalQuestionsInStep?: number;
  showDetailedProgress?: boolean;
}

/**
 * Main step navigation component with numbered steps and progress indicators
 */
const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  currentQuestionIndex,
  totalQuestionsInStep,
  showDetailedProgress = false,
}) => {
  // Calculate overall progress percentage
  const totalSteps = steps.length;
  const stepProgress = ((currentStep - 1) / totalSteps) * 100;
  
  // Calculate more precise progress if we know question details
  const questionProgress = currentQuestionIndex !== undefined && totalQuestionsInStep 
    ? ((currentStep - 1) / totalSteps * 100) + ((currentQuestionIndex) / totalQuestionsInStep * (100 / totalSteps))
    : stepProgress;
  
  const progress = currentQuestionIndex !== undefined ? questionProgress : stepProgress;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="mb-8">
      {/* Main step navigation */}
      <div className="flex justify-center overflow-x-auto pb-3 custom-scrollbar-thin">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isClickable = !!onStepClick && (isCompleted || stepNumber === currentStep);
            
            // Base styles
            let containerClasses = "relative flex items-center";
            
            // Step circle styles
            let circleClasses = "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 border-2";
            let numberClasses = "text-xs font-bold";
            
            // Label styles
            let labelClasses = "ml-3 font-medium text-sm whitespace-nowrap transition-all duration-200";
            
            if (isActive) {
              circleClasses += ` bg-${step.color}-100 border-${step.color}-500 text-${step.color}-700`;
              labelClasses += ` text-${step.color}-700`;
            } else if (isCompleted) {
              circleClasses += ` bg-${step.color}-500 border-${step.color}-500 text-white`;
              labelClasses += " text-gray-700";
            } else {
              circleClasses += " bg-white border-gray-300 text-gray-400";
              labelClasses += " text-gray-400";
            }
            
            if (isClickable) {
              containerClasses += " cursor-pointer hover:opacity-90";
            }
            
            // Add shadow to active step
            if (isActive) {
              circleClasses += " shadow-md";
            }

            return (
              <div key={index} className="flex items-center">
                <div 
                  className={containerClasses}
                  onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
                  role={isClickable ? "button" : undefined}
                  aria-current={isActive ? "step" : undefined}
                >
                  <div className={circleClasses}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className={numberClasses}>{stepNumber}</span>
                    )}
                  </div>
                  
                  <span className={labelClasses}>
                    {step.title}
                  </span>
                  
                  {/* Step icon badge */}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center 
                    ${isActive ? `bg-${step.color}-500 text-white shadow-sm` : 
                      isCompleted ? `bg-${step.color}-200 text-${step.color}-700` : 
                      'bg-gray-200 text-gray-500'}`}
                  >
                    <StepIcon className="w-3 h-3" />
                  </div>
                </div>
                
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="mx-3 md:mx-5 h-0.5 w-8 md:w-12 flex-shrink-0">
                    <div 
                      className={`h-full rounded-full ${
                        currentStep > stepNumber + 1 
                          ? `bg-${steps[index + 1].color}-500` 
                          : currentStep > stepNumber 
                            ? `bg-gradient-to-r from-${step.color}-500 to-${steps[index + 1].color}-300` 
                            : 'bg-gray-200'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      {showDetailedProgress && currentStepData && (
        <FormProgressBar
          progress={progress}
          color={currentStepData.color}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentStepTitle={currentStepData.title}
          currentQuestionIndex={currentQuestionIndex ?? 0}
          totalQuestionsInStep={totalQuestionsInStep ?? 1}
        />
      )}
    </div>
  );
};

/**
 * Alternative step navigation with horizontal layout and progress bar
 */
const StepNavigationAlternative: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  currentQuestionIndex,
  totalQuestionsInStep,
  showDetailedProgress = false,
}) => {
  const totalSteps = steps.length;
  const stepProgress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  // Calculate more precise progress if we know question details
  const questionProgress = currentQuestionIndex !== undefined && totalQuestionsInStep 
    ? ((currentStep - 1) / totalSteps * 100) + ((currentQuestionIndex) / totalQuestionsInStep * (100 / totalSteps))
    : stepProgress;
  
  const progress = currentQuestionIndex !== undefined ? questionProgress : stepProgress;
  const currentStepData = steps[currentStep - 1];
  
  return (
    <div className="mb-8 px-2">
      {/* Progress bar */}
      <div className="relative h-1 bg-gray-200 rounded-full mb-6 mx-4">
        <div 
          className={`absolute h-full left-0 ${currentStepData ? `bg-${currentStepData.color}-600` : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
        
        {/* Step markers */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isClickable = !!onStepClick && (isCompleted || stepNumber === currentStep);
            
            return (
              <div 
                key={index} 
                className="relative"
                onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
              >
                <div 
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isActive 
                      ? `bg-${step.color}-100 border-${step.color}-500` 
                      : isCompleted 
                        ? `bg-${step.color}-500 border-${step.color}-500` 
                        : 'bg-white border-gray-300'
                  } ${isClickable ? 'cursor-pointer' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="font-bold text-base ${isActive ? `text-${step.color}-700` : 'text-gray-400'}">{stepNumber}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = !!onStepClick && (isCompleted || stepNumber === currentStep);
          
          return (
            <div 
              key={index}
              className={`flex flex-col items-center transition-all duration-200 ${
                isClickable ? 'cursor-pointer hover:opacity-90' : ''
              }`}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                    isActive || isCompleted 
                      ? `bg-${step.color}-100 text-${step.color}-700` 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
                
                <span 
                  className={`text-xs font-medium text-center max-w-[80px] ${
                    isActive 
                      ? `text-${step.color}-700` 
                      : isCompleted 
                        ? 'text-gray-700' 
                        : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed progress indicator */}
      {showDetailedProgress && currentStepData && (
        <div className="mt-4">
          <FormProgressBar
            progress={progress}
            color={currentStepData.color}
            currentStep={currentStep}
            totalSteps={totalSteps}
            currentStepTitle={currentStepData.title}
            currentQuestionIndex={currentQuestionIndex ?? 0}
            totalQuestionsInStep={totalQuestionsInStep ?? 1}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Detailed progress bar component for showing step and question progress
 */
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
  <div className="px-1">
    <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
      <span className="font-medium text-gray-700">
        Step {currentStep} of {totalSteps}: {currentStepTitle}{" "}
        <span className="text-gray-500">
          (Q{currentQuestionIndex + 1}/{totalQuestionsInStep})
        </span>
      </span>
      <span className={`text-sm font-semibold text-${color}-600`}>
        {Math.round(progress)}% Complete
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`bg-${color}-600 h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

/**
 * Compact progress indicator that can be used independently
 */
interface CompactProgressProps {
  step: number;
  totalSteps: number;
  progress: number;
  color?: string;
}

const CompactProgress: React.FC<CompactProgressProps> = ({
  step,
  totalSteps,
  progress,
  color = "blue"
}) => (
  <div className="flex items-center space-x-2">
    <div className="text-xs font-medium text-gray-500">
      {step}/{totalSteps}
    </div>
    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-600 rounded-full`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <div className="text-xs font-medium text-gray-500">
      {Math.round(progress)}%
    </div>
  </div>
);

export default StepNavigation;
export { 
  StepNavigationAlternative, 
  FormProgressBar,
  CompactProgress
};