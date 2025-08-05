// ./utils/types.ts
import type { ElementType, SVGProps } from 'react';

// --- Form Interaction Types ---
export interface FormData { [key: string]: string | string[]; }
export type QuestionType = "textarea" | "text" | "select" | "checkbox";
export interface QuestionOption { label: string; value: string; }
export interface QuestionDefinition {
  description: any;
  id: string; question: string; subtitle: string; placeholder?: string;
  type: QuestionType; required: boolean; category: string; options?: string[] | QuestionOption[];
}
export interface StepDefinition {
  title: string; icon: ElementType<SVGProps<SVGSVGElement>>;
  color: "blue" | "green" | "purple" | "orange"; // Or your primary color string type
  questions: QuestionDefinition[];
}

// --- API and Mutation Payloads ---
export interface CreateBrandRequest { userId: string; }
export interface SubmitAnswerPayload { question: number; section: number; answer: string | string[] | undefined; userId: string; brandId: string; }
export interface FetchSuggestionsPayload { question: number; section: number; brandId: string; userId: string; }

// --- API Responses ---
export interface BackendErrorData { message?: string; error?: string; details?: any; }

// DETAILED BrandObject (for get_brand_results)
export interface BrandObjectApplication { application_type: string; prompt: string; }
export interface BrandObjectLogoVariant { alternative_logo?: string; primary_logo?: string; secondary_logo?: string; }
export interface BrandObjectLogo { description: string; image_url: string; }
export interface BrandObjectColor { color_name: string; description: string; hex_value: string; }
export interface BrandObjectTypography { description: string; font_family: string; font_size: string; font_weight: string; line_height: string; }
export interface BrandObjectPrimaryCoreMessage { our_key_differences: string; the_key_benefits_they_get: string; their_market_alternative: string; where_they_need_help: string; who_we_serve: string; }
export interface BrandObjectCommunication { brand_name: string; brand_tagline: string; primary_core_message: BrandObjectPrimaryCoreMessage; }
export interface BrandObjectIdentity { about_the_brand: string; applications: BrandObjectApplication[]; logo_variants: BrandObjectLogoVariant; logos: BrandObjectLogo[]; primary_colors: BrandObjectColor[]; reommended_logo: string; secondary_colors: BrandObjectColor[]; typography: BrandObjectTypography[]; }
export interface BrandObjectStrategyOurMission { we_are_committed_to: string; }
export interface BrandObjectStrategyOurPurpose { purpose_statement: string; title: string; we_believe_in_something_bigger_than_ourselves: string; what_our_customers_mean_to_us: string; }
export interface BrandObjectStrategyOurValues { how_we_do_wellness_business: string; values: string[]; }
export interface BrandObjectStrategyOurVision { our_vision_is_bright: string; }
export interface BrandObjectStrategySubstance { our_mission: BrandObjectStrategyOurMission; our_purpose: BrandObjectStrategyOurPurpose; our_values: BrandObjectStrategyOurValues; our_vision: BrandObjectStrategyOurVision; }
export interface BrandObjectStrategyOurPosition { challenges_and_pain_points: string; demographics: string; desires: string; fears: string; name: string; personality: string; psychographics: string; }
export interface BrandObjectWhyWeAreDifferent { positioning_statement: string; the_difference_we_provide: string; }
export interface BrandObjectStrategy { brand_substance: BrandObjectStrategySubstance; our_position: BrandObjectStrategyOurPosition; top_competitors: string; why_we_are_different: BrandObjectWhyWeAreDifferent; }
export interface BrandObjectMarketingAndSocialMediaStrategy { content_calender: string; }

export interface DetailedBrandObject { // This is the main object from get_brand_results
  id: string;
  brand_communication: BrandObjectCommunication;
  brand_identity: BrandObjectIdentity;
  brand_strategy: BrandObjectStrategy;
  marketing_and_social_media_strategy: BrandObjectMarketingAndSocialMediaStrategy;
  userId: string;
  createdAt?: string; // If present in detailed results
  updatedAt?: string; // If present in detailed results
}

// INITIAL BrandObject (for create_brand response)
export interface InitialBrandObject {
  id: string; // This is the brandId
  userId: string;
  answerId?: string;
  brand_communication?: string;
  brand_identity?: string;
  brand_strategy?: string;
  logo?: string;
  marketing_and_social_media_strategy?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandResponse {
  success: boolean;
  message: string;
  brand: InitialBrandObject;
}

export interface SubmitAnswerResponse { success: boolean; message: string; }
export interface SuggestionsResponseBody { question: number; section: number; suggestions: string[]; userId: string; }

export type CalendarEntry = {
  date: string;
  event: string;
  design_concept: string; // Based on "Design concept" header
  caption: string;
  // Add other potential keys if your header row in content_calender can vary
  // and you want them to be typed. Otherwise, [key: string]: string handles extras.
  [key: string]: string; // Allows for any other dynamically created keys from the header
};