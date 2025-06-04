'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle, Circle, Download, Share2, Palette, FileText, MessageSquare, Target, Sparkles, Eye, EyeOff } from 'lucide-react';

// const FullBrandingForm = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [generatedBrand, setGeneratedBrand] = useState(null);
//   const [showContextPanel, setShowContextPanel] = useState(true);

//   // Complete form structure with all 4 steps
//   const steps = [
//     {
//       title: "Brand Strategy",
//       icon: Target,
//       color: "blue",
//       questions: [
//         {
//           id: "purpose",
//           question: "What change do you want your brand to make in people's lives?",
//           subtitle: "Think about the core problem you solve or the transformation you create",
//           placeholder: "e.g., Help busy parents save time on healthy meal planning",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "vision",
//           question: "If your brand had achieved all its goals in 10 years, what would the world look like?",
//           subtitle: "Your ultimate destination - the big picture impact",
//           placeholder: "e.g., A world where every family enjoys stress-free, healthy dinners together",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "mission",
//           question: "How do you achieve your purpose on a day-to-day basis?",
//           subtitle: "Your daily actions and operations that drive toward your vision",
//           placeholder: "e.g., By creating personalized meal plans and grocery lists in under 5 minutes",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "values",
//           question: "Choose 3 words that describe the kind of business you want to build. Why those words?",
//           subtitle: "Your core principles and beliefs that guide decisions",
//           placeholder: "e.g., Trustworthy, Innovative, Family-focused - because...",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "audience",
//           question: "Describe your ideal customer like a person: what are they struggling with, and how do you help?",
//           subtitle: "Paint a detailed picture of who you serve",
//           placeholder: "e.g., Sarah, 32, working mom of 2, struggles with meal planning after long work days...",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "competitors",
//           question: "Who else is doing what you're doing—and what do they do well or badly?",
//           subtitle: "Understanding your competitive landscape",
//           placeholder: "e.g., HelloFresh does convenience well but lacks personalization...",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         },
//         {
//           id: "differentiation",
//           question: "Why would someone choose you instead of your competitors?",
//           subtitle: "Your unique value proposition",
//           placeholder: "e.g., We're the only service that adapts to dietary restrictions and family preferences...",
//           type: "textarea",
//           required: true,
//           category: "strategy"
//         }
//       ]
//     },
//     {
//       title: "Brand Communication",
//       icon: MessageSquare,
//       color: "green",
//       questions: [
//         {
//           id: "personality",
//           question: "If your business was a person, what kind of personality would it have?",
//           subtitle: "Think about traits, characteristics, and how they'd behave",
//           placeholder: "e.g., Like a helpful neighbor who's also a nutritionist - warm, knowledgeable, never pushy",
//           type: "textarea",
//           required: true,
//           category: "communication"
//         },
//         {
//           id: "customerFeelings",
//           question: "What 3 words do you want customers to feel when they see your brand?",
//           subtitle: "The emotional response you want to trigger",
//           placeholder: "e.g., Confident, Supported, Inspired",
//           type: "text",
//           required: true,
//           category: "communication"
//         },
//         {
//           id: "brandVoice",
//           question: "If your brand was a person, how would they talk?",
//           subtitle: "Your communication style and tone",
//           placeholder: "e.g., Warm and encouraging, like a supportive friend who gives great advice",
//           type: "textarea",
//           required: true,
//           category: "communication"
//         },
//         {
//           id: "brandStory",
//           question: "Why did you start this brand? Tell us the story behind your 'aha' moment.",
//           subtitle: "The origin story that connects with your audience",
//           placeholder: "e.g., After struggling to feed my family healthy meals while working full-time, I realized...",
//           type: "textarea",
//           required: true,
//           category: "communication"
//         },
//         {
//           id: "boldPromise",
//           question: "What's the boldest promise your brand can make to your customer?",
//           subtitle: "A confident statement about the results you deliver",
//           placeholder: "e.g., Healthy family dinners in 15 minutes or less, guaranteed",
//           type: "text",
//           required: true,
//           category: "communication"
//         },
//         {
//           id: "tagline",
//           question: "If someone had to describe your brand in one sentence, what would you want them to say?",
//           subtitle: "Your elevator pitch in one powerful sentence",
//           placeholder: "e.g., The meal planning service that actually understands your family's needs",
//           type: "text",
//           required: true,
//           category: "communication"
//         }
//       ]
//     },
//     {
//       title: "Brand Identity",
//       icon: Palette,
//       color: "purple",
//       questions: [
//         {
//           id: "visualMood",
//           question: "What mood should your visuals create?",
//           subtitle: "The feeling people get when they see your brand",
//           placeholder: "e.g., Warm and trustworthy, like a cozy kitchen where families gather",
//           type: "select",
//           options: ["Playful", "Trustworthy", "Elegant", "Bold", "Minimalist", "Warm", "Professional", "Creative", "Luxurious", "Approachable"],
//           required: true,
//           category: "identity"
//         },
//         {
//           id: "industryDifferentiation",
//           question: "What industry are you in, and what do you want to feel different about you?",
//           subtitle: "How you stand apart visually from your industry norms",
//           placeholder: "e.g., Food tech industry - want to feel more personal and less corporate than competitors",
//           type: "textarea",
//           required: true,
//           category: "identity"
//         },
//         {
//           id: "colorAssociations",
//           question: "Are there any colors or visuals you associate with your brand already? Why those?",
//           subtitle: "Existing color preferences or visual elements you connect with",
//           placeholder: "e.g., Warm oranges and greens - orange for energy, green for health and freshness",
//           type: "textarea",
//           required: false,
//           category: "identity"
//         },
//         {
//           id: "visualStyle",
//           question: "Do you want your brand to look more classic or modern? Serious or fun? Text-heavy or image-driven?",
//           subtitle: "Visual style preferences across different spectrums",
//           placeholder: "e.g., Modern but approachable, fun but trustworthy, image-driven with clean text",
//           type: "textarea",
//           required: true,
//           category: "identity"
//         }
//       ]
//     },
//     {
//       title: "Marketing Strategy",
//       icon: FileText,
//       color: "orange",
//       questions: [
//         {
//           id: "primaryGoal",
//           question: "What's the #1 thing you want your audience to do when they see your posts?",
//           subtitle: "Your main call-to-action across all marketing",
//           placeholder: "e.g., Sign up for our free meal planning guide",
//           type: "select",
//           options: ["Follow/Subscribe", "Visit Website", "Make Purchase", "Download Resource", "Book Consultation", "Share Content", "Join Community"],
//           required: true,
//           category: "marketing"
//         },
//         {
//           id: "contentPreferences",
//           question: "What kind of content do you think your customers already enjoy or share?",
//           subtitle: "Content types that resonate with your audience",
//           placeholder: "e.g., Quick recipe videos, meal prep tips, family dinner photos, nutrition facts",
//           type: "textarea",
//           required: true,
//           category: "marketing"
//         },
//         {
//           id: "channels",
//           question: "What channels are you most active on—or want to focus on?",
//           subtitle: "Your primary marketing and social media platforms",
//           placeholder: "e.g., Instagram for visual content, Facebook for community building",
//           type: "checkbox",
//           options: ["Instagram", "Facebook", "TikTok", "LinkedIn", "Twitter/X", "YouTube", "WhatsApp", "Email", "Blog/Website"],
//           required: true,
//           category: "marketing"
//         },
//         {
//           id: "objections",
//           question: "List 3 objections people have to buying from you, and how you would respond to each.",
//           subtitle: "Common hesitations and your responses",
//           placeholder: "e.g., 'Too expensive' - We save you more money than we cost by reducing food waste...",
//           type: "textarea",
//           required: true,
//           category: "marketing"
//         }
//       ]
//     }
//   ];

//   const currentStepData = steps[currentStep - 1];
//   const currentQuestionData = currentStepData?.questions[currentQuestion];
//   const totalSteps = steps.length;
//   const totalQuestions = currentStepData?.questions.length || 0;

//   // Advanced suggestion system
//   const generateSuggestions = () => {
//     const suggestions = [];
//     const currentId = currentQuestionData?.id;
    
//     // Industry detection
//     const detectIndustry = () => {
//       const text = Object.values(formData).join(' ').toLowerCase();
//       if (text.includes('food') || text.includes('meal') || text.includes('recipe')) return 'food';
//       if (text.includes('tech') || text.includes('software') || text.includes('app')) return 'tech';
//       if (text.includes('health') || text.includes('fitness') || text.includes('wellness')) return 'health';
//       if (text.includes('education') || text.includes('learn') || text.includes('course')) return 'education';
//       if (text.includes('fashion') || text.includes('clothing') || text.includes('style')) return 'fashion';
//       return 'general';
//     };

//     const industry = detectIndustry();

//     // Strategy-based suggestions
//     if (currentId === 'vision' && formData.purpose) {
//       const purpose = formData.purpose.toLowerCase();
//       if (purpose.includes('save time')) {
//         suggestions.push("A world where time-consuming tasks are eliminated, giving people more moments for what truly matters");
//         suggestions.push("Every person has an extra hour each day to spend with loved ones");
//       }
//       if (purpose.includes('health')) {
//         suggestions.push("A healthier, happier global community where wellness is the norm");
//         suggestions.push("Healthy living is accessible, affordable, and achievable for everyone");
//       }
//       if (purpose.includes('business') || purpose.includes('entrepreneur')) {
//         suggestions.push("A world where every entrepreneur has the tools to succeed");
//         suggestions.push("Small businesses thrive and communities prosper together");
//       }
//     }

//     if (currentId === 'mission' && formData.purpose) {
//       const purpose = formData.purpose.toLowerCase();
//       if (industry === 'food') {
//         suggestions.push("Creating personalized nutrition solutions that fit real family life");
//         suggestions.push("Simplifying healthy eating through smart meal planning technology");
//       }
//       if (industry === 'tech') {
//         suggestions.push("Building intuitive tools that solve complex problems simply");
//         suggestions.push("Connecting people with technology that enhances their daily lives");
//       }
//     }

//     // Communication-based suggestions
//     if (currentId === 'personality' && formData.values) {
//       const values = formData.values.toLowerCase();
//       if (values.includes('trustworthy')) {
//         suggestions.push("Like a reliable friend who always gives honest advice - dependable, transparent, and genuinely caring");
//         suggestions.push("Professional yet warm, like your family doctor - knowledgeable but never condescending");
//       }
//       if (values.includes('innovative')) {
//         suggestions.push("Like a creative problem-solver who sees possibilities everywhere - forward-thinking and inspiring");
//         suggestions.push("Bold and experimental, like an inventor who's also your best friend");
//       }
//     }

//     if (currentId === 'brandVoice' && formData.personality) {
//       const personality = formData.personality.toLowerCase();
//       if (personality.includes('warm') || personality.includes('friendly')) {
//         suggestions.push("Conversational and encouraging, like texting with your most supportive friend");
//         suggestions.push("Warm and inclusive, using 'we' instead of 'you' to feel collaborative");
//       }
//       if (personality.includes('professional')) {
//         suggestions.push("Clear and confident, like a trusted advisor who explains complex things simply");
//         suggestions.push("Authoritative but approachable, like a teacher who makes learning fun");
//       }
//     }

//     // Identity-based suggestions
//     if (currentId === 'colorAssociations' && formData.visualMood) {
//       const mood = formData.visualMood.toLowerCase();
//       if (mood.includes('trustworthy')) {
//         suggestions.push("Deep blues for trust and reliability, with warm accents to feel approachable");
//         suggestions.push("Navy and white for professionalism, with touches of green for growth");
//       }
//       if (mood.includes('warm')) {
//         suggestions.push("Warm oranges and soft yellows that feel like sunshine and comfort");
//         suggestions.push("Earthy tones - terracotta, sage green, and cream for natural warmth");
//       }
//     }

//     // Marketing-based suggestions
//     if (currentId === 'contentPreferences' && formData.audience) {
//       const audience = formData.audience.toLowerCase();
//       if (audience.includes('busy') || audience.includes('parent')) {
//         suggestions.push("Quick tips and hacks, before/after transformations, relatable parenting moments");
//         suggestions.push("Time-saving tutorials, family-friendly content, real-life success stories");
//       }
//       if (audience.includes('professional') || audience.includes('business')) {
//         suggestions.push("Industry insights, case studies, behind-the-scenes content, thought leadership");
//         suggestions.push("Educational content, success stories, tool recommendations, productivity tips");
//       }
//     }

//     return suggestions.slice(0, 3);
//   };

//   // Handle input changes
//   const handleInputChange = (value) => {
//     setFormData(prev => ({
//       ...prev,
//       [currentQuestionData.id]: value
//     }));
    
//     if (value.length > 15) {
//       setShowSuggestions(true);
//     } else {
//       setShowSuggestions(false);
//     }
//   };

//   // Handle checkbox changes
//   const handleCheckboxChange = (option) => {
//     const currentValues = formData[currentQuestionData.id] || [];
//     const newValues = currentValues.includes(option)
//       ? currentValues.filter(v => v !== option)
//       : [...currentValues, option];
    
//     setFormData(prev => ({
//       ...prev,
//       [currentQuestionData.id]: newValues
//     }));
//   };

//   // Navigation functions
//   const nextQuestion = () => {
//     if (currentQuestion < totalQuestions - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     } else if (currentStep < totalSteps) {
//       setCurrentStep(prev => prev + 1);
//       setCurrentQuestion(0);
//     } else {
//       generateBrandStrategy();
//     }
//     setShowSuggestions(false);
//   };

//   const prevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     } else if (currentStep > 1) {
//       setCurrentStep(prev => prev - 1);
//       setCurrentQuestion(steps[currentStep - 2].questions.length - 1);
//     }
//     setShowSuggestions(false);
//   };

//   // Generate brand strategy (mock function)
//   const generateBrandStrategy = async () => {
//     setIsGenerating(true);
    
//     // Simulate AI processing
//     await new Promise(resolve => setTimeout(resolve, 3000));
    
//     // Mock generated brand data
//     const mockBrand = {
//       brandName: "FreshFamily",
//       tagline: "Healthy meals, happy families",
//       colorPalette: ["#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4"],
//       logoIdeas: ["Circular logo with family icon", "Text-based with leaf accent", "Modern geometric design"],
//       socialPosts: [
//         "🍽️ Dinner stress? We've got you covered! Our 15-minute meal plans are perfect for busy families. #FreshFamily #HealthyEating",
//         "👨‍👩‍👧‍👦 Family dinner time shouldn't be stressful. Let us handle the planning while you focus on what matters most. #FamilyTime",
//         "🥗 Healthy eating made simple. Personalized meal plans that actually work for real families. Join thousands of happy parents! #MealPlanning"
//       ],
//       brandGuidelines: {
//         voice: "Warm, supportive, and encouraging",
//         tone: "Conversational but knowledgeable",
//         messaging: "Focus on family time and reducing stress"
//       }
//     };
    
//     setGeneratedBrand(mockBrand);
//     setIsGenerating(false);
//     setShowResults(true);
//   };

//   const suggestions = generateSuggestions();
//   const progress = ((currentStep - 1) / totalSteps + (currentQuestion + 1) / totalQuestions / totalSteps) * 100;
//   const isLastQuestion = currentStep === totalSteps && currentQuestion === totalQuestions - 1;

//   // Auto-save to localStorage
//   useEffect(() => {
//     localStorage.setItem('brandingFormData', JSON.stringify(formData));
//   }, [formData]);

//   // Load saved data on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('brandingFormData');
//     if (saved) {
//       setFormData(JSON.parse(saved));
//     }
//   }, []);

//   if (isGenerating) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Brand Strategy</h2>
//           <p className="text-gray-600">Our AI is analyzing your answers and generating your complete brand package...</p>
//           <div className="mt-8 max-w-md mx-auto">
//             <div className="flex justify-between text-sm text-gray-500 mb-2">
//               <span>Analyzing brand strategy...</span>
//               <span>Processing...</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (showResults && generatedBrand) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Brand Strategy is Ready! 🎉</h1>
//             <p className="text-gray-600">Here's your complete brand package generated by AI</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {/* Brand Overview */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Brand Overview</h3>
//               <div className="space-y-3">
//                 <div>
//                   <span className="font-medium text-gray-700">Brand Name:</span>
//                   <p className="text-gray-600">{generatedBrand.brandName}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Tagline:</span>
//                   <p className="text-gray-600">"{generatedBrand.tagline}"</p>
//                 </div>
//               </div>
//             </div>

//             {/* Color Palette */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Color Palette</h3>
//               <div className="flex gap-2">
//                 {generatedBrand.colorPalette.map((color, index) => (
//                   <div key={index} className="flex-1">
//                     <div 
//                       className="w-full h-16 rounded-lg mb-2"
//                       style={{ backgroundColor: color }}
//                     ></div>
//                     <p className="text-xs text-gray-600 text-center">{color}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Social Media Posts */}
//             <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Social Media Posts</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {generatedBrand.socialPosts.map((post, index) => (
//                   <div key={index} className="bg-gray-50 rounded-lg p-4">
//                     <p className="text-sm text-gray-700">{post}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center gap-4">
//             <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//               <Download className="w-4 h-4" />
//               Download Brand Package
//             </button>
//             <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
//               <Share2 className="w-4 h-4" />
//               Share Results
//             </button>
//             <button 
//               onClick={() => {
//                 setShowResults(false);
//                 setCurrentStep(1);
//                 setCurrentQuestion(0);
//                 setFormData({});
//               }}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//             >
//               Start Over
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Brand Builder</h1>
//           <p className="text-gray-600">Create your complete brand strategy in minutes with AI-powered insights</p>
//         </div>

//         {/* Step Navigation */}
//         <div className="flex justify-center mb-8">
//           <div className="flex gap-4">
//             {steps.map((step, index) => {
//               const StepIcon = step.icon;
//               const isActive = currentStep === index + 1;
//               const isCompleted = currentStep > index + 1;
              
//               return (
//                 <div key={index} className="flex items-center">
//                   <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                     isActive ? `bg-${step.color}-100 text-${step.color}-700` :
//                     isCompleted ? 'bg-green-100 text-green-700' :
//                     'bg-gray-100 text-gray-500'
//                   }`}>
//                     <StepIcon className="w-4 h-4" />
//                     <span className="font-medium text-sm">{step.title}</span>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-medium text-gray-700">
//               Step {currentStep} of {totalSteps}: {currentStepData?.title} • Question {currentQuestion + 1} of {totalQuestions}
//             </span>
//             <span className="text-sm text-gray-500">
//               {Math.round(progress)}% Complete
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <div 
//               className={`bg-${currentStepData?.color}-600 h-3 rounded-full transition-all duration-500`}
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="flex gap-6">
//           {/* Main Question Area */}
//           <div className="flex-1">
//             <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//               <div className="mb-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className={`w-10 h-10 bg-${currentStepData?.color}-100 rounded-full flex items-center justify-center`}>
//                     <span className={`text-${currentStepData?.color}-600 font-bold`}>
//                       {currentQuestion + 1}
//                     </span>
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">
//                       {currentQuestionData?.question}
//                     </h2>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {currentQuestionData?.subtitle}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Dynamic Input Types */}
//                 {currentQuestionData?.type === 'textarea' && (
//                   <textarea
//                     className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     rows={4}
//                     placeholder={currentQuestionData?.placeholder}
//                     value={formData[currentQuestionData?.id] || ''}
//                     onChange={(e) => handleInputChange(e.target.value)}
//                   />
//                 )}

//                 {currentQuestionData?.type === 'text' && (
//                   <input
//                     type="text"
//                     className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder={currentQuestionData?.placeholder}
//                     value={formData[currentQuestionData?.id] || ''}
//                     onChange={(e) => handleInputChange(e.target.value)}
//                   />
//                 )}

//                 {currentQuestionData?.type === 'select' && (
//                   <div className="grid grid-cols-2 gap-3">
//                     {currentQuestionData.options.map((option) => (
//                       <button
//                         key={option}
//                         onClick={() => handleInputChange(option)}
//                         className={`p-3 border rounded-lg text-left transition-colors ${
//                           formData[currentQuestionData.id] === option
//                             ? 'border-blue-500 bg-blue-50 text-blue-700'
//                             : 'border-gray-300 hover:border-gray-400'
//                         }`}
//                       >
//                         {option}
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {currentQuestionData?.type === 'checkbox' && (
//                   <div className="grid grid-cols-2 gap-3">
//                     {currentQuestionData.options.map((option) => {
//                       const isSelected = (formData[currentQuestionData.id] || []).includes(option);
//                       return (
//                         <button
//                           key={option}
//                           onClick={() => handleCheckboxChange(option)}
//                           className={`p-3 border rounded-lg text-left transition-colors ${
//                             isSelected
//                               ? 'border-blue-500 bg-blue-50 text-blue-700'
//                               : 'border-gray-300 hover:border-gray-400'
//                           }`}
//                         >
//                           <div className="flex items-center gap-2">
//                             {isSelected ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
//                             {option}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Smart Suggestions */}
//               {showSuggestions && suggestions.length > 0 && (
//                 <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Sparkles className="w-4 h-4 text-yellow-600" />
//                                          <span className="text-sm font-medium text-yellow-800">
//                         AI Suggestions based on your previous answers:
//                       </span>
//                     </div>
//                     <div className="space-y-2">
//                       {suggestions.map((suggestion, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleInputChange(suggestion)}
//                           className="block w-full text-left p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors text-sm"
//                         >
//                           "{suggestion}"
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Navigation */}
//                 <div className="flex justify-between items-center">
//                   <button
//                     onClick={prevQuestion}
//                     disabled={currentStep === 1 && currentQuestion === 0}
//                     className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </button>

//                   <div className="flex gap-2">
//                     {Array.from({ length: totalQuestions }, (_, i) => (
//                       <div
//                         key={i}
//                         className={`w-2 h-2 rounded-full transition-colors ${
//                           i === currentQuestion ? `bg-${currentStepData?.color}-600` : 
//                           formData[currentStepData.questions[i]?.id] ? 'bg-green-500' : 'bg-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   <button
//                     onClick={nextQuestion}
//                     disabled={!formData[currentQuestionData?.id] && currentQuestionData?.required}
//                     className={`flex items-center gap-2 px-6 py-2 bg-${currentStepData?.color}-600 text-white rounded-lg hover:bg-${currentStepData?.color}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
//                   >
//                     {isLastQuestion ? (
//                       <>
//                         <Sparkles className="w-4 h-4" />
//                         Generate My Brand
//                       </>
//                     ) : (
//                       <>
//                         Next
//                         <ChevronRight className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Context Panel */}
//             {showContextPanel && Object.keys(formData).length > 0 && (
//               <div className="w-80">
//                 <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Your Brand Progress</h3>
//                     <button
//                       onClick={() => setShowContextPanel(false)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <EyeOff className="w-4 h-4" />
//                     </button>
//                   </div>
                  
//                   <div className="space-y-4 max-h-96 overflow-y-auto">
//                     {steps.map((step, stepIndex) => {
//                       const stepAnswers = step.questions.filter(q => formData[q.id]);
//                       if (stepAnswers.length === 0) return null;
                      
//                       const StepIcon = step.icon;
                      
//                       return (
//                         <div key={stepIndex} className="border-l-2 border-gray-200 pl-4">
//                           <div className="flex items-center gap-2 mb-2">
//                             <StepIcon className={`w-4 h-4 text-${step.color}-600`} />
//                             <span className="font-medium text-gray-700">{step.title}</span>
//                           </div>
                          
//                           <div className="space-y-2">
//                             {stepAnswers.map((question) => (
//                               <div key={question.id} className="text-xs">
//                                 <span className="font-medium text-gray-600">
//                                   {question.question.split('?')[0]}:
//                                 </span>
//                                 <p className="text-gray-500 mt-1 line-clamp-2">
//                                   {Array.isArray(formData[question.id]) 
//                                     ? formData[question.id].join(', ')
//                                     : formData[question.id]
//                                   }
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
                  
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="text-xs text-gray-500 mb-2">
//                       Completed: {Object.keys(formData).length} / {steps.reduce((acc, step) => acc + step.questions.length, 0)} questions
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                         style={{ 
//                           width: `${(Object.keys(formData).length / steps.reduce((acc, step) => acc + step.questions.length, 0)) * 100}%` 
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Show Context Panel Button (when hidden) */}
//             {!showContextPanel && Object.keys(formData).length > 0 && (
//               <div className="fixed right-4 top-1/2 transform -translate-y-1/2">
//                 <button
//                   onClick={() => setShowContextPanel(true)}
//                   className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
//                 >
//                   <Eye className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-blue-600">{Object.keys(formData).length}</div>
//               <div className="text-sm text-gray-600">Questions Answered</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-green-600">{currentStep}</div>
//               <div className="text-sm text-gray-600">Current Step</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
//               <div className="text-sm text-gray-600">Progress</div>
//             </div>
//             <div className="bg-white rounded-lg p-4 text-center">
//               <div className="text-2xl font-bold text-orange-600">
//                 {steps.reduce((acc, step) => acc + step.questions.length, 0) - Object.keys(formData).length}
//               </div>
//               <div className="text-sm text-gray-600">Remaining</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default FullBrandingForm;
