import React from "react";
import { EyeOff } from "lucide-react";
import type { StepDefinition, FormData } from "../../utils/types"; // Adjust path

interface ContextPanelProps {
  steps: StepDefinition[];
  formData: FormData;
  onClose: () => void;
  totalQuestions: number;
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  steps,
  formData,
  onClose,
  totalQuestions,
}) => {
  const answeredQuestionsCount = Object.keys(formData).filter((key) => {
    const answer = formData[key];
    if (Array.isArray(answer)) return answer.length > 0;
    return !!answer; // Check if answer is truthy
  }).length;

  const overallProgress =
    totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0;

  return (
    <div className="w-full md:w-80 lg:w-96">
      <div className="bg-white rounded h-[500px] shadow-lg p-5 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Your Brand Progress
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Hide context panel"
          >
            <EyeOff className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable area for answers */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
          {steps.map((step, stepIndex) => {
            const stepAnswers = step.questions.filter((q) => {
              const answer = formData[q.id];
              return (
                answer && (Array.isArray(answer) ? answer.length > 0 : true)
              );
            });

            if (stepAnswers.length === 0) return null; // Don't render step if no answers yet

            const StepIcon = step.icon;
            return (
              <div key={stepIndex} className="border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2 mb-2">
                  <StepIcon
                    className={`w-4 h-4 text-${step.color}-600 flex-shrink-0`}
                  />
                  <span className="font-medium text-gray-700 text-sm">
                    {step.title}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {stepAnswers.map((question) => (
                    <div key={question.id} className="text-xs">
                      <span className="font-medium text-gray-600">
                        {question.question.split("?")[0]}?{" "}
                        {/* Shorten question */}
                      </span>
                      <p className="text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                        {Array.isArray(formData[question.id])
                          ? (formData[question.id] as string[]).join(", ")
                          : (formData[question.id] as string)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Progress */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">
            Completed: {answeredQuestionsCount} / {totalQuestions} questions
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextPanel;
