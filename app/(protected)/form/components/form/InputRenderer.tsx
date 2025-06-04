import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import type { QuestionDefinition } from "../../utils/types"; // Adjust path as needed

interface InputRendererProps {
  question: QuestionDefinition;
  value: string | string[] | undefined;
  onChange: (value: string) => void;
  onCheckboxChange: (option: string) => void;
}

const InputRenderer: React.FC<InputRendererProps> = ({
  question,
  value,
  onChange,
  onCheckboxChange,
}) => {
  switch (question.type) {
    case "textarea":
      return (
        <textarea
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
          rows={4}
          placeholder={question.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          aria-label={question.question}
        />
      );
    case "text":
      return (
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={question.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          aria-label={question.question}
        />
      );
    case "select":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
          {(question.options as string[]).map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`p-3 border rounded text-left transition-all duration-150 ${
                value === option
                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 shadow-md"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(question.options as string[]).map((option) => {
            const isSelected = ((value as string[]) || []).includes(option);
            return (
              <button
                key={option}
                onClick={() => onCheckboxChange(option)}
                className={`p-3 border rounded text-left transition-all duration-150 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 shadow-md"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  {option}
                </div>
              </button>
            );
          })}
        </div>
      );
    default:
      return null;
  }
};

export default InputRenderer;
