"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import { Eye, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Providers from "../../providers";

// --- ADJUST PATHS AS NEEDED ---
import type {
  QuestionDefinition,
  FormData,
  InitialBrandObject, // For current brand session
  DetailedBrandObject, // For final results
  SubmitAnswerPayload,
  FetchSuggestionsPayload,
  BackendErrorData,
} from "./utils/types";
import { STEPS_DATA, TOTAL_QUESTIONS_COUNT } from "./utils/sharedData";
import { isClientAnswerFormatValid } from "./utils/helperFunctions";
import {
  useSubmitBrandingAnswer,
  fetchBrandingSuggestionsAPI,
  useCreateBrand,
  useGetBrandResults,
} from "./hooks/formHooks";

// Sub-component imports (dynamically loaded for performance)
const FormHeader = dynamic(() => import("./components/form/FormHeader"));
const StepNavigation = dynamic(
  () => import("./components/form/StepNavigation")
);
const FormProgressBar = dynamic(
  () => import("./components/form/FormProgressBar")
);
const QuestionArea = dynamic(() => import("./components/form/QuestionArea"));
const ContextPanel = dynamic(() => import("./components/form/ContextPanel"));
const LoadingScreen = dynamic(
  () => import("./components/common/LoadingScreen")
);

const QuickStats = dynamic(() => import("./components/form/QuickStats"));
import toast from "react-hot-toast";
// --- END ADJUST PATHS ---

const getCurrentUser = (): { userId: string; [key: string]: any } | null => {
  const userDataCookie = Cookies.get("userData");
  if (!userDataCookie) return null;
  try {
    const parsedData = JSON.parse(userDataCookie);
    return parsedData?.userId && typeof parsedData.userId === "string"
      ? parsedData
      : null;
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    return null;
  }
};

const FullBrandingForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showContextPanel, setShowContextPanel] = useState(true);

  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    [key: string]: any;
  } | null>(null);
  const [activeBrandSession, setActiveBrandSession] =
    useState<InitialBrandObject | null>(null);
  const [isLoadingBrandSession, setIsLoadingBrandSession] = useState(true); // Start true for initial load
  const [isResumingState, setIsResumingState] = useState(true); // New state to manage resume logic completion

  const [currentQuestionError, setCurrentQuestionError] = useState<
    string | null
  >(null);
  const [resultsError, setResultsError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestionsUI, setShowSuggestionsUI] = useState(false);

  const createBrandMutation = useCreateBrand();
  const submitAnswerMutation = useSubmitBrandingAnswer();
  const getBrandResultsMutation = useGetBrandResults(currentUser?.userId || "");

  // Effect for initializing user and brand session (runs once on mount)
  useEffect(() => {
    const initializeFormSession = async () => {
      console.log("Effect 1: Initializing form session...");
      setIsLoadingBrandSession(true); // Ensure loading state is true at the start
      setActiveBrandSession(null); // Reset active brand session
      createBrandMutation.reset(); // Reset mutation state if re-initializing

      const user = getCurrentUser();
      setCurrentUser(user);

      if (user?.userId) {
        const existingBrandCookie = Cookies.get("currentBrandData");
        if (existingBrandCookie) {
          try {
            const parsedBrand: InitialBrandObject =
              JSON.parse(existingBrandCookie);
            if (parsedBrand?.id) {
              console.log(
                "Effect 1: Found existing brand in cookie:",
                parsedBrand.id
              );
              setActiveBrandSession(parsedBrand);
              setIsLoadingBrandSession(false); // Brand session loaded from cookie
              //setIsResumingState(true); // Indicate resume logic can now run (if not already true)
              return; // Exit early, no need to create a new brand
            } else {
              console.log("Effect 1: Invalid brand data in cookie, removing.");
              Cookies.remove("currentBrandData");
            }
          } catch (e) {
            console.error("Effect 1: Error parsing brand data from cookie:", e);
            Cookies.remove("currentBrandData");
          }
        }

        // If no valid brand in cookie, try to create a new one
        console.log(
          "Effect 1: No valid brand in cookie, attempting to create new brand."
        );
        try {
          const response = await createBrandMutation.mutateAsync({
            userId: user.userId,
          });
          if (response.success && response.brand?.id) {
            console.log(
              "Effect 1: New brand created successfully:",
              response.brand.id
            );
            setActiveBrandSession(response.brand);
            Cookies.set("currentBrandData", JSON.stringify(response.brand), {
              expires: 1,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
            });
          } else {
            console.error(
              "Effect 1: Brand creation API call did not succeed or returned invalid data:",
              response.message
            );
            setActiveBrandSession(null);
            // Potentially show an error to the user here if brand creation is critical path
          }
        } catch (error) {
          console.error("Effect 1: Exception during brand creation:", error);
          setActiveBrandSession(null);
          // Potentially show an error
        }
      } else {
        console.log(
          "Effect 1: No user found, cannot initialize brand session."
        );
      }
      setIsLoadingBrandSession(false); // Done with brand session loading/creation attempt
      //setIsResumingState(true); // Indicate resume logic can now run
    };

    initializeFormSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on component mount

  // Effect for loading formData from localStorage and setting resume point
  useEffect(() => {
    // This effect should run AFTER the brand session is confirmed (not loading and activeBrandSession is set)
    if (!isLoadingBrandSession && activeBrandSession?.id) {
      console.log(
        "Effect 2: Brand session ready. Loading formData and determining resume point."
      );
      let loadedFormData: FormData = {};
      try {
        const d = localStorage.getItem("brandingFormData");
        if (d) {
          loadedFormData = JSON.parse(d);
          setFormData(loadedFormData); // Set formData state
          console.log(
            "Effect 2: Loaded formData from localStorage:",
            loadedFormData
          );
        } else {
          console.log("Effect 2: No formData found in localStorage.");
        }
      } catch (e) {
        console.error("Effect 2: Error loading formData from localStorage:", e);
      }

      if (Object.keys(loadedFormData).length > 0) {
        let resumeStep = 1;
        let resumeQuestion = 0; // 0-indexed
        let allAnswered = true;

        for (let stepIdx = 0; stepIdx < STEPS_DATA.length; stepIdx++) {
          const step = STEPS_DATA[stepIdx];
          for (let qIdx = 0; qIdx < step.questions.length; qIdx++) {
            const questionDef = step.questions[qIdx];
            const answer = loadedFormData[questionDef.id];

            if (
              !(
                answer !== undefined &&
                isClientAnswerFormatValid(answer, questionDef.type)
              )
            ) {
              // This is the first unanswered question
              resumeStep = stepIdx + 1; // 1-indexed for setCurrentStep
              resumeQuestion = qIdx; // 0-indexed for setCurrentQuestion
              allAnswered = false;
              break; // Exit inner loop
            }
          }
          if (!allAnswered) {
            break; // Exit outer loop
          }
        }

        if (allAnswered) {
          // If all questions were answered, go to the last question of the last step
          resumeStep = STEPS_DATA.length;
          resumeQuestion =
            STEPS_DATA[STEPS_DATA.length - 1].questions.length - 1;
          console.log(
            `Effect 2: All questions seem answered. Setting to last question: S${resumeStep}Q${
              resumeQuestion + 1
            }`
          );
        } else {
          console.log(
            `Effect 2: Resuming at Step ${resumeStep}, Question Index ${resumeQuestion} (1-indexed Q${
              resumeQuestion + 1
            })`
          );
        }

        setCurrentStep(resumeStep);
        setCurrentQuestion(resumeQuestion);
      } else {
        // No form data found, default to first question
        console.log("Effect 2: No formData or empty, starting from S1Q1.");
        setCurrentStep(1);
        setCurrentQuestion(0);
      }
      setIsResumingState(false); // Indicate resume logic has completed
    } else if (
      !isLoadingBrandSession &&
      !activeBrandSession?.id &&
      !currentUser?.userId
    ) {
      // No user, no brand session, no need to resume, just mark as done.
      setIsResumingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingBrandSession, activeBrandSession]); // Trigger when brand session status changes

  // Effect for saving formData to localStorage
  useEffect(() => {
    // Only save if resume logic is done and there's actual form data
    if (!isResumingState && Object.keys(formData).length > 0) {
      console.log("Effect 3: Saving formData to localStorage:", formData);
      try {
        localStorage.setItem("brandingFormData", JSON.stringify(formData));
      } catch (e) {
        console.error("Effect 3: Error saving formData to localStorage:", e);
      }
    }
  }, [formData, isResumingState]);

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

  // Debounce function for API calls
  function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Replace getSuggestionsForCurrentQuestion with debounced version
  const getSuggestionsForCurrentQuestion = useCallback(
    debounce(
      async (
        questionDef: QuestionDefinition,
        stepIndex: number,
        questionIndexInStep: number
      ) => {
        if (!questionDef || !currentUser?.userId || !activeBrandSession?.id) {
          setSuggestions([]);
          setIsLoadingSuggestions(false);
          return;
        }
        if (stepIndex === 0 && questionIndexInStep === 0) {
          // No suggestions for S1Q1
          setSuggestions([]);
          setShowSuggestionsUI(false);
          setIsLoadingSuggestions(false);
          return;
        }
        setIsLoadingSuggestions(true);
        setSuggestions([]);
        try {
          const payload: FetchSuggestionsPayload = {
            question: questionIndexInStep + 1,
            section: stepIndex + 1,
            brandId: activeBrandSession.id,
            userId: currentUser.userId,
          };
          setSuggestions(await fetchBrandingSuggestionsAPI(payload));
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          toast.error("Could not fetch suggestions.");
          setSuggestions([]);
          setShowSuggestionsUI(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      },
      300 // 300ms debounce
    ),
    [currentUser, activeBrandSession]
  );

  // Effect to clear suggestions when the question itself changes
  useEffect(() => {
    // Only clear if not currently loading suggestions for the new question
    if (!isLoadingSuggestions) {
      console.log(
        `Effect 4: Clearing suggestions for new question: ${currentQuestionData?.id}`
      );
      setSuggestions([]);
      setShowSuggestionsUI(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionData?.id]); // Only depends on the question ID

  const handleManualSuggestionFetch = useCallback(() => {
    if (
      currentQuestionData &&
      currentUser?.userId &&
      activeBrandSession?.id &&
      !isLoadingSuggestions &&
      !submitAnswerMutation.isPending
    ) {
      setShowSuggestionsUI(true); // Show panel to display loading/results
      getSuggestionsForCurrentQuestion(
        currentQuestionData,
        currentStep - 1,
        currentQuestion
      );
    }
  }, [
    currentQuestionData,
    currentStep,
    currentQuestion,
    currentUser,
    activeBrandSession,
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
    [currentQuestionData, submitAnswerMutation]
  );

  const handleSelectSuggestion = (suggestionValue: string) => {
    if (currentQuestionData) {
      handleInputChange(suggestionValue); // This will update formData
      setShowSuggestionsUI(false); // Hide panel after selection
      setSuggestions([]); // Clear suggestions
    }
  };

  const nextQuestion = useCallback(async () => {
    if (
      !currentQuestionData ||
      submitAnswerMutation.isPending ||
      !currentUser?.userId ||
      !activeBrandSession?.id
    )
      return;
    const answer = formData[currentQuestionData.id];
    if (
      currentQuestionData.required &&
      !isClientAnswerFormatValid(answer, currentQuestionData.type)
    ) {
      setCurrentQuestionError(
        "This field is required. Please provide an answer."
      );
      toast.error("This field is required.");
      return;
    }
    setCurrentQuestionError(null);

    const payload: SubmitAnswerPayload = {
      question: currentQuestion + 1,
      section: currentStep,
      answer,
      userId: currentUser.userId,
      brandId: activeBrandSession.id,
    };

    // FullBrandingForm.tsx - inside nextQuestion callback

    try {
      const submissionResponse = await submitAnswerMutation.mutateAsync(
        payload
      ); // Let's assume this is successful
      console.log("Submit Answer Succeeded. Response:", submissionResponse); // What does this log?

      // Check the structure of submissionResponse
      if (!submissionResponse || submissionResponse.message !== "passed") {
        console.error(
          "Submission response is invalid or missing 'success' property:",
          submissionResponse
        );

        setCurrentQuestionError("Invalid response from server after saving.");
        return; // Stop further execution
      }

      if (submissionResponse.error) {
        console.warn(
          "Submission was not successful according to backend:",
          submissionResponse.message
        );

        setCurrentQuestionError(
          submissionResponse.message ||
            "Backend indicated save was not successful."
        );
        // Potentially stop here if a non-successful save should prevent result fetching
        // return; // Uncomment if you want to stop if submissionResponse.success is false
      } else {
      }

      // --- Code execution reaches here if submitAnswerMutation was "successful" ---

      if (currentQuestion < totalQuestionsInCurrentStep - 1) {
        setCurrentQuestion((p) => p + 1);
      } else if (currentStep < totalSteps) {
        setCurrentStep((p) => p + 1);
        setCurrentQuestion(0);
      } else {
        // Last question of the last step
        setShowContextPanel(false);
        setResultsError(null); // Clear previous results errors

        // Re-add a loading toast here if you removed it for getBrandResultsMutation

        console.log(
          "LOG A: Last question submitted. Preparing to fetch brand results."
        );
        console.log("LOG B: Active Brand Session:", activeBrandSession);
        console.log("LOG C: Current User:", currentUser);

        if (activeBrandSession?.id && currentUser?.userId) {
          console.log(
            `LOG D: Calling getBrandResultsMutation.mutate with brandId: ${activeBrandSession.id}`
          );
          getBrandResultsMutation.mutate(
            // This is where it might not be reached if an error happens before
            { brandId: activeBrandSession.id },
            {
              onSuccess: (detailedBrandObj: DetailedBrandObject) => {
                console.log("SUCCESS (getBrandResults):", detailedBrandObj);

                // Store the brand data temporarily and redirect to results page
                localStorage.setItem(
                  "currentBrandData",
                  JSON.stringify(detailedBrandObj)
                );
                router.push(`/brand-results?brandId=${activeBrandSession.id}`);
              },
              onError: (error: any) => {
                // Temporarily 'any' for deep logging

                console.error(
                  "ERROR (getBrandResultsMutation onError): Raw error object:",
                  error
                );
                // ... (your detailed error logging from previous suggestion) ...
                let specificErrorMessage = "Failed to generate results.";
                if (typeof error === "string") {
                  specificErrorMessage = error; // If error is just "passed"
                } else if (error instanceof Error) {
                  specificErrorMessage = error.message;
                } else if (axios.isAxiosError(error)) {
                  // ... (Axios error handling) ...
                  if (error.response?.data) {
                    const backendError = error.response
                      .data as BackendErrorData;
                    specificErrorMessage =
                      backendError.message ||
                      backendError.error ||
                      "API error during results fetch.";
                  } else {
                    specificErrorMessage =
                      error.message ||
                      "Network or API error during results fetch.";
                  }
                }

                setResultsError(specificErrorMessage);
              },
            }
          );
        } else {
          const errorMsg =
            "Session error: Cannot fetch results (brand/user ID missing before getBrandResults call).";
          console.error(errorMsg, { activeBrandSession, currentUser });

          setResultsError(errorMsg); // This would set the UI error
          // If this block is hit, the "passed" message is not from getBrandResultsMutation's onError
        }
      }
    } catch (errorFromSubmitOrLogic) {
      // Catch errors from submitAnswerMutation.mutateAsync OR subsequent logic
      console.error(
        "ERROR in nextQuestion's main try...catch block:",
        errorFromSubmitOrLogic
      );

      let errorMessage =
        "An unexpected error occurred after submitting your answer.";
      if (typeof errorFromSubmitOrLogic === "string") {
        errorMessage = errorFromSubmitOrLogic; // If the error thrown is just the string "passed"
        console.log("Error caught was a string:", errorMessage);
      } else if (errorFromSubmitOrLogic instanceof Error) {
        errorMessage = errorFromSubmitOrLogic.message;
        console.log("Error caught was an Error instance:", errorMessage);
      } else if (axios.isAxiosError(errorFromSubmitOrLogic)) {
        console.log(
          "Error caught was an AxiosError. Response data:",
          errorFromSubmitOrLogic.response?.data
        );
        const backendError = errorFromSubmitOrLogic.response
          ?.data as BackendErrorData;
        errorMessage =
          backendError?.message ||
          backendError?.error ||
          errorFromSubmitOrLogic.message ||
          "Failed to process your answer.";
      }

      // Decide if this should set currentQuestionError or resultsError
      // If it's after the *last* question's submission, it's more like a resultsError
      if (isLastQuestionOfAll) {
        setResultsError(errorMessage);
        setShowResults(false); // Ensure results page isn't shown
      } else {
        setCurrentQuestionError(errorMessage);
      }
    }
  }, [
    currentStep,
    currentQuestion,
    formData,
    currentQuestionData,
    totalQuestionsInCurrentStep,
    totalSteps,
    currentUser,
    activeBrandSession,
    submitAnswerMutation,
    getBrandResultsMutation,
  ]);

  const prevQuestion = useCallback(() => {
    if (submitAnswerMutation.isPending || getBrandResultsMutation.isPending)
      return;
    setCurrentQuestionError(null);
    submitAnswerMutation.reset();
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
      setCurrentQuestion(STEPS_DATA[currentStep - 2].questions.length - 1);
    }
  }, [
    currentQuestion,
    currentStep,
    submitAnswerMutation,
    getBrandResultsMutation.isPending,
  ]);

  const handleStartOver = useCallback(() => {
    // Clear all relevant states
    setCurrentStep(1);
    setCurrentQuestion(0);
    setFormData({});
    setShowResults(false);
    setDetailedBrandResult(null);
    setShowContextPanel(true);
    setCurrentQuestionError(null);
    setResultsError(null);
    setSuggestions([]);
    setIsLoadingSuggestions(false);
    setShowSuggestionsUI(false);

    // Clear session related state and cookies/localStorage
    Cookies.remove("currentBrandData");
    try {
      localStorage.removeItem("brandingFormData");
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }

    // Trigger re-initialization of the form session
    setIsLoadingBrandSession(true); // Show loading screen
    setIsResumingState(true); // Ensure resume logic re-evaluates correctly

    // The main initialization useEffect will run again because its dependencies might change
    // or if it's set to run once, we might need to call a re-init function.
    // For simplicity, we assume the top-level useEffect for initializeFormSession
    // will be re-triggered if necessary (e.g., if it depends on currentUser which becomes null then re-populated).
    // Or, explicitly call it:
    const reInitialize = async () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user?.userId) {
        try {
          const response = await createBrandMutation.mutateAsync({
            userId: user.userId,
          });
          if (response.success && response.brand?.id) {
            setActiveBrandSession(response.brand);
            Cookies.set("currentBrandData", JSON.stringify(response.brand), {
              expires: 1,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
            });
          } else {
            setActiveBrandSession(null);
          }
        } catch (error) {
          setActiveBrandSession(null);
        }
      }
      setIsLoadingBrandSession(false);
      //setIsResumingState(false); // Resume logic will handle this based on new activeBrandSession
    };
    reInitialize(); // Call re-initialization

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBrandMutation, submitAnswerMutation, getBrandResultsMutation]);

  useEffect(() => {
    if (submitAnswerMutation.isError && submitAnswerMutation.error) {
      let errorMessage = "Submission failed. Please try again.";
      const error = submitAnswerMutation.error as
        | Error
        | AxiosError<BackendErrorData>;
      if (axios.isAxiosError(error) && error.response?.data) {
        const d = error.response.data;
        if (typeof d.message === "string" && d.message)
          errorMessage = d.message;
        else if (typeof (d as any).error === "string" && (d as any).error)
          errorMessage = (d as any).error;
        else if (error.response.statusText)
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.message) errorMessage = error.message;
      setCurrentQuestionError(errorMessage);
      // toast.error(errorMessage); // Already toasted in nextQuestion for submission failure
    }
  }, [submitAnswerMutation.isError, submitAnswerMutation.error]);

  const isPrevButtonDisabled =
    (currentStep === 1 && currentQuestion === 0) ||
    submitAnswerMutation.isPending ||
    getBrandResultsMutation.isPending;
  const canShowManualSuggestButton = useMemo(() => {
    if (
      isLoadingSuggestions ||
      !currentQuestionData ||
      !currentUser?.userId ||
      !activeBrandSession?.id ||
      submitAnswerMutation.isPending ||
      getBrandResultsMutation.isPending
    )
      return false;
    return !(currentStep === 1 && currentQuestion === 0);
  }, [
    isLoadingSuggestions,
    currentQuestionData,
    currentStep,
    currentQuestion,
    currentUser,
    activeBrandSession,
    submitAnswerMutation.isPending,
    getBrandResultsMutation.isPending,
  ]);
  const isNextButtonDisabled = useMemo(() => {
    if (
      submitAnswerMutation.isPending ||
      isLoadingSuggestions ||
      !activeBrandSession?.id ||
      getBrandResultsMutation.isPending
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
    activeBrandSession,
    getBrandResultsMutation.isPending,
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

  // Initial combined loading state for page rendering
  if (isLoadingBrandSession || (isResumingState && activeBrandSession?.id)) {
    return (
      <LoadingScreen
        title="Loading Your Session"
        message="Please wait while we prepare the form..."
      />
    );
  }

  // Critical Error States (after initial loading attempts)
  if (!currentUser?.userId)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6 text-center">
        {" "}
        <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-6" />{" "}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Authentication Required
        </h2>{" "}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          To access the AI Brand Builder, please log in.
        </p>{" "}
        <a
          href="/login"
          className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Go to Login
        </a>{" "}
      </div>
    );
  if (!activeBrandSession?.id && !createBrandMutation.isPending)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6 text-center">
        {" "}
        <AlertCircle className="w-16 h-16 text-orange-500 dark:text-orange-400 mb-6" />{" "}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Session Error
        </h2>{" "}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Could not start or resume your branding session.
        </p>{" "}
        <button
          onClick={handleStartOver}
          className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Try to Start Over
        </button>{" "}
      </div>
    );

  // Mutation-specific loading/error states
  if (createBrandMutation.isPending && !activeBrandSession?.id)
    return (
      <LoadingScreen
        title="Creating Your Brand Workspace"
        message="Preparing your new brand..."
      />
    );
  if (getBrandResultsMutation.isPending && !showResults)
    return (
      <LoadingScreen
        title="Generating Your Full Brand Strategy"
        message="Compiling your brand results... This may take a few minutes."
      />
    );
  if (resultsError)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6 text-center">
        {" "}
        <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400 mb-6" />{" "}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Error Generating Results
        </h2>{" "}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-wrap">
          {resultsError}
        </p>{" "}
        <div className="flex gap-4">
          <button
            onClick={handleStartOver}
            className="px-8 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
          >
            Start Over
          </button>{" "}
          {activeBrandSession?.id && currentUser?.userId && (
            <button
              onClick={() => {
                setResultsError(null);
                getBrandResultsMutation.mutate({
                  brandId: activeBrandSession.id!,
                });
              }}
              className="px-8 py-3 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-500"
            >
              Retry
            </button>
          )}
        </div>{" "}
      </div>
    );

  // If form data isn't ready after all loading, show error
  if (!currentStepData || !currentQuestionData)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6 text-center">
        {" "}
        <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400 mb-6" />{" "}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          Form Error
        </h2>{" "}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Error loading question content.
        </p>{" "}
        <button
          onClick={handleStartOver}
          className="px-8 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
        >
          Start Over
        </button>{" "}
      </div>
    );

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-100 to-sky-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <FormHeader
          title="Brand Form"
          subtitle="Answer questions to craft a powerful brand identity with AI-driven insights."
        />
        <StepNavigation steps={STEPS_DATA} currentStep={currentStep} />
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
              onSelectSuggestion={handleSelectSuggestion}
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
                className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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

const FormPage = () => (
  <Providers>
    <FullBrandingForm />
  </Providers>
);
export default FormPage;
