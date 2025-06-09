"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  Circle,
  Download,
  Share2,
  Palette,
  FileText,
  MessageSquare,
  Target,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- ADJUST PATHS AS NEEDED ---
import type {
  StepDefinition,
  QuestionDefinition,
  FormData,
  GeneratedBrand,
  CreateBrandResponse,
  CreateBrandRequest,
  SubmitAnswerPayload,
  FetchSuggestionsPayload,
  BackendErrorData,
} from "./utils/types"; // Ensure all types are here
import { STEPS_DATA, TOTAL_QUESTIONS_COUNT } from "./utils/sharedData";
import { isClientAnswerFormatValid } from "./utils/helperFunctions";
import {
  useSubmitBrandingAnswer,
  fetchBrandingSuggestionsAPI,
  useCreateBrand,
} from "./hooks/formHooks"; // UPDATE THIS PATH

// Sub-component imports (UPDATE THESE PATHS)
import FormHeader from "./components/form/FormHeader";
import StepNavigation from "./components/form/StepNavigation";
import FormProgressBar from "./components/form/FormProgressBar";
import QuestionArea from "./components/form/QuestionArea";
import ContextPanel from "./components/form/ContextPanel";
import LoadingScreen from "./components/common/LoadingScreen";
import ResultsDisplay from "./components/results/ResultsDisplay";
import QuickStats from "./components/form/QuickStats";
// --- END ADJUST PATHS ---

const getCurrentUser = (): { userId: string; [key: string]: any } | null => {
  const userDataCookie = Cookies.get("userData");
  if (!userDataCookie) {
    console.log("No userData cookie found.");
    return null;
  }
  try {
    const parsedData = JSON.parse(userDataCookie);
    if (
      parsedData &&
      typeof parsedData.userId === "string" &&
      parsedData.userId
    ) {
      return parsedData;
    }
    console.warn("Parsed userData cookie is missing userId or is invalid.");
    return null;
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    return null;
  }
};

const FullBrandingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generatedBrand, setGeneratedBrand] = useState<GeneratedBrand | null>(
    null
  );
  const [showContextPanel, setShowContextPanel] = useState(true);

  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    [key: string]: any;
  } | null>(null);
  const [currentBrand, setCurrentBrand] = useState<CreateBrandResponse | null>(
    null
  );
  const [isLoadingBrandSession, setIsLoadingBrandSession] = useState(true);

  const [currentQuestionError, setCurrentQuestionError] = useState<
    string | null
  >(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestionsUI, setShowSuggestionsUI] = useState(false);

  const createBrandMutation = useCreateBrand();
  const submitAnswerMutation = useSubmitBrandingAnswer();

  useEffect(() => {
    const initializeFormSession = async () => {
      console.log("Initializing form session...");
      setIsLoadingBrandSession(true);
      setCurrentBrand(null);
      createBrandMutation.reset();
      const user = getCurrentUser();
      setCurrentUser(user);

      if (user && user.userId) {
        const existingBrandCookie = Cookies.get("currentBrandData");
        if (existingBrandCookie) {
          try {
            const parsedBrand: CreateBrandResponse =
              JSON.parse(existingBrandCookie);
            if (
              parsedBrand &&
              parsedBrand.brand &&
              typeof parsedBrand.brand.id === "string" &&
              parsedBrand.brand.id
            ) {
              setCurrentBrand(parsedBrand);
              setIsLoadingBrandSession(false);
              return;
            } else {
              Cookies.remove("currentBrandData");
            }
          } catch (e) {
            Cookies.remove("currentBrandData");
          }
        }
        try {
          const brandPayload: CreateBrandRequest = { userId: user.userId };
          const newBrandData = await createBrandMutation.mutateAsync(
            brandPayload
          );
          if (
            newBrandData &&
            newBrandData.brand &&
            typeof newBrandData.brand.id === "string" &&
            newBrandData.brand.id
          ) {
            setCurrentBrand(newBrandData);
            Cookies.set("currentBrandData", JSON.stringify(newBrandData), {
              expires: 1,
              path: "/",
            });
          } else {
            setCurrentBrand(null);
          }
        } catch (error: any) {
          setCurrentBrand(null);
        }
      }
      setIsLoadingBrandSession(false);
    };
    initializeFormSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const d = localStorage.getItem("brandingFormData");
      if (d) setFormData(JSON.parse(d));
    } catch (e) {}
  }, []);
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      try {
        localStorage.setItem("brandingFormData", JSON.stringify(formData));
      } catch (e) {}
    }
  }, [formData]);

  const currentStepData = STEPS_DATA[currentStep - 1];
  const currentQuestionData = currentStepData?.questions[currentQuestion];
  const totalSteps = STEPS_DATA.length;
  const totalQuestionsInCurrentStep = currentStepData?.questions.length || 0;

  const overallProgress = useMemo(() => {
    const answeredCount = Object.keys(formData).filter((key) => {
      const answer = formData[key];
      const qDef = STEPS_DATA.flatMap((s) => s.questions).find(
        (q) => q.id === key
      );
      return qDef && isClientAnswerFormatValid(answer, qDef.type);
    }).length;
    return TOTAL_QUESTIONS_COUNT > 0
      ? (answeredCount / TOTAL_QUESTIONS_COUNT) * 100
      : 0;
  }, [formData]);

  const getSuggestionsForCurrentQuestion = useCallback(
    async (
      questionDef: QuestionDefinition,
      stepIndex: number,
      questionIndexInStep: number
    ) => {
      if (
        !questionDef ||
        submitAnswerMutation.isPending ||
        !currentUser?.userId ||
        !currentBrand?.brand?.id
      ) {
        setSuggestions([]);
        setShowSuggestionsUI(false);
        setIsLoadingSuggestions(false);
        return;
      }
      if (stepIndex === 0 && questionIndexInStep === 0) {
        // S1Q1 is 0-indexed stepIndex 0, questionIndexInStep 0
        setSuggestions([]);
        setShowSuggestionsUI(false);
        setIsLoadingSuggestions(false);
        return;
      }
      console.log(
        `[getSuggestions] Fetching for S${stepIndex + 1}Q${
          questionIndexInStep + 1
        }`
      );
      setIsLoadingSuggestions(true);
      setSuggestions([]); // Clear previous suggestions
      setShowSuggestionsUI(true); // Show panel immediately for loading state

      try {
        const payload: FetchSuggestionsPayload = {
          question: questionIndexInStep + 1,
          section: stepIndex + 1,
          brandId: currentBrand.brand.id,
          userId: currentUser.userId,
        };
        const fetchedSuggestions = await fetchBrandingSuggestionsAPI(payload);
        setSuggestions(fetchedSuggestions);
        setShowSuggestionsUI(true); // Keep panel visible to show suggestions or "no suggestions"
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
        setShowSuggestionsUI(false); // Hide panel on error
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [currentUser, currentBrand, submitAnswerMutation.isPending]
  );

  // Automatic suggestion fetching on question change
  useEffect(() => {
    console.log(
      `[useEffect auto-suggest] CQD: ${currentQuestionData?.id}, Step: ${currentStep}, Q: ${currentQuestion}`
    );
    if (currentQuestionData && currentUser?.userId && currentBrand?.brand?.id) {
      getSuggestionsForCurrentQuestion(
        currentQuestionData,
        currentStep - 1,
        currentQuestion
      );
    } else {
      setSuggestions([]);
      setShowSuggestionsUI(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentQuestionData,
    currentStep,
    currentQuestion,
    currentUser,
    currentBrand,
  ]); // getSuggestionsForCurrentQuestion is memoized

  const handleManualSuggestionFetch = useCallback(() => {
    if (
      currentQuestionData &&
      currentUser?.userId &&
      currentBrand?.brand?.id &&
      !isLoadingSuggestions &&
      !submitAnswerMutation.isPending
    ) {
      console.log("[ManualFetch] Triggered for:", currentQuestionData.id);
      // Explicitly set showSuggestionsUI to true so the panel (and its loading state) appears
      setShowSuggestionsUI(true);
      getSuggestionsForCurrentQuestion(
        currentQuestionData,
        currentStep - 1,
        currentQuestion
      );
    } else {
      console.log(
        "[ManualFetch] Cannot fetch: missing data, loading, or submitting."
      );
    }
  }, [
    currentQuestionData,
    currentStep,
    currentQuestion,
    currentUser,
    currentBrand,
    isLoadingSuggestions,
    submitAnswerMutation.isPending,
    getSuggestionsForCurrentQuestion,
  ]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (!currentQuestionData) return;
      setCurrentQuestionError(null);
      submitAnswerMutation.reset();
      setFormData((prev) => ({ ...prev, [currentQuestionData.id]: value }));
      // Let automatic suggestion logic in useEffect handle showing/hiding/refetching.
      // If user types, the automatic useEffect for suggestions will run again due to `formData` dependency indirectly (if it were added)
      // or because `currentQuestionData` is the same, and we might want to refetch based on new text.
      // For simplicity now, automatic fetch is based on question change, manual is explicit.
      // If you want suggestions to react to typing, the main suggestion useEffect needs `formData` and different logic.
      // For now, changing input text doesn't automatically re-fetch or hide suggestions unless it causes a condition change in the main suggestion useEffect.
    },
    [currentQuestionData, submitAnswerMutation]
  );

  const handleCheckboxChange = useCallback(
    (option: string) => {
      if (!currentQuestionData) return;
      setCurrentQuestionError(null);
      submitAnswerMutation.reset();
      const id = currentQuestionData.id;
      setFormData((prev) => {
        const currentValues = (prev[id] as string[]) || [];
        const newValues = currentValues.includes(option)
          ? currentValues.filter((v) => v !== option)
          : [...currentValues, option];
        return { ...prev, [id]: newValues };
      });
    },
    [currentQuestionData, submitAnswerMutation, formData]
  );

  const handleSelectSuggestion = (suggestionValue: string) => {
    if (currentQuestionData) {
      handleInputChange(suggestionValue); // Updates formData
      setShowSuggestionsUI(false); // Explicitly hide panel after selection
      setSuggestions([]); // Clear suggestions state
    }
  };

  const nextQuestion = useCallback(async () => {
    if (
      !currentQuestionData ||
      submitAnswerMutation.isPending ||
      !currentUser?.userId ||
      !currentBrand?.brand?.id
    )
      return;
    const answer = formData[currentQuestionData.id];
    if (
      currentQuestionData.required &&
      !isClientAnswerFormatValid(answer, currentQuestionData.type)
    ) {
      setCurrentQuestionError("This field is required.");
      return;
    }
    setCurrentQuestionError(null);
    submitAnswerMutation.reset();
    const payload: SubmitAnswerPayload = {
      question: currentQuestion + 1,
      section: currentStep,
      answer,
      userId: currentUser.userId,
      brandId: currentBrand.brand.id,
    };
    try {
      await submitAnswerMutation.mutateAsync(payload);
      setSuggestions([]);
      setShowSuggestionsUI(false); // Clear and hide on nav
      if (currentQuestion < totalQuestionsInCurrentStep - 1)
        setCurrentQuestion((p) => p + 1);
      else if (currentStep < totalSteps) {
        setCurrentStep((p) => p + 1);
        setCurrentQuestion(0);
      } else triggerBrandGeneration();
    } catch (error) {
      /* Handled by useEffect on mutation.isError */
    }
  }, [
    currentStep,
    currentQuestion,
    formData,
    currentQuestionData,
    totalQuestionsInCurrentStep,
    totalSteps,
    currentUser,
    currentBrand,
    submitAnswerMutation,
  ]);

  const prevQuestion = useCallback(() => {
    if (submitAnswerMutation.isPending) return;
    setCurrentQuestionError(null);
    submitAnswerMutation.reset();
    setSuggestions([]);
    setShowSuggestionsUI(false);
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
      setCurrentQuestion(STEPS_DATA[currentStep - 2].questions.length - 1);
    }
  }, [currentQuestion, currentStep, submitAnswerMutation]);

  const triggerBrandGeneration = async () => {
    if (!currentBrand?.brand?.id) {
      alert("Brand session not found.");
      return;
    }
    setIsGenerating(true);
    setShowContextPanel(false);
    await new Promise((r) => setTimeout(r, 2500));
    const mock: GeneratedBrand = {
      brandName: "Generated Brand",
      tagline: "Tagline!",
      colorPalette: ["#FF5733"],
      logoIdeas: ["Logo A"],
      socialPosts: ["Post 1"],
      brandGuidelines: {
        voice: "Unique",
        tone: "Engaging",
        messaging: "Impactful",
      },
    };
    setGeneratedBrand(mock);
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
    submitAnswerMutation.reset();
    createBrandMutation.reset();
    setIsGenerating(false);
    setCurrentQuestionError(null);
    setSuggestions([]);
    setIsLoadingSuggestions(false);
    setShowSuggestionsUI(false);
    setCurrentUser(null);
    setCurrentBrand(null);
    Cookies.remove("currentBrandData");
    try {
      localStorage.removeItem("brandingFormData");
    } catch (e) {}
    setIsLoadingBrandSession(true);
    const reInitUser = getCurrentUser();
    setCurrentUser(reInitUser);
    if (!reInitUser) setIsLoadingBrandSession(false);
  };

  useEffect(() => {
    if (submitAnswerMutation.isError && submitAnswerMutation.error) {
      let errorMessage = "Submission failed. Please try again.";
      const error = submitAnswerMutation.error as
        | Error
        | AxiosError<BackendErrorData>;
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const responseData = error.response.data;
        if (typeof responseData.message === "string" && responseData.message)
          errorMessage = responseData.message;
        else if (
          typeof (responseData as any).error === "string" &&
          (responseData as any).error
        )
          errorMessage = (responseData as any)
            .error; // Cast if BackendErrorData doesn't have .error
        else if (error.response.statusText)
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) errorMessage = error.message;
      setCurrentQuestionError(errorMessage);
    }
  }, [submitAnswerMutation.isError, submitAnswerMutation.error]);

  const isPrevButtonDisabled =
    (currentStep === 1 && currentQuestion === 0) ||
    submitAnswerMutation.isPending;

  const canShowManualSuggestButton = useMemo(() => {
    if (
      isLoadingSuggestions ||
      showSuggestionsUI ||
      !currentQuestionData ||
      !currentUser?.userId ||
      !currentBrand?.brand?.id ||
      submitAnswerMutation.isPending
    ) {
      return false;
    }
    return !(currentStep === 1 && currentQuestion === 0); // Don't show for S1Q1
  }, [
    isLoadingSuggestions,
    showSuggestionsUI,
    currentQuestionData,
    currentStep,
    currentQuestion,
    currentUser,
    currentBrand,
    submitAnswerMutation.isPending,
  ]);

  const isNextButtonDisabled = useMemo(() => {
    if (
      submitAnswerMutation.isPending ||
      isLoadingSuggestions ||
      !currentBrand?.brand?.id
    )
      return true;
    if (!currentQuestionData) return true;
    return (
      currentQuestionData.required &&
      !isClientAnswerFormatValid(
        formData[currentQuestionData.id],
        currentQuestionData.type
      )
    );
  }, [
    currentQuestionData,
    formData,
    submitAnswerMutation.isPending,
    isLoadingSuggestions,
    currentBrand,
  ]);

  const isLastQuestionOfAll =
    currentStep === totalSteps &&
    currentQuestion === totalQuestionsInCurrentStep - 1;
  const answeredQuestionsCount = useMemo(
    () =>
      Object.keys(formData).filter((key) => {
        const answer = formData[key];
        const qDef = STEPS_DATA.flatMap((s) => s.questions).find(
          (q) => q.id === key
        );
        return qDef && isClientAnswerFormatValid(answer, qDef.type);
      }).length,
    [formData]
  );

  // --- Loading and Error States ---
  if (isLoadingBrandSession)
    return (
      <LoadingScreen
        title="Initializing Session"
        message="Setting up your branding workspace..."
      />
    );
  if (!currentUser?.userId)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        {" "}
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />{" "}
        <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>{" "}
        <p className="text-gray-600 mb-6">Please log in.</p>{" "}
      </div>
    );
  if (!currentBrand?.brand?.id && !createBrandMutation.isPending)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        {" "}
        <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />{" "}
        <h2 className="text-2xl font-semibold mb-2">Session Error</h2>{" "}
        <p className="text-gray-600 mb-6">
          Could not start a branding session. Please refresh.
        </p>{" "}
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>{" "}
      </div>
    );
  if (createBrandMutation.isPending && !currentBrand?.brand?.id)
    return (
      <LoadingScreen
        title="Creating Brand"
        message="Just a moment while we prepare your new brand..."
      />
    );
  if (isGenerating && !showResults)
    return (
      <LoadingScreen
        title="Crafting Your Brand"
        message="Our AI is analyzing your insights..."
      />
    );
  if (showResults && generatedBrand)
    return (
      <ResultsDisplay
        generatedBrand={generatedBrand}
        onStartOver={handleStartOver}
      />
    );
  if (!currentStepData || !currentQuestionData) {
    if (!currentBrand?.brand?.id)
      return (
        <LoadingScreen
          title="Finalizing Setup"
          message="Waiting for brand session..."
        />
      );
    console.error(
      "Critical Form State Error: No currentStepData or currentQuestionData. Brand:",
      currentBrand
    );
    return (
      <div className="min-h-screen flex justify-center items-center">
        Error loading form content. Please try starting over or refresh.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <FormHeader
          title="Answer Questions to Build Your Brand"
          subtitle="Craft a powerful brand identity with AI-driven insights."
        />
        <StepNavigation steps={STEPS_DATA} currentStep={currentStep} />{" "}
        {/* Pass primaryColor if StepNavigation uses it */}
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
              isSubmittingQuestion={submitAnswerMutation.isPending}
              currentQuestionError={currentQuestionError}
              suggestions={suggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              showSuggestionsUI={showSuggestionsUI}
              onSelectSuggestion={handleSelectSuggestion} // Pass the new handler
              onManualSuggestionFetch={handleManualSuggestionFetch}
              canShowManualSuggestButton={canShowManualSuggestButton}
            />
          </div>
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
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl"
                aria-label="Show context panel"
              >
                {" "}
                <Eye className="w-6 h-6 text-blue-600" />{" "}
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
