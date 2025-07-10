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
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

  switch (question.type) {
    case "textarea":
      return (
        <div className="relative">
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px] pr-12"
            rows={4}
            placeholder={question.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={question.question}
          />
          <button
            type="button"
            onClick={handleMicClick}
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Start speech to text"
            tabIndex={0}
          >
            {listening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </button>
          {listening && (
            <span className="absolute top-2 right-14 px-2 py-1 rounded-full bg-blue-500 text-white text-xs shadow font-semibold animate-pulse select-none">
              Listening...
            </span>
          )}
        </div>
      );
    case "text":
      return (
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
            placeholder={question.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            aria-label={question.question}
          />
          <button
            type="button"
            onClick={handleMicClick}
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Start speech to text"
            tabIndex={0}
          >
            {listening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </button>
          {listening && (
            <span className="absolute top-2 right-14 px-2 py-1 rounded-full bg-blue-500 text-white text-xs shadow font-semibold animate-pulse select-none">
              Listening...
            </span>
          )}
        </div>
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
