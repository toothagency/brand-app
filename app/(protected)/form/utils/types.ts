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
