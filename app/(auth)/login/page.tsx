"use client";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Import validation schema and type
import { loginSchema, LoginValidations } from "../utils/validations";
// Import the custom login hook
import { useLogin } from "../hooks/authHooks";
import toast from "react-hot-toast";

// Create a separate component that uses client-side state
const LoginForm = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  
  // Use a simpler approach to get the referrer without useSearchParams
  const [returnUrl, setReturnUrl] = useState<string>("");
  
  useEffect(() => {
    // Get referrer from document if available
    const referrer = document.referrer;
    // Parse the referrer URL to get just the path
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        // Check if it's from the same origin and not the register page
        if (referrerUrl.origin === window.location.origin && 
            !referrerUrl.pathname.includes('/register')) {
          setReturnUrl(referrerUrl.pathname + referrerUrl.search);
        }
      } catch (e) {
        // Invalid URL, just ignore
        console.error("Invalid referrer URL:", e);
      }
    }
    
    // We can also read the URL directly to check for returnUrl parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlReturnPath = urlParams.get("returnUrl");
    if (urlReturnPath) {
      setReturnUrl(urlReturnPath);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<LoginValidations>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: LoginValidations) => {
    loginMutation.mutate(data, {
      onSuccess: (authData) => {
        console.log("Login successful:", authData);
        toast.success("Login successful! Redirecting...");
        
        // Determine where to redirect after login
        if (returnUrl && !returnUrl.includes('/register')) {
          // Redirect to the return URL if it exists and is not the register page
          router.push(returnUrl);
        } else {
          // Default redirect to home page
          router.push('/');
        }
      },
      onError: (error) => {
        console.error("Login failed:", error);
        
        // Better error handling for different status codes
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        // Check for specific status codes
        if (error.statusCode === 401) {
          errorMessage = "Invalid email or password. Please check your credentials.";
          // Clear the password field on auth failure
          reset({ email: data.email, password: "" });
        } else if (error.statusCode === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      },
    });
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <Link href="/" className="flex-shrink-0 flex items-center justify-center space-x-2 w-full">
          <div className={`md:w-14 md:h-14 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 `}>
            <img src="/Logo.png" alt=""/>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Login to your account
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Welcome back! Please enter your credentials.
        </p>
      </div>
      <div>
        {/* Display root errors (API errors) with improved styling */}
        {errors.root && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start">
            <span className="mr-2">⚠️</span>
            <span>{errors.root.message}</span>
          </div>
        )}
        
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="select-none text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" /> Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`mt-2 w-full rounded border-0 bg-white px-3.5 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ${
                  errors.email ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-blue-500"
                } placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                {...register("email")}
                disabled={loginMutation.isPending}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="select-none text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                <Lock className="mr-2 h-4 w-4" /> Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`w-full rounded border-0 bg-white px-3.5 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.password ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-blue-500"
                  } placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pr-10`}
                  {...register("password")}
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2.5">
              <div className="group relative flex h-4 w-4">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 rounded border-gray-300 bg-white text-blue-500 checked:bg-none indeterminate:bg-none focus:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:bg-gray-100 disabled:checked:border-gray-300 disabled:checked:bg-gray-100 disabled:indeterminate:border-gray-300 disabled:indeterminate:bg-gray-100"
                  disabled={loginMutation.isPending}
                />
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 stroke-white group-has-[:disabled]:stroke-gray-300"
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                    d="M2.5 6H9.5"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                  />
                  <path
                    className="opacity-0 group-has-[:checked]:opacity-100"
                    d="M2 6.05059L4.47477 8.52525L10 3"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <label
                htmlFor="remember-me"
                className="select-none text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                className="inline-block text-sm font-semibold text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="block w-full rounded bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed relative"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <span className="inline-block opacity-0">Sign in</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : "Sign in"}
            </button>
          </div>
        </form>
      </div>
      <div>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-500 hover:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Main Login component
const Login = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;