// --- ADJUST PATHS AS NEEDED ---
import type { QuestionType } from './types'; // Assuming QuestionType is defined in your types file
// --- END ADJUST PATHS ---

export const isClientAnswerFormatValid = (
    answer: string | string[] | undefined,
    questionType: QuestionType // Type of the question (e.g., 'text', 'textarea', 'checkbox', 'select')
): boolean => {
  if (answer === undefined) {
    // If an answer is undefined, it's typically considered invalid for a required field.
    // For non-required fields, this might be acceptable, but the 'required' check happens before calling this.
    return false;
  }

  switch (questionType) {
    case 'text':
    case 'textarea':
    case 'select': // Selects also store string values in our setup
      if (typeof answer === 'string') {
        return answer.trim() !== ''; // Valid if it's a non-empty string after trimming whitespace
      }
      return false; // Invalid if not a string for these types

    case 'checkbox':
      if (Array.isArray(answer)) {
        return answer.length > 0; // Valid if it's an array with at least one selection
      }
      return false; // Invalid if not an array for checkbox type

    default:
      // For any unknown or unhandled question types, or if the answer type doesn't match expectations
      console.warn(`isClientAnswerFormatValid: Unhandled question type "${questionType}" or unexpected answer type.`);
      return false; 
  }
};

// You would also have your generateSuggestions function here
export const generateSuggestions = (formData: any, currentQuestionData: any): string[] => {
  // ... your existing suggestion logic ...
  if (!currentQuestionData) return [];
  const suggestions: string[] = [];
  const currentId = currentQuestionData.id;

  const detectIndustry = () => {
    const text = Object.values(formData).flat().join(' ').toLowerCase();
    if (text.includes('food')) return 'food';
    if (text.includes('tech')) return 'tech';
    return 'general';
  };
  const industry = detectIndustry();

  if (currentId === 'vision' && formData.purpose && typeof formData.purpose === 'string') {
    const purpose = (formData.purpose as string).toLowerCase();
    if (purpose.includes('save time')) suggestions.push("A world where time-consuming tasks are eliminated.");
    if (purpose.includes('health')) suggestions.push("A healthier, happier global community.");
  }
  // Add more suggestion logic based on your needs
  return suggestions.slice(0, 2);
};

// Other helper functions can go here