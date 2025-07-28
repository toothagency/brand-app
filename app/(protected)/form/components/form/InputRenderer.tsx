import React, { useRef, useState } from "react";
import { CheckCircle, Circle, Mic, MicOff } from "lucide-react";
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
  // Speech-to-text state and logic
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleMicClick = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(((value as string) || "") + (value ? " " : "") + transcript);
        setListening(false);
      };
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMicClick();
    }
  };

  switch (question.type) {
    case "textarea":
      return (
        <div className="relative">
          <label htmlFor={`question-${question.id}`} className="sr-only">
            {question.question}
          </label>
          <textarea
            id={`question-${question.id}`}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px] pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={4}
            placeholder={question.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={question.question}
            aria-describedby={
              question.description ? `desc-${question.id}` : undefined
            }
          />
          {question.description && (
            <div id={`desc-${question.id}`} className="sr-only">
              {question.description}
            </div>
          )}
          <button
            type="button"
            onClick={handleMicClick}
            onKeyDown={handleKeyDown}
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 shadow border border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            aria-label={
              listening ? "Stop speech recognition" : "Start speech to text"
            }
            aria-pressed={listening}
          >
            {listening ? (
              <MicOff className="w-5 h-5 animate-pulse" aria-hidden="true" />
            ) : (
              <Mic className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          {listening && (
            <span
              className="absolute top-2 right-14 px-2 py-1 rounded-full bg-blue-500 text-white text-xs shadow font-semibold animate-pulse select-none"
              role="status"
              aria-live="polite"
            >
              Listening...
            </span>
          )}
        </div>
      );
    case "text":
      return (
        <div className="relative">
          <label htmlFor={`question-${question.id}`} className="sr-only">
            {question.question}
          </label>
          <input
            id={`question-${question.id}`}
            type="text"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder={question.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={question.question}
            aria-describedby={
              question.description ? `desc-${question.id}` : undefined
            }
          />
          {question.description && (
            <div id={`desc-${question.id}`} className="sr-only">
              {question.description}
            </div>
          )}
          <button
            type="button"
            onClick={handleMicClick}
            onKeyDown={handleKeyDown}
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 shadow border border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            aria-label={
              listening ? "Stop speech recognition" : "Start speech to text"
            }
            aria-pressed={listening}
          >
            {listening ? (
              <MicOff className="w-5 h-5 animate-pulse" aria-hidden="true" />
            ) : (
              <Mic className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          {listening && (
            <span
              className="absolute top-2 right-14 px-2 py-1 rounded-full bg-blue-500 text-white text-xs shadow font-semibold animate-pulse select-none"
              role="status"
              aria-live="polite"
            >
              Listening...
            </span>
          )}
        </div>
      );
    case "select":
      return (
        <div>
          <label htmlFor={`question-${question.id}`} className="sr-only">
            {question.question}
          </label>
          <select
            id={`question-${question.id}`}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={question.question}
            aria-describedby={
              question.description ? `desc-${question.id}` : undefined
            }
          >
            <option value="">
              {question.placeholder || "Select an option"}
            </option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {question.description && (
            <div id={`desc-${question.id}`} className="sr-only">
              {question.description}
            </div>
          )}
        </div>
      );
    case "radio":
      return (
        <fieldset className="space-y-3">
          <legend className="sr-only">{question.question}</legend>
          {question.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {question.description}
            </div>
          )}
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                id={`${question.id}-${index}`}
                type="radio"
                name={question.id}
                value={option}
                checked={(value as string) === option}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                aria-describedby={
                  question.description ? `desc-${question.id}` : undefined
                }
              />
              <label
                htmlFor={`${question.id}-${index}`}
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
              >
                {option}
              </label>
            </div>
          ))}
          {question.description && (
            <div id={`desc-${question.id}`} className="sr-only">
              {question.description}
            </div>
          )}
        </fieldset>
      );
    case "checkbox":
      return (
        <fieldset className="space-y-3">
          <legend className="sr-only">{question.question}</legend>
          {question.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {question.description}
            </div>
          )}
          {question.options?.map((option, index) => {
            const isChecked = Array.isArray(value) && value.includes(option);
            return (
              <div key={index} className="flex items-center">
                <input
                  id={`${question.id}-${index}`}
                  type="checkbox"
                  value={option}
                  checked={isChecked}
                  onChange={() => onCheckboxChange(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby={
                    question.description ? `desc-${question.id}` : undefined
                  }
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                >
                  {option}
                </label>
              </div>
            );
          })}
          {question.description && (
            <div id={`desc-${question.id}`} className="sr-only">
              {question.description}
            </div>
          )}
        </fieldset>
      );
    case "rating":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {question.question}
          </label>
          {question.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {question.description}
            </div>
          )}
          <div
            className="flex space-x-2"
            role="radiogroup"
            aria-label={`Rate ${question.question}`}
          >
            {[1, 2, 3, 4, 5].map((rating) => {
              const isSelected = (value as number) === rating;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange(rating.toString())}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Rate ${rating} out of 5`}
                  aria-pressed={isSelected}
                >
                  {rating}
                </button>
              );
            })}
          </div>
        </div>
      );
    default:
      return (
        <div className="text-red-600 dark:text-red-400">
          Unsupported input type: {question.type}
        </div>
      );
  }
};

export default InputRenderer;
