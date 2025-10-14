"use client";
import React, { useState } from "react";
import Head from "next/head";
import { feedbackApi } from "../../lib/api";
import Image from "next/image";
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  VenetianMask,
} from "lucide-react";

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

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48 overflow-hidden">
          <div className="absolute inset-0 bg-[#3467AA]/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              {/* <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
              </div> */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-6">
                We listen,<span className="text-[#3467AA]"> We don’t Judge</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                We might look like we have everything figured out but trust us we don’t. We really want to 
                hear from you and build for you
              </p>
              {/* <div className="flex justify-center items-center gap-4 mb-2 lg:mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Quick & Easy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Anonymous Option
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    We Listen
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Form Card */}
                <div className="order-2 lg:order-1" data-aos="fade-right">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Share Your Thoughts
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tell us about your experience with Jara AI. What worked
                        well? What could be better?
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      aria-labelledby="feedback-form-title"
                    >
                      <div>
                        <label
                          htmlFor="feedback-name"
                          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Name (optional)
                        </label>
                        <input
                          id="feedback-name"
                          type="text"
                          className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3467AA] focus:border-transparent transition-all duration-200"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          aria-describedby="name-optional"
                          placeholder="Your name"
                        />
                        <div id="name-optional" className="sr-only">
                          Name field is optional
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="feedback-email"
                          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Email (optional)
                        </label>
                        <input
                          id="feedback-email"
                          type="email"
                          className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3467AA] focus:border-transparent transition-all duration-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          aria-describedby="email-optional"
                          placeholder="your.email@example.com"
                        />
                        <div id="email-optional" className="sr-only">
                          Email field is optional
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="feedback-message"
                          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Your Feedback{" "}
                          <span className="text-red-500" aria-label="required">
                            *
                          </span>
                        </label>
                        <textarea
                          id="feedback-message"
                          className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3467AA] focus:border-transparent transition-all duration-200 min-h-[120px] resize-none"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          required
                          aria-describedby="feedback-required"
                          placeholder="Share your experience, suggestions, or any issues you encountered..."
                        />
                        <div id="feedback-required" className="sr-only">
                          Feedback field is required
                        </div>
                      </div>

                      {error && (
                        <div
                          className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
                          role="alert"
                          aria-live="polite"
                        >
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{error}</span>
                        </div>
                      )}

                      {showSql && (
                        <div
                          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl"
                          role="alert"
                        >
                          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3 font-semibold">
                            Run this SQL in your Supabase SQL editor to create
                            the feedback table:
                          </p>
                          <pre
                            className="text-xs bg-yellow-100 dark:bg-yellow-800 p-3 rounded-lg overflow-x-auto text-yellow-900 dark:text-yellow-100"
                            aria-label="SQL code to create feedback table"
                          >
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
                        <div
                          className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
                          role="alert"
                          aria-live="polite"
                        >
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Thank you for your feedback! We'll review it
                            carefully.
                          </span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-[#3467AA] text-white font-semibold rounded-xl hover:bg-[#3467AA]/90 focus:ring-2 focus:ring-[#3467AA]/50 dark:focus:ring-[#3467AA]/50 focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2"
                        disabled={loading}
                        aria-describedby={
                          loading ? "submitting-feedback" : undefined
                        }
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Feedback...
                          </>
                        ) : (
                          <>
                            Send Feedback
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                      {loading && (
                        <div id="submitting-feedback" className="sr-only">
                          Submitting your feedback, please wait
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Illustration & Content */}
                <div className="order-1 lg:order-2" data-aos="fade-left">
                  <div className="text-center lg:text-left">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Voice Matters
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Every piece of feedback helps us create a better
                        experience for entrepreneurs and businesses worldwide.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div className="w-12 h-12  rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-[#3467AA]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Quick & Easy
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Just like everything else we build
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div className="w-12 h-12  rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-6 h-6 text-[#F5A819]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            We Actually Listen
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            We read all of these, this is your voice being part of our roadmap
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div className="w-12 h-12  rounded-full flex items-center justify-center flex-shrink-0">
                          <VenetianMask className="w-6 h-6 text-[#3467AA]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Anonymous Option
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Incase you have something spicy you want to say, You are safe cause we won’t know its you
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Illustration */}
                    <div className="mt-12 lg:flex justify-center hidden  lg:justify-start">
                      <div className="w-64 h-64  flex items-center justify-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#F5A819]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Your Brand?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Now that you have poured out your heart to us, why not build another brand with Jara AI
              </p>
              <a
                href="/form"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start Building Your Brand
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
