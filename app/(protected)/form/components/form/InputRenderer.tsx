import React, { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import type { QuestionDefinition } from "../../utils/types"; // Adjust path as needed

interface InputRendererProps {
  question: QuestionDefinition;
  value: string | string[] | undefined;
  onChange: (value: string) => void;
  onCheckboxChange: (option: string) => void;
}

const InputRenderer: React.FC<InputRendererProps> = React.memo(
  ({ question, value, onChange, onCheckboxChange }) => {
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
              {question.options?.map((option, index) => {
                const optionValue =
                  typeof option === "string" ? option : option.value;
                const optionLabel =
                  typeof option === "string" ? option : option.label;
                return (
                  <option key={index} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            {question.description && (
              <div id={`desc-${question.id}`} className="sr-only">
                {question.description}
              </div>
            )}
          </div>
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
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              const isChecked =
                Array.isArray(value) && value.includes(optionValue);
              return (
                <div key={index} className="flex items-center">
                  <input
                    id={`${question.id}-${index}`}
                    type="checkbox"
                    value={optionValue}
                    checked={isChecked}
                    onChange={() => onCheckboxChange(optionValue)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`${question.id}-${index}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  >
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </fieldset>
        );
      default:
        return (
          <div className="text-red-600 dark:text-red-400">
            Unsupported input type: {question.type}
          </div>
        );
    }
  }
);

export default InputRenderer;
