"use client";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValidations } from "../utils/validations";
import { useSignup } from "../hooks/authHooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Providers from "../../providers";

const Register = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the signup mutation hook
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    setError,
  } = useForm<RegisterValidations>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterValidations) => {
    setIsSubmitting(true);
    try {
      // Transform data to match what the backend expects
      const signupData = {
        userName: data.username, // Change to userName to match backend
        email: data.email,
        password: data.password,
        // confirmPassword and terms aren't sent to the API
      };

      // Call the signup mutation
      await signupMutation.mutateAsync(signupData);

      // If we reach here, registration was successful
      console.log("Registration successful!");
      toast.success("Registration successful! Please log in.");
      // Redirect to dashboard or login page
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration failed:", error);

      // Set form error
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  console.log("Form errors:", errors);

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-white dark:bg-gray-900">
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center justify-center space-x-2 w-full"
              >
                <div
                  className={`md:w-14 md:h-14 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 `}
                >
                  <img src="/Logo.png" alt="" />
                </div>
              </Link>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                Create a new account
              </h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                Please fill in your information to get started.
              </p>
            </div>
            <div>
              {/* Display API error messages */}
              {signupMutation.isError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                  {signupMutation.error instanceof Error
                    ? signupMutation.error.message
                    : "An error occurred during registration."}
                </div>
              )}
              {/* Display form validation errors */}
              {errors.root && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
                  {errors.root.message}
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
                      htmlFor="username"
                      className="select-none text-sm font-medium leading-6 text-gray-900 dark:text-white flex"
                    >
                      <User className="mr-2" /> Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      className={`mt-2 w-full rounded border-0 bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                        errors.username
                          ? "ring-red-500"
                          : "ring-gray-300 dark:ring-gray-600"
                      } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6`}
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="select-none text-sm font-medium leading-6 text-gray-900 dark:text-white flex"
                    >
                      <Mail className="mr-2" /> Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className={`mt-2 w-full rounded border-0 bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                        errors.email
                          ? "ring-red-500"
                          : "ring-gray-300 dark:ring-gray-600"
                      } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="select-none text-sm font-medium leading-6 text-gray-900 dark:text-white flex"
                    >
                      <Lock className="mr-2" /> Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Create a password"
                        className={`w-full rounded border-0 bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                          errors.password
                            ? "ring-red-500"
                            : "ring-gray-300 dark:ring-gray-600"
                        } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pr-10`}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="select-none text-sm font-medium leading-6 text-gray-900 dark:text-white flex"
                    >
                      <Lock className="mr-2" /> Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className={`w-full rounded border-0 bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                          errors.confirmPassword
                            ? "ring-red-500"
                            : "ring-gray-300 dark:ring-gray-600"
                        } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pr-10`}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-x-2.5">
                    <div className="group relative flex h-4 w-4">
                      <input
                        type="checkbox"
                        id="terms"
                        className={`h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-500 checked:bg-none indeterminate:bg-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 ${
                          errors.terms ? "border-red-500" : ""
                        }`}
                        {...register("terms")}
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
                      htmlFor="terms"
                      className="select-none text-sm text-gray-900 dark:text-white"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.terms.message}
                  </p>
                )}
                <div>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      formIsSubmitting ||
                      signupMutation.isPending
                    }
                    className="block w-full rounded bg-blue-500 dark:bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-700 disabled:cursor-not-allowed"
                  >
                    {signupMutation.isPending || isSubmitting
                      ? "Signing up..."
                      : "Sign up"}
                  </button>
                </div>
              </form>
            </div>
            <div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?
                <Link
                  href="/login"
                  className="font-semibold ml-1 text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const RegisterPage = () => (
  <Providers>
    <Register />
  </Providers>
);
export default RegisterPage;
