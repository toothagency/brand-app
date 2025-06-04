"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { GeneratedBrand } from "./utils/types";
import { STEPS_DATA, TOTAL_QUESTIONS_COUNT } from "./utils/sharedData";
import { isAnswerValid } from "./utils/helperFunctions";
import LoadingScreen from "./components/common/LoadingScreen";
import ResultsDisplay from "./components/results/ResultsDisplay";
import FormHeader from "./components/form/FormHeader";
import StepNavigation, { StepNavigationAlternative } from "./components/form/StepNavigation";
import FormProgressBar from "./components/form/FormProgressBar";
import QuestionArea from "./components/form/QuestionArea";
import ContextPanel from "./components/form/ContextPanel";
import { Eye } from "lucide-react";
import QuickStats from "./components/form/QuickStats";

const FullBrandingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generatedBrand, setGeneratedBrand] = useState<GeneratedBrand | null>(null);
  const [showContextPanel, setShowContextPanel] = useState(true);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('brandingFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // TODO: Optionally, restore currentStep and currentQuestion if saved
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brandingFormData', JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [formData]);

  const currentStepData = STEPS_DATA[currentStep - 1];
  const currentQuestionData = currentStepData?.questions[currentQuestion];
  const totalSteps = STEPS_DATA.length;
  const totalQuestionsInCurrentStep = currentStepData?.questions.length || 0;

  const overallProgress = useMemo(() => {
    const answeredCount = Object.keys(formData).filter(key => {
        const answer = formData[key];
        const questionDef = STEPS_DATA.flatMap(s => s.questions).find(q => q.id === key);
        return questionDef && isAnswerValid(answer, questionDef.type);
    }).length;
    return TOTAL_QUESTIONS_COUNT > 0 ? (answeredCount / TOTAL_QUESTIONS_COUNT) * 100 : 0;
  }, [formData]);


  const handleInputChange = useCallback((value: string) => {
    if (!currentQuestionData) return;
    setFormData(prev => ({
      ...prev,
      [currentQuestionData.id]: value
    }));
  }, [currentQuestionData]);

  const handleCheckboxChange = useCallback((option: string) => {
    if (!currentQuestionData) return;
    const currentValues = (formData[currentQuestionData.id] as string[] || []);
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option];
    
    setFormData(prev => ({
      ...prev,
      [currentQuestionData.id]: newValues
    }));
  }, [currentQuestionData, formData]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < totalQuestionsInCurrentStep - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Last question of last step, trigger generation
      triggerBrandGeneration();
    }
  }, [currentQuestion, totalQuestionsInCurrentStep, currentStep, totalSteps]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentStep > 1) {
      const prevStepIndex = currentStep - 2;
      setCurrentStep(prev => prev - 1);
      setCurrentQuestion(STEPS_DATA[prevStepIndex].questions.length - 1);
    }
  }, [currentQuestion, currentStep]);

  const triggerBrandGeneration = async () => {
    setIsGenerating(true);
    setShowContextPanel(false); // Hide context panel during generation
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate AI processing
    
    const mockBrand: GeneratedBrand = { // Using some form data to make it slightly dynamic
      brandName: (formData.purpose && typeof formData.purpose === 'string' && formData.purpose.split(" ")[0]) || "Synergy AI",
      tagline: (formData.tagline as string) || "Elevating Your Vision.",
      colorPalette: ["#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4", "#F9ED69"],
      logoIdeas: [
        `Icon representing "${formData.values ? (formData.values as string).split(',')[0].trim() : 'innovation'}"`,
        "Modern wordmark with a subtle creative flair",
        `Abstract symbol related to "${formData.audience ? (formData.audience as string).substring(0,20)+'...' : 'your target audience'}"`
      ],
      socialPosts: [
        `Engage your audience with content about ${formData.contentPreferences ? (formData.contentPreferences as string).substring(0,30)+'...' : 'your expertise'}! #BrandPower`,
        `Our promise: ${formData.boldPromise || 'Exceptional Results, Always.'} Learn more on our site.`,
        `What makes us different? ${formData.differentiation ? (formData.differentiation as string).substring(0,40)+'...' : 'Our unique approach.'} #UniqueValue`
      ],
      brandGuidelines: {
        voice: (formData.brandVoice as string) || "Confident, clear, and inspiring.",
        tone: (formData.personality as string) || "Approachable yet authoritative.",
        messaging: `Focus on how we ${formData.purpose ? (formData.purpose as string).toLowerCase().substring(0,30)+'...' : 'solve key problems'} for ${formData.audience ? (formData.audience as string).substring(0,20)+'...' : 'our customers'}.`
      }
    };
    setGeneratedBrand(mockBrand);
    setIsGenerating(false);
    setShowResults(true);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setCurrentQuestion(0);
    setFormData({});
    setShowResults(false);
    setGeneratedBrand(null);
    setShowContextPanel(true);
    try {
      localStorage.removeItem('brandingFormData');
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  const isPrevButtonDisabled = currentStep === 1 && currentQuestion === 0;
  const isNextButtonDisabled = useMemo(() => {
  if (!currentQuestionData) return true; // If no question data, disable
  return currentQuestionData.required && !isAnswerValid(formData[currentQuestionData.id], currentQuestionData.type);
}, [currentQuestionData, formData]);
  
const isLastQuestionOfAll = currentStep === totalSteps && currentQuestion === totalQuestionsInCurrentStep - 1;
  
  const answeredQuestionsCount = useMemo(() => Object.keys(formData).filter(key => {
    const answer = formData[key];
    const questionDef = STEPS_DATA.flatMap(s => s.questions).find(q => q.id === key);
    return questionDef && isAnswerValid(answer, questionDef.type);
  }).length, [formData]);

  useEffect(() => {
  console.log("--- DEBUG ---");
  console.log("Current Step:", currentStep);
  console.log("Current Question Index:", currentQuestion);
  console.log("Current Step Data:", currentStepData);
  console.log("Current Question Data:", currentQuestionData);
  console.log("Is Last Question of All:", isLastQuestionOfAll);
  console.log("Form Data for current question:", currentQuestionData ? formData[currentQuestionData.id] : "N/A");
  console.log("Is Next Button Disabled:", isNextButtonDisabled);
  console.log("Current Step Color:", currentStepData?.color);
  console.log("----------------");
}, [currentStep, currentQuestion, currentStepData, currentQuestionData, isLastQuestionOfAll, formData, isNextButtonDisabled]);

  if (isGenerating) return <LoadingScreen />;
  if (showResults && generatedBrand) return <ResultsDisplay generatedBrand={generatedBrand} onStartOver={handleStartOver} />;
  if (!currentStepData || !currentQuestionData) return <div>Loading form structure...</div>; // Basic loading/error state


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <FormHeader title="AI Brand Builder Pro" subtitle="Craft a powerful brand identity with AI-driven insights. Answer a few questions to begin." />
        <StepNavigationAlternative steps={STEPS_DATA} currentStep={currentStep} />
        <FormProgressBar
          progress={overallProgress}
          color={currentStepData.color}
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentStepTitle={currentStepData.title}
          currentQuestionIndex={currentQuestion}
          totalQuestionsInStep={totalQuestionsInCurrentStep}
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Question Area */}
          <div className="flex-1">
            <QuestionArea
              currentStepData={currentStepData}
              currentQuestionData={currentQuestionData}
              currentQuestionIndex={currentQuestion}
              formData={formData}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              nextQuestion={nextQuestion}
              prevQuestion={prevQuestion}
              isLastQuestion={isLastQuestionOfAll}
              isPrevDisabled={isPrevButtonDisabled}
              isNextButtonDisabled={isNextButtonDisabled}
            />
          </div>

          {/* Context Panel or Show Button */}
          {showContextPanel && Object.keys(formData).length > 0 && (
            <ContextPanel
              steps={STEPS_DATA}
              formData={formData}
              onClose={() => setShowContextPanel(false)}
              totalQuestions={TOTAL_QUESTIONS_COUNT}
            />
          )}
          {!showContextPanel && Object.keys(formData).length > 0 && (
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
              <button
                onClick={() => setShowContextPanel(true)}
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow text-blue-600 hover:text-blue-700"
                aria-label="Show context panel"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
        
        <QuickStats 
            answeredCount={answeredQuestionsCount}
            totalQuestions={TOTAL_QUESTIONS_COUNT}
            currentStep={currentStep}
            overallProgress={overallProgress}
        />

      </div>
    </div>
  );
};

export default FullBrandingForm;