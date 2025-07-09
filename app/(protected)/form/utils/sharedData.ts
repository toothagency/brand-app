import {
    ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Circle, Download, Share2, Palette,
    FileText, MessageSquare, Target, Sparkles, Eye, EyeOff, Icon as LucideIcon
} from 'lucide-react';
import { QuestionDefinition, StepDefinition } from './types';   

export const STEPS_DATA: StepDefinition[] = [
    {
        title: "Brand Strategy",
        icon: Target,
        color: "blue",
        questions: [
            {
                id: "businessIdea",
                question: "What's your business idea, and what problem does it solve for people?",
                subtitle: "Maps to: Purpose, Audience Persona, Differentiation",
                placeholder: "e.g., Help busy parents save time on healthy meal planning",
                type: "textarea",
                required: true,
                category: "strategy"
            },
            {
                id: "vision10Years",
                question: "If your brand were wildly successful in 10 years, what would the world look like?",
                subtitle: "Maps to: Vision",
                placeholder: "e.g., A world where every family enjoys stress-free, healthy dinners together",
                type: "textarea",
                required: true,
                category: "strategy"
            },
            {
                id: "threeWords",
                question: "What are three words you want people to associate with your brand — and why?",
                subtitle: "Maps to: Values, Tone, Visual mood",
                placeholder: "e.g., Trustworthy, Innovative, Family-focused - because...",
                type: "textarea",
                required: true,
                category: "strategy"
            },
            {
                id: "idealCustomer",
                question: "Describe your ideal customer — who are they, what are they struggling with, and how does your brand help?",
                subtitle: "Maps to: Audience Persona, Brand Voice, Content style",
                placeholder: "e.g., Sarah, 32, working mom of 2, struggles with meal planning after long work days...",
                type: "textarea",
                required: true,
                category: "strategy"
            },
            {
                id: "competitorsDifferentiation",
                question: "Who else is solving this problem, and what makes your solution different or better?",
                subtitle: "Maps to: Competitors, Differentiation",
                placeholder: "e.g., HelloFresh does convenience well but lacks personalization...",
                type: "textarea",
                required: true,
                category: "strategy"
            }
        ]
    },
    {
        title: "Brand Communication",
        icon: MessageSquare,
        color: "green",
        questions: [
            {
                id: "brandNameStoryVoice",
                question: "What name do you want for your brand? Why did you choose it?",
                subtitle: "Maps to: Name, Story, Voice",
                placeholder: "e.g., Like a helpful neighbor who's also a nutritionist - warm, knowledgeable, never pushy",
                type: "textarea",
                required: true,
                category: "communication"
            },
            {
                id: "boldPromise",
                question: "What's the boldest promise your brand can confidently make to its customers?",
                subtitle: "Maps to: Hook, Tagline, Messaging",
                placeholder: "e.g., Healthy family dinners in 15 minutes or less, guaranteed",
                type: "textarea",
                required: true,
                category: "communication"
            }
        ]
    },
    {
        title: "Brand Identity",
        icon: Palette,
        color: "purple",
        questions: [
            {
                id: "visualLookFeel",
                question: "How should your brand look and feel visually? (e.g., playful, elegant, bold, modern, classic, etc.)",
                subtitle: "Maps to: Logo direction, color, typography, image style",
                placeholder: "e.g., Modern but approachable, fun but trustworthy, image-driven with clean text",
                type: "textarea",
                required: true,
                category: "identity"
            }
        ]
    },
    {
        title: "Marketing Content",
        icon: FileText,
        color: "orange",
        questions: [
            {
                id: "audienceChannels",
                question: "Where will your audience mostly interact with your brand? (Instagram, WhatsApp, TikTok, LinkedIn, etc.)",
                subtitle: "Maps to: Social media strategy, content format",
                placeholder: "e.g., Instagram, WhatsApp, and LinkedIn",
                type: "text",
                required: true,
                category: "marketing"
            },
            {
                id: "mainContentGoal",
                question: "What's the main thing you want people to do when they see your content? (Trust you? Buy? Follow?)",
                subtitle: "Maps to: Marketing CTA, content objective, strategy",
                placeholder: "e.g., Trust us and follow for more tips",
                type: "text",
                required: true,
                category: "marketing"
            }
        ]
    }
];
export const TOTAL_QUESTIONS_COUNT = STEPS_DATA.reduce((acc, step) => acc + step.questions.length, 0);

