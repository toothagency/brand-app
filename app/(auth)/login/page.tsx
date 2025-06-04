"use client";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter

// Import validation schema and type
import { loginSchema, LoginValidations } from "../utils/validations"; 
// Import the custom login hook
import { useLogin } from "../hooks/authHooks"; 

const Login = () => {
  const router = useRouter(); // Initialize useRouter
  const loginMutation = useLogin(); // Use the custom login hook

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Get setError to handle API errors
  } = useForm<LoginValidations>({
    resolver: zodResolver(loginSchema), // Use the Zod resolver with your schema
    mode: "onBlur", // Validate on blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: LoginValidations) => {
    loginMutation.mutate(data, {
      onSuccess: (authData) => {
        // Handle successful login 
        // The token is already stored by the hook's onSuccess
        console.log("Login successful:", authData);
        // Redirect to dashboard or desired page
        router.push("/dashboard"); 
      },
      onError: (error) => {
        // Handle login errors from the API
        console.error("Login failed:", error);
        setError("root", { 
          type: "manual",
          message: error.message || "Invalid email or password. Please try again." 
        });
      },
    });
  };

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-white">
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <img
                className="mx-auto h-12 w-auto"
                src="https://htmlwind.com/assets/images/logo/htmlwind.svg"
                alt="Htmlwind Logo"
              />
              <h2 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
                Login to your account
              </h2>
              <p className="mt-3 text-base text-gray-600">
                Welcome back! Please enter your credentials.
              </p>
            </div>
            <div>
              {/* Display root errors (API errors) */}
              {errors.root && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {errors.root.message}
                </div>
              )}
              {/* Update form tag */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-6"> {/* Adjusted spacing */}
                  <div>
                    <label
                      htmlFor="email"
                      className="select-none text-sm font-medium leading-6 text-gray-900 flex"
                    >
                      <Mail className="mr-2"/> Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className={`mt-2 w-full rounded border-0 bg-white px-3.5 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm sm:leading-6`}
                      {...register("email")} // Register email field
                      disabled={loginMutation.isPending} // Disable during submission
                    />
                    {/* Display email validation errors */}
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="select-none text-sm font-medium leading-6 text-gray-900 flex"
                    >
                      <Lock className="mr-2"/> Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      className={`mt-2 w-full rounded border-0 bg-white px-3.5 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 sm:text-sm sm:leading-6`}
                      {...register("password")} // Register password field
                      disabled={loginMutation.isPending} // Disable during submission
                    />
                    {/* Display password validation errors */}
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {/* Remember me checkbox (optional, no validation added here) */}
                  <div className="flex items-center gap-x-2.5">
                    <div className="group relative flex h-4 w-4">
                      <input
                        type="checkbox"
                        id="remember-me"
                        className="h-4 w-4 rounded border-gray-300 bg-white text-pink-500 checked:bg-none indeterminate:bg-none focus:border-gray-300 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-white disabled:bg-gray-100 disabled:checked:border-gray-300 disabled:checked:bg-gray-100 disabled:indeterminate:border-gray-300 disabled:indeterminate:bg-gray-100"
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
                          strokeWidth="1.67" // Use camelCase
                          strokeLinecap="round" // Use camelCase
                        />
                        <path
                          className="opacity-0 group-has-[:checked]:opacity-100"
                          d="M2 6.05059L4.47477 8.52525L10 3"
                          strokeWidth="1.67" // Use camelCase
                          strokeLinecap="round" // Use camelCase
                          strokeLinejoin="round" // Use camelCase
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
                    {/* Consider using Link component if this is an internal route */}
                    <a
                      href="#" 
                      className="inline-block text-sm font-semibold text-pink-500 hover:text-pink-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="block w-full rounded bg-pink-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:bg-pink-300 disabled:cursor-not-allowed"
                    disabled={loginMutation.isPending} // Disable button during submission
                  >
                    {/* Show loading state */}
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
            <div>
              <p className="text-center text-sm text-gray-500">
                Don't have an account? 
                <Link
                  href="/register"
                  className="font-semibold ml-1 text-pink-500 hover:text-pink-400"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;