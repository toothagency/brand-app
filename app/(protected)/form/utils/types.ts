import {
  ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Circle, Download, Share2, Palette,
  FileText, MessageSquare, Target, Sparkles, Eye, EyeOff, Icon as LucideIcon
} from 'lucide-react';
export type QuestionType = "textarea" | "text" | "select" | "checkbox";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionDefinition {
  id: string;
  question: string;
  subtitle: string;
  placeholder?: string;
  type: QuestionType;
  required: boolean;
  category: "strategy" | "communication" | "identity" | "marketing";
  options?: string[] | QuestionOption[]; // For select/checkbox
}

export interface StepDefinition {
  title: string;
  icon: React.ElementType<React.SVGProps<SVGSVGElement>>;
  color: "blue" | "green" | "purple" | "orange"; // Tailwind color prefixes
  questions: QuestionDefinition[];
}

export interface FormData {
  [key: string]: string | string[]; // string for text/textarea/select, string[] for checkbox
}

export interface GeneratedBrand {
  brandName: string;
  tagline: string;
  colorPalette: string[];
  logoIdeas: string[];
  socialPosts: string[];
  brandGuidelines: {
    voice: string;
    tone: string;
    messaging: string;
  };
}


export interface SubmitAnswerPayload {
  question: number; 
  section: number;  
  answer: string | string[] | undefined;
  userId: string;
  brandId: string;
}

export interface SubmitAnswerResponse { // For successful submissions
  success: boolean;
  message: string;
}

// For backend error responses (specifically for send_answer)
export interface BackendErrorData {
    error?: boolean; // Optional, as it might not always be present
    message: string; // This is the key field we want
    // Potentially other fields your backend might send in an error
    // details?: Record<string, string> | string; 
}


export interface FetchSuggestionsPayload {
  question: number; 
  section: number;  
  brandId: string;
  userId: string;
}

export interface SuggestionResponseData {
  question: number;
  section: number;
  suggestions: string[];
  userId: string;
}

export interface BackendSuggestionResponseType {
  status?: number;
  statusText?: string;
  url?: string;
  data: SuggestionResponseData;
  timestamp?: string;
}

export interface BrandObject {
  id: string; 
  answerId?: string; 
  brand_communication?: string;
  brand_identity?: string;
  brand_strategy?: string;
  logo?: string;
  marketing_and_social_media_strategy?: string;
  name?: string;
  userId: string;
}
export interface CreateBrandResponse {
  success: boolean;
  message: string;
  brand: BrandObject;
}
export interface CreateBrandRequest {
  userId: string;
}