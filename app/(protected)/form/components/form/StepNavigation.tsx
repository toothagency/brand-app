// StepNavigation.tsx
import React from "react";
import type { StepDefinition } from "../../utils/types"; // Adjust path as needed
import { ChevronRight, Check } from "lucide-react";

interface StepNavigationProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void; // Optional click handler for navigation
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="flex justify-center mb-8 overflow-x-auto pb-4 px-4">
      <div className="flex items-center min-w-fit">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable =
            !!onStepClick && (isCompleted || stepNumber === currentStep);

          // Enhanced styles with better visual hierarchy
          let containerClasses = "relative flex items-center group";
          let circleClasses =
            "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border-2 shadow-sm";
          let numberClasses = "text-sm font-bold transition-colors duration-300";
          let labelClasses =
            "ml-4 font-semibold text-sm whitespace-nowrap transition-all duration-300";

          if (isActive) {
            circleClasses += ` bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 border-${step.color}-500 text-${step.color}-700 shadow-lg ring-4 ring-${step.color}-100`;
            labelClasses += ` text-${step.color}-700`;
          } else if (isCompleted) {
            circleClasses += ` bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 border-${step.color}-500 text-white shadow-md`;
            labelClasses += " text-gray-700";
          } else {
            circleClasses += " bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-400";
            labelClasses += " text-gray-400";
          }

          if (isClickable) {
            containerClasses += " cursor-pointer";
            circleClasses += " hover:scale-105 hover:shadow-lg";
            labelClasses += " hover:text-opacity-80";
          }

          return (
            <div key={index} className="flex items-center">
              <div
                className={containerClasses}
                onClick={
                  isClickable ? () => onStepClick(stepNumber) : undefined
                }
                role={isClickable ? "button" : undefined}
                aria-current={isActive ? "step" : undefined}
                tabIndex={isClickable ? 0 : -1}
              >
                {/* Main step circle */}
                <div className={circleClasses}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-in fade-in duration-300" />
                  ) : (
                    <span className={numberClasses}>{stepNumber}</span>
                  )}
                  
                  {/* Pulse animation for active step */}
                  {isActive && (
                    <div className={`absolute inset-0 rounded-full bg-${step.color}-400 opacity-20 animate-pulse`}></div>
                  )}
                </div>

                {/* Step title */}
                <div className="flex flex-col ml-4">
                  <span className={labelClasses}>{step.title}</span>
                  {isActive && (
                    <span className="text-xs text-gray-500 mt-0.5 animate-in slide-in-from-left duration-300">
                      Current step
                    </span>
                  )}
                </div>

                {/* Enhanced step icon badge */}
                <div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-${step.color}-500 text-white shadow-lg ring-2 ring-white scale-110`
                      : isCompleted
                      ? `bg-${step.color}-100 text-${step.color}-700 shadow-md`
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Enhanced connector line between steps */}
              {index < steps.length - 1 && (
                <div className="mx-4 md:mx-6 relative">
                  <div className="h-0.5 w-12 md:w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        currentStep > stepNumber + 1
                          ? `bg-gradient-to-r from-${step.color}-500 to-${steps[index + 1].color}-500`
                          : currentStep > stepNumber
                          ? `bg-gradient-to-r from-${step.color}-500 to-${step.color}-300`
                          : "bg-gray-200"
                      }`}
                      style={{
                        width: currentStep > stepNumber ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                  {/* Animated chevron for active connection */}
                  {currentStep === stepNumber + 1 && (
                    <ChevronRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Alternative design with modern styling
const StepNavigationAlternative: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="mb-8 pt-20">
      {/* Enhanced progress bar with gradient */}
      <div className="relative h-1 bg-gray-100 rounded-full mb-8 mx-6 shadow-inner ">
        <div
          className={`absolute h-full left-0 bg-blue-500 rounded-full transition-all duration-700 ease-out shadow-sm `}
          style={{ width: `${progress}%` }}
        >
         
        </div>

        {/* Enhanced step markers */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between ">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isClickable =
              !!onStepClick && (isCompleted || stepNumber === currentStep);

            return (
              <div
                key={index}
                className="relative group"
                onClick={
                  isClickable ? () => onStepClick(stepNumber) : undefined
                }
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full border-3 transition-all duration-300 shadow-lg ${
                    isActive
                      ? `bg-blue-500 scale-110`
                      : isCompleted
                      ? `bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 hover:scale-105`
                      : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-gray-400"
                  } ${isClickable ? "cursor-pointer" : ""}`}
                >
                  {isCompleted ? (
                    <div className="relative">
                      <Check className="w-6 h-6 text-white animate-in zoom-in duration-300" />
                      
                    </div>
                  ) : (
                    <span
                      className={`font-bold text-xl transition-colors duration-300 ${
                        isActive
                          ? `text-white `
                          : "text-gray-400"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                  
                 
                </div>

                {/* Tooltip on hover */}
                {isClickable && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {isCompleted ? "Click to revisit" : "Current step"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced step labels with better spacing */}
      <div className="flex justify-between items-start  mt-1">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable =
            !!onStepClick && (isCompleted || stepNumber === currentStep);

          return (
            <div
              key={index}
              className={`flex flex-col items-center transition-all duration-300 w-[100px] ${
                isClickable ? "cursor-pointer hover:scale-105" : ""
              }`}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            >
              {/* Icon container with enhanced styling */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-sm ${
                  isActive || isCompleted
                    ? ` text-blue-700 `
                    : " text-gray-400"
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              {/* Step title with better typography */}
              <span
                className={`text-sm font-medium text-center leading-tight transition-all duration-300 ${
                  isActive
                    ? `text-blue-700 font-semibold`
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>

             
            </div>
          );
        })}
      </div>

    
    </div>
  );
};

export default StepNavigation;
export { StepNavigationAlternative };