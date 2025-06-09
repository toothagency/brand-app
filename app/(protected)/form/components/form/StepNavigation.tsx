import React from "react";
import type { StepDefinition } from "../../utils/types"; // Adjust path as needed
import { ChevronRight, Check } from "lucide-react";



interface StepNavigationProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 overflow-x-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
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
            "relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full transition-all duration-300 border-2 shadow-sm";
          let numberClasses = "text-xs sm:text-sm font-bold transition-colors duration-300";
          let labelClasses =
            "ml-2 sm:ml-3 md:ml-4 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300";

          if (isActive) {
            circleClasses += ` bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 border-${step.color}-500 text-${step.color}-700 shadow-lg`;
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
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-in fade-in duration-300" />
                  ) : (
                    <span className={numberClasses}>{stepNumber}</span>
                  )}
                </div>

                {/* Step title - Hidden on very small screens, visible on sm+ */}
                <div className="hidden sm:flex flex-col ml-1 sm:ml-2">
                  <span className={labelClasses}>{step.title}</span>
                </div>

                {/* Enhanced step icon badge */}
                <div
                  className={`absolute -top-1 sm:-top-2 -right-4 sm:-right-5 md:-right-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-${step.color}-500 text-white shadow-lg ring-2 ring-white scale-110`
                      : isCompleted
                      ? `bg-${step.color}-100 text-${step.color}-700 shadow-md`
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                </div>
              </div>

              {/* Enhanced connector line between steps */}
              {index < steps.length - 1 && (
                <div className="mx-2 sm:mx-3 md:mx-4 lg:mx-6 relative">
                  <div className="h-0.5 w-8 sm:w-10 md:w-12 lg:w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        currentStep > stepNumber + 1
                          ? `bg-gradient-to-r from-${step.color}-500 to-${steps[index + 1].color}-500`
                          : currentStep > stepNumber
                          ? `bg-gradient-to-r from-${step.color}-500 to-${step.color}-500`
                          : `bg-${step.color}-500`
                      }`}
                      style={{
                        width: currentStep > stepNumber ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                  {/* Animated chevron for active connection */}
                  {currentStep === stepNumber + 1 && (
                    <ChevronRight className={`absolute top-1/2 left-[98%] transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-${step.color}-500 animate-pulse`} />
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

export default StepNavigation;