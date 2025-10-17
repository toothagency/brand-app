"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle,
  LogIn,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Answer Simple Questions",
      description:
        "Sign up using your email and a strong password. It only takes 20 seconds, and there’s no complicated onboarding. You can jump right in.",
      icon: <LogIn className="w-8 h-8 text-[#3467AA]" />,
      details: [
      ],
      image: "/images/how-it-works/step1.jpg",
      timeEstimate: "30 seconnds",
    },
    {
      number: "02",
      title: "Answer Guided Questions",
      description:
        "Jara will ask you a few tailored questions about your business goals, audience, and vibe. These questions are based on proven branding and marketing strategy techniques to ensure you’re building your brand with intention",
      icon: <MessageSquare className="w-8 h-8 text-[#3467AA]" />,
      details: [
        "Business type and industry",
        "Target audience and market",
        "Brand personality and style",
        "Color preferences and inspiration",
      ],
      image: "/images/how-it-works/step1.jpg",
      timeEstimate: "2-3 minutes",
    },
    {
      number: "03",
      title: "Generate Your Brand and marketing Blueprint",
      description:
        "In a matter of minutes, Jara AI creates a complete brand blueprint and marketing assets containing: ",
      icon: <Sparkles className="w-8 h-8 text-[#3467AA]" />,
      details: [
        "Multiple logo variations",
        "Color palette suggestions",
        "Typography recommendations",
        "Brand style guidelines",
      ],
      image: "/images/how-it-works/step2.jpg",
      timeEstimate: "30 seconds",
    },

    {
      number: "04",
      title: "Download & Launch",
      description:
        "Download your complete brand kit with all the files you need to start using your new brand immediately.",
      icon: <Download className="w-8 h-8 text-[#3467AA]" />,
      details: [
        "High-resolution logo files",
        "Social media templates",
        "Business card designs",
        "Brand guidelines PDF",
      ],
      image: "/images/how-it-works/step4.jpg",
      timeEstimate: "Instant",
    },
  ];

  // const features = [
  //   {
  //     icon: <Clock className="w-6 h-6" />,
  //     title: "Lightning Fast",
  //     description: "Complete your brand in under 15 minutes",
  //   },
  //   {
  //     icon: <Zap className="w-6 h-6" />,
  //     title: "AI-Powered",
  //     description: "Advanced algorithms create professional designs",
  //   },
  //   {
  //     icon: <Users className="w-6 h-6" />,
  //     title: "No Design Skills",
  //     description: "Anyone can create stunning brands",
  //   },
  //   {
  //     icon: <Star className="w-6 h-6" />,
  //     title: "Professional Quality",
  //     description: "Results that rival expensive agencies",
  //   },
  // ];

  return (
    <>
      <Head>
        <title>How It Works | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="See how Jara AI creates your brand in 4 simple steps. From answering questions to downloading your brand kit in under 15 minutes."
        />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48 overflow-hidden">
          <div className="absolute inset-0 bg-[#3467AA]/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Build A Brand with Jara in <span className="text-[#3467AA]">4 Easy Steps</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                You don’t need to be a design or marketing professional. Jara will do the heavy lifting and handle your 
                brand visuals so you can focus on growing your business.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#3467AA] text-white rounded-full font-semibold hover:bg-[#3467AA]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Brand
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Features */}
        {/* <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl "
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-[#3467AA]/10 dark:bg-white rounded-full flex items-center justify-center text-[#3467AA]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Steps Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                The Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From concept to completion, here's how we create your perfect
                brand in minutes.
              </p>
            </div>

            <div className="space-y-20">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                  data-aos-delay={index * 200}
                >
                  {/* Content */}
                  <div
                    className={`space-y-6 ${
                      index % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#3467AA] rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.number}
                      </div>
                      <div className="flex items-center gap-3">
                        {step.icon}
                        <span className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
                          {step.timeEstimate}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-[#3467AA] flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <div
                    className={`${
                      index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                    }`}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <div className="relative w-full h-80 lg:h-96 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-24 h-24 bg-[#F5A819] rounded-full flex items-center justify-center mx-auto mb-6">
                            {step.icon}
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Step {step.number}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {step.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Results Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  What You Get
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Your complete brand kit includes everything you need to launch
                  your business with confidence.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Branding Assets
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        A brand logo with Cirresponding Business card, Tshirt ,Signboard etc designs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Messaging Framework
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Brand communication guidelines to optimize your messaging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Marketing Blueprint
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        A brand strategy outline to assist with marketing efforts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Audience Insights
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Customer personas to help you understand your target audience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Market Positioning
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your competitive advantage over others in your industry or niche
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-[#3467AA]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Content Planning
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        A two-week social media content calendar
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div data-aos="fade-left">
                <div className="relative">
                  <div className="w-full h-96 bg-[#3467AA] rounded-2xl shadow-2xl transform rotate-3"></div>
                  <div className="absolute inset-0 bg-[#F5A819] rounded-2xl shadow-2xl transform -rotate-3"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <Download className="w-16 h-16 text-[#3467AA] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Complete Brand Kit
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Everything you need to launch your brand
                      </p>
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
                Ready to Create Your Brand?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of businesses that have transformed their brand
                with Jara AI in under 15 minutes.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start Now - It's Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
