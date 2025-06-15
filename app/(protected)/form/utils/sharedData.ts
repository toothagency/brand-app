import {
    ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Circle, Download, Share2, Palette,
    FileText, MessageSquare, Target, Sparkles, Eye, EyeOff, Icon as LucideIcon
} from 'lucide-react';
import { QuestionDefinition, StepDefinition } from './types';

export const STEPS_DATA: StepDefinition[] = [
    {
        title: "Strategy",
        icon: Target,
        color: "blue",
        questions: [
            { id: "purpose", question: "Describe what your business idea is and what change your brand wants to make in people's lives?", subtitle: "Think about the core problem you solve or the transformation you create", placeholder: "e.g., Help busy parents save time on healthy meal planning", type: "textarea", required: true, category: "strategy" },
            { id: "vision", question: "If your brand had achieved all its goals in 10 years, what would the world look like?", subtitle: "Your ultimate destination - the big picture impact", placeholder: "e.g., A world where every family enjoys stress-free, healthy dinners together", type: "textarea", required: true, category: "strategy" },
            { id: "mission", question: "How do you achieve your purpose on a day-to-day basis?", subtitle: "Your daily actions and operations that drive toward your vision", placeholder: "e.g., By creating personalized meal plans and grocery lists in under 5 minutes", type: "textarea", required: true, category: "strategy" },
            { id: "values", question: "Choose 3 words that describe the kind of business you want to build. Why those words?", subtitle: "Your core principles and beliefs that guide decisions", placeholder: "e.g., Trustworthy, Innovative, Family-focused - because...", type: "textarea", required: true, category: "strategy" },
            { id: "audience", question: "Describe your ideal customer like a person: what are they struggling with, and how do you help?", subtitle: "Paint a detailed picture of who you serve", placeholder: "e.g., Sarah, 32, working mom of 2, struggles with meal planning after long work days...", type: "textarea", required: true, category: "strategy" },
            { id: "competitors", question: "Who else is doing what you're doing—and what do they do well or badly?", subtitle: "Understanding your competitive landscape", placeholder: "e.g., HelloFresh does convenience well but lacks personalization...", type: "textarea", required: true, category: "strategy" },
            { id: "differentiation", question: "Why would someone choose you instead of your competitors?", subtitle: "Your unique value proposition", placeholder: "e.g., We're the only service that adapts to dietary restrictions and family preferences...", type: "textarea", required: true, category: "strategy" }
        ]
    },
    {
        title: "Communication",
        icon: MessageSquare,
        color: "green",
        questions: [
            { id: "personality", question: "Suggest a name for your brand and why you chose that name ?", subtitle: "Think about traits, characteristics, and how they'd behave", placeholder: "e.g., Like a helpful neighbor who's also a nutritionist - warm, knowledgeable, never pushy", type: "textarea", required: true, category: "communication" },
            { id: "customerFeelings", question: "What 3 words do you want customers to feel when they see your brand?", subtitle: "The emotional response you want to trigger", placeholder: "e.g., Confident, Supported, Inspired", type: "text", required: true, category: "communication" },
            { id: "brandVoice", question: "If your brand was a person, how would they talk?", subtitle: "Your communication style and tone", placeholder: "e.g., Warm and encouraging, like a supportive friend who gives great advice", type: "textarea", required: true, category: "communication" },
            { id: "brandStory", question: "Why did you start this brand? Tell us the story behind your 'aha' moment.", subtitle: "The origin story that connects with your audience", placeholder: "e.g., After struggling to feed my family healthy meals while working full-time, I realized...", type: "textarea", required: true, category: "communication" },
            { id: "boldPromise", question: "What's the boldest promise your brand can make to your customer?", subtitle: "A confident statement about the results you deliver", placeholder: "e.g., Healthy family dinners in 15 minutes or less, guaranteed", type: "text", required: true, category: "communication" },
            { id: "tagline", question: "If someone had to describe your brand in one sentence, what would you want them to say?", subtitle: "Your elevator pitch in one powerful sentence", placeholder: "e.g., The meal planning service that actually understands your family's needs", type: "text", required: true, category: "communication" }
        ]
    },
    {
        title: "Identity",
        icon: Palette,
        color: "purple", // This seems fine
        questions: [
            {
                id: "visualMood",
                question: "What mood should your visuals create?",
                subtitle: "The feeling people get when they see your brand",
                // placeholder: "e.g., Warm and trustworthy...", // Placeholder is optional for select
                type: "select",
                options: ["Playful", "Trustworthy", "Elegant", "Bold", "Minimalist", "Warm", "Professional", "Creative", "Luxurious", "Approachable"],
                required: true,
                category: "identity"
            },
            {
                id: "industryDifferentiation",
                question: "How do you want people to feel when they see your visuals ?",
                subtitle: "How you stand apart visually from your industry norms",
                placeholder: "e.g., Food tech industry - want to feel more personal and less corporate than competitors",
                type: "textarea",
                required: true,
                category: "identity"
            },
            {
                id: "colorAssociations",
                question: "Are there any colors or visuals you associate with your brand already? Why those?",
                subtitle: "Existing color preferences or visual elements you connect with",
                placeholder: "e.g., Warm oranges and greens - orange for energy, green for health and freshness",
                type: "textarea",
                required: false, // Note: this is not required
                category: "identity"
            },
            {
                id: "visualStyle",
                question: "Do you want your brand to look more classic or modern? Serious or fun? Text-heavy or image-driven?",
                subtitle: "Visual style preferences across different spectrums",
                placeholder: "e.g., Modern but approachable, fun but trustworthy, image-driven with clean text",
                type: "textarea",
                required: true,
                category: "identity"
            }
        ]
    },
    {
        title: "Marketing",
        icon: FileText,
        color: "orange",
        questions: [
            { id: "primaryGoal", question: "What's the #1 thing you want your audience to do when they see your posts?", subtitle: "Your main call-to-action across all marketing", type: "select", options: ["Follow/Subscribe", "Visit Website", "Make Purchase", "Download Resource", "Book Consultation", "Share Content", "Join Community"], required: true, category: "marketing" },
            { id: "contentPreferences", question: "What kind of content do you think your customers already enjoy or share?", subtitle: "Content types that resonate with your audience", placeholder: "e.g., Quick recipe videos, meal prep tips, family dinner photos, nutrition facts", type: "textarea", required: true, category: "marketing" },
            { id: "channels", question: "What channels are you most active on—or want to focus on?", subtitle: "Your primary marketing and social media platforms", type: "checkbox", options: ["Instagram", "Facebook", "TikTok", "LinkedIn", "Twitter/X", "YouTube", "WhatsApp", "Email", "Blog/Website"], required: true, category: "marketing" },
            { id: "objections", question: "List 3 objections people have to buying from you, and how you would respond to each.", subtitle: "Common hesitations and your responses", placeholder: "e.g., 'Too expensive' - We save you more money than we cost by reducing food waste...", type: "textarea", required: true, category: "marketing" }
        ]
    }
];
export const TOTAL_QUESTIONS_COUNT = STEPS_DATA.reduce((acc, step) => acc + step.questions.length, 0);

