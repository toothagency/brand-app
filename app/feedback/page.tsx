"use client";
import React, { useState } from "react";
import Head from "next/head";
import { feedbackApi } from "../../lib/api";
import Image from "next/image";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showSql, setShowSql] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setShowSql(false);

    if (!feedback.trim()) {
      setError("Feedback is required.");
      return;
    }

    setLoading(true);
    try {
      const result = await feedbackApi.submit({ name, email, feedback });

      if (!result.success) {
        if (result.error === "Feedback table not found") {
          setError(
            "Database table not found. Please create the feedback table."
          );
          setShowSql(true);
        } else {
          setError(result.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setFeedback("");
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Leave Feedback | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="We value your feedback! Let us know how we can improve Jara AI Brand Builder."
        />
      </Head>
      <div className="min-h-screen mt-14 md:mt-0 flex flex-col justify-center items-center bg-white dark:bg-gray-900 py-8 px-2 md:px-6">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <div className="text-center px-2 md:px-0">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              We value your feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base md:text-lg">
              Let us know how we can improve Jara AI Brand Builder.
            </p>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center justify-center">
            {/* Form Card */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-md p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-0 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      className="w-full rounded border-0 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full rounded border-0 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  {showSql && (
                    <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg overflow-x-auto mt-2">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2 font-semibold">
                        Run this SQL in your Supabase SQL editor to create the
                        feedback table:
                      </p>
                      <pre className="text-xs bg-yellow-100 dark:bg-yellow-800 p-3 rounded overflow-x-auto text-yellow-900 dark:text-yellow-100">
                        {`CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow public inserts" ON feedback
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (optional, for admin purposes)
CREATE POLICY "Allow public reads" ON feedback
  FOR SELECT USING (true);`}
                      </pre>
                    </div>
                  )}
                  {success && (
                    <div className="text-green-600 dark:text-green-400 text-sm">
                      Thank you for your feedback!
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-blue-600 dark:bg-blue-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 focus:outline-none transition-colors disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit Feedback"}
                  </button>
                </form>
              </div>
            </div>
            {/* Illustration */}
            <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
              <div className="w-3/4 sm:w-2/3 md:w-full max-w-xs md:max-w-md">
                <Image
                  src="/images/customer-feedback.svg"
                  alt="Customer Feedback"
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
