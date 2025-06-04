import { QuestionDefinition, QuestionType } from "./types";
import { FormData } from "./types";
export const generateSuggestions = (formData: FormData, currentQuestionData?: QuestionDefinition): string[] => {
  if (!currentQuestionData) return [];
  const suggestions: string[] = [];
  const currentId = currentQuestionData.id;

  const detectIndustry = () => {
    const text = Object.values(formData).flat().join(' ').toLowerCase();
    if (text.includes('food') || text.includes('meal') || text.includes('recipe')) return 'food';
    if (text.includes('tech') || text.includes('software') || text.includes('app')) return 'tech';
    if (text.includes('health') || text.includes('fitness') || text.includes('wellness')) return 'health';
    return 'general';
  };
  const industry = detectIndustry();

  if (currentId === 'vision' && formData.purpose && typeof formData.purpose === 'string') {
    const purpose = (formData.purpose as string).toLowerCase();
    if (purpose.includes('save time')) suggestions.push("A world where time-consuming tasks are eliminated, giving people more moments for what truly matters.");
    if (purpose.includes('health')) suggestions.push("A healthier, happier global community where wellness is the norm.");
  }
  if (currentId === 'mission' && formData.purpose) {
    if (industry === 'food') suggestions.push("Creating personalized nutrition solutions that fit real family life.");
    if (industry === 'tech') suggestions.push("Building intuitive tools that solve complex problems simply.");
  }
  if (currentId === 'personality' && formData.values && typeof formData.values === 'string') {
    const values = (formData.values as string).toLowerCase();
    if (values.includes('trustworthy')) suggestions.push("Like a reliable friend who always gives honest advice - dependable, transparent, and genuinely caring.");
    if (values.includes('innovative')) suggestions.push("Like a creative problem-solver who sees possibilities everywhere - forward-thinking and inspiring.");
  }
  return suggestions.slice(0, 2); // Max 2 suggestions
};

export const isAnswerValid = (answer: string | string[] | undefined, questionType: QuestionType): boolean => {
  if (answer === undefined) return false;
  if (questionType === 'checkbox') {
    return Array.isArray(answer) && answer.length > 0;
  }
  if (typeof answer === 'string') {
    return answer.trim() !== '';
  }
  return false; // Should not happen for defined types
};
