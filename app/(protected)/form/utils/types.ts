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
  brandId?: string;

  name: string;

  logo: string;
  brand_communication: BrandObjectCommunication;
  brand_identity: BrandObjectIdentity;
  brand_strategy: BrandObjectStrategy;
  marketing_and_social_media_strategy: BrandObjectMarketingAndSocialMediaStrategy;
  userId: string;
  created_at?: string; // If present in detailed results
  updated_at?: string; // If present in detailed results

  premium: boolean,
  payment_status: boolean
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
export interface SuggestionsResponseBody { success: boolean; message: string; question: number; section: number; suggestions: string[]; userId: string; }

// --- Full Results Response Interfaces ---

// Brand Assets Interfaces
export interface BrandPattern {
  image_url: string;
  prompt: string;
}

export interface BusinessCard {
  image_url: string;
  prompt: string;
}

export interface CapMockup {
  image_url: string;
  prompt: string;
}

export interface Letterhead {
  image_url: string;
  prompt: string;
}

export interface Signboard {
  image_url: string;
  prompt: string;
}

export interface TShirtMockup {
  image_url: string;
  prompt: string;
}

export interface FullBrandIdentity {
  brand_colors: any[];
  brand_identity_description: string;
  brand_name: string;
  brand_patterns: BrandPattern[];
  brand_typography: Record<string, any>;
  business_cards: BusinessCard[];
  cap_mockups: CapMockup[];
  letterheads: Letterhead[];
  signboards: Signboard[];
  t_shirt_mockups: TShirtMockup[];
}

// Premium Assets Interfaces
export interface BrandVoice {
  communication_style: string;
  do_not_use: string[];
  personality_traits: string[];
  tone: string;
}

export interface LogoUsageRule {
  description: string;
  examples: string;
  rule: string;
}

export interface ColorUsage {
  color_name: string;
  do_not_use_for: string;
  hex_value: string;
  usage_context: string;
}

export interface SpacingGuideline {
  description: string;
  element: string;
  margin: string;
  padding: string;
}

export interface TypographyRule {
  font_family: string;
  line_height: string;
  size_range: string;
  spacing: string;
  usage: string;
}

export interface StyleGuide {
  color_usage: ColorUsage[];
  spacing_guidelines: SpacingGuideline[];
  typography_rules: TypographyRule[];
}

export interface VisualHierarchy {
  element: string;
  guidelines: string;
  priority: string;
}

export interface BrandGuidelines {
  brand_voice: BrandVoice;
  logo_usage_rules: LogoUsageRule[];
  style_guide: StyleGuide;
  visual_hierarchy: VisualHierarchy[];
}

export interface CompetitorAnalysis {
  competitor_name: string;
  differentiation_opportunities: string[];
  market_position: string;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketPositioning {
  competitive_advantages: string[];
  market_gaps: string[];
  positioning_statement: string;
  value_proposition: string;
}

export interface SwotAnalysis {
  opportunities: string[];
  strengths: string[];
  threats: string[];
  weaknesses: string[];
}

export interface TargetAudienceProfile {
  buying_behavior: string;
  demographics: string;
  motivations: string[];
  pain_points: string[];
  persona_name: string;
  psychographics: string;
}

export interface BusinessStrategy {
  competitive_analysis: CompetitorAnalysis[];
  market_positioning: MarketPositioning;
  swot_analysis: SwotAnalysis;
  target_audience_profiles: TargetAudienceProfile[];
}

export interface ColorProfile {
  color_values: string;
  conversion_notes: string;
  profile_type: string;
  usage_context: string;
}

export interface DigitalSpecification {
  dimensions: string;
  file_size: string;
  format: string;
  optimization_notes: string;
  platform: string;
}

export interface FileFormatGuideline {
  file_naming: string;
  format: string;
  specifications: string;
  use_case: string;
}

export interface PrintSpecification {
  bleed: string;
  color_mode: string;
  margins: string;
  material: string;
  resolution: string;
}

export interface DigitalSpecifications {
  color_profiles: ColorProfile[];
  digital_specifications: DigitalSpecification[];
  file_format_guidelines: FileFormatGuideline[];
  print_specifications: PrintSpecification[];
}

export interface BudgetEstimate {
  category: string;
  description: string;
  estimated_cost: string;
  priority: string;
}

export interface LaunchTimeline {
  deliverables: string[];
  duration: string;
  milestones: string[];
  phase: string;
  resources_needed: string[];
}

export interface QualityAssurance {
  checkpoint: string;
  criteria: string[];
  success_metrics: string[];
  testing_method: string;
}

export interface VendorRecommendation {
  estimated_cost_range: string;
  recommended_vendors: string[];
  selection_criteria: string[];
  service_type: string;
}

export interface ImplementationRoadmap {
  budget_estimates: BudgetEstimate[];
  launch_timeline: LaunchTimeline[];
  quality_assurance: QualityAssurance[];
  vendor_recommendations: VendorRecommendation[];
}

export interface BrochureContent {
  call_to_action: string;
  content: string;
  section_title: string;
}

export interface EmailTemplate {
  body: string;
  closing: string;
  greeting: string;
  signature: string;
  subject_line: string;
  template_name: string;
}

export interface LandingPageCopy {
  benefits: string[];
  call_to_action: string;
  features: string[];
  hero_headline: string;
  hero_subheadline: string;
  testimonials: string[];
}

export interface PresentationTemplate {
  content: string;
  key_points: string[];
  slide_title: string;
  visual_suggestions: string;
}

export interface MarketingTemplates {
  brochure_content: BrochureContent[];
  email_templates: EmailTemplate[];
  landing_page_copy: LandingPageCopy;
  presentation_templates: PresentationTemplate[];
}

export interface PremiumAssets {
  brand_guidelines: BrandGuidelines;
  business_strategy: BusinessStrategy;
  digital_specifications: DigitalSpecifications;
  implementation_roadmap: ImplementationRoadmap;
  marketing_templates: MarketingTemplates;
}

export interface SocialMediaContent {
  ad_copies: string[];
  ready_made_posts: {
    caption: string;
    design_concept: string;
  }[];
  relevant_marketing_strategies: string[];
}

export interface BrandAssets {
  brandId: string;
  created_at: string;
  full_brand_identity: FullBrandIdentity;
  id: string;
  premium_assets: PremiumAssets;
  social_media_content: SocialMediaContent;
  updated_at: string;
  userId: string;
}

export interface FullBrand{
  brand: DetailedBrandObject;
  brand_assets: BrandAssets;

}
// Full Results Response
export interface FullBrandResponse {
  full_brand: FullBrand
  message: string;
  success: boolean;
}

export type CalendarEntry = {
  date: string;
  event: string;
  design_concept: string; // Based on "Design concept" header
  caption: string;
  // Add other potential keys if your header row in content_calender can vary
  // and you want them to be typed. Otherwise, [key: string]: string handles extras.
  [key: string]: string; // Allows for any other dynamically created keys from the header
};