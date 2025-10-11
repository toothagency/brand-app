"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Sparkles,
  ArrowRight,
  Crown,
  Users,
  Download,
  Palette,
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Brand Preview",
      price: "1,000 XAF",
      originalPrice: null,
      description: "Try our AI brand builder",
      features: [
        "3 Logo Recommendations",
        "Color Palette Preview",
        "Font Suggestions",
        "Competitors Analysis",
        "Customer Persona",
        "Brand strategy Elements",
        "Tagline and Core message",
      ],
      notIncluded: [
        "Full Logo Downloads",
        "Complete Brand Kit",
        "Vector Files (SVG, PDF, AI)",
        "Social Media Templates",
        "Business Card Designs",
        "Letterhead Design",
        "T-shirt design",
        "Signboard Design",
        "Marketing Materials",
        "Brand Guidelines PDF",
      ],
      cta: "Your Brand Preview",
      popular: false,
      icon: <Sparkles className="w-8 h-8 text-[#3467AA]" />,
    },
    {
      name: "Complete Brand Kit",
      price: "15,000 XAF",
      originalPrice: "30,000 XAF",
      description: "Unlock your full brand after form completion",
      features: [
        "All Logo Variations (PNG, SVG, PDF)",
        "Color Palette",
        "Typography",
        "Full Brand Guidelines PDF",
        "Business Card Designs",
        "Letterhead & Stationery",
        "T-shirt and Cap Designs",
        "Signboard and Signage Designs",
        "Brand pattern",
        "Social Media content",
        "Marketing Strategies",
        "Brand Asset Library",
      ],
      notIncluded: [],
      cta: "Unlock Full Brand Kit",
      popular: true,
      icon: <Crown className="w-8 h-8 text-[#F5A819]" />,
    },
  ];

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Professional Design",
      description: "AI-powered designs that rival expensive agencies",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Complete your brand in under 15 minutes",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "No Design Skills",
      description: "Anyone can create stunning brands",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Instant Download",
      description: "Get all files immediately after creation",
    },
  ];

  return (
    <>
      <Head>
        <title>Pricing | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="Choose your plan: Free for getting started or Premium for complete brand transformation. Save 10,000 XAF on our Premium plan."
        />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48  overflow-hidden">
          <div className="absolute inset-0 bg-[#3467AA]/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Try Free,{" "}
                <span className="text-[#3467AA]">Pay Once Per Brand</span> for
                Everything
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Complete the form to see your brand preview, then unlock
                everything with one payment per brand.
              </p>
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    No hidden fees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Cancel anytime
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#3467AA]" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Instant access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-white dark:bg-gray-700 shadow-lg"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-[#3467AA]/10 dark:bg-[#3467AA]/20 rounded-full flex items-center justify-center text-[#3467AA]">
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
        </section>

        {/* Pricing Plans */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Complete the form to see your brand preview, then unlock the
                complete brand kit with one payment per brand.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl ${
                      plan.popular
                        ? "border-[#F5A819] bg-[#F5A819]/5 dark:bg-[#F5A819]/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#F5A819] text-white px-6 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            plan.popular
                              ? "bg-[#F5A819]"
                              : "bg-[#3467AA]/10 dark:bg-[#3467AA]/20"
                          }`}
                        >
                          <div className="text-white">{plan.icon}</div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        {plan.originalPrice ? (
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              {plan.price}
                            </span>
                            <span className="text-2xl text-gray-400 line-through">
                              {plan.originalPrice}
                            </span>
                            <span className="bg-[#3467AA]/10 dark:bg-[#3467AA]/20 text-[#3467AA] px-3 py-1 rounded-full text-sm font-semibold">
                              Save 15,000 XAF
                            </span>
                          </div>
                        ) : (
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                        )}
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          {plan.price === "0 XAF"
                            ? "Forever"
                            : "One-time payment per brand"}
                        </p>
                      </div>

                      <Link
                        href={plan.price === "0 XAF" ? "/" : "/"}
                        className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                          plan.popular
                            ? "bg-[#F5A819] text-white hover:bg-[#F5A819]/90"
                            : "bg-[#3467AA] text-white hover:bg-[#3467AA]/90"
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        What is included:
                      </h4>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-[#3467AA] flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}

                      {plan.notIncluded.length > 0 && (
                        <>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 mt-6">
                            Not included:
                          </h4>
                          {plan.notIncluded.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-500 dark:text-gray-400">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Feature Comparison
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See exactly what you get with each plan
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">
                      Brand Preview
                    </th>
                    <th className="text-center p-6 font-semibold text-[#F5A819] dark:text-[#F5A819]">
                      Complete Brand Kit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Logo Access
                    </td>
                    <td className="p-6 text-center text-gray-700 dark:text-gray-300">
                      Recommendations only
                    </td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA] font-semibold">
                      Full downloads
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      File Formats
                    </td>
                    <td className="p-6 text-center text-gray-700 dark:text-gray-300">
                      PNG only
                    </td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA] font-semibold">
                      All formats
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Brand Kit
                    </td>
                    <td className="p-6 text-center text-gray-400">✗</td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA]">
                      ✓
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Social Templates
                    </td>
                    <td className="p-6 text-center text-gray-400">✗</td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA]">
                      ✓
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Business Cards
                    </td>
                    <td className="p-6 text-center text-gray-400">✗</td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA]">
                      ✓
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-600">
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Priority Support
                    </td>
                    <td className="p-6 text-center text-gray-400">✗</td>
                    <td className="p-6 text-center text-[#3467AA] dark:text-[#3467AA]">
                      ✓
                    </td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-700 dark:text-gray-300">
                      Price
                    </td>
                    <td className="p-6 text-center text-gray-700 dark:text-gray-300 font-semibold">
                      1,000 XAF
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-[#3467AA] dark:text-[#3467AA] font-semibold">
                        15,000 XAF
                      </span>
                      <div className="text-sm text-gray-500 line-through">
                        30,000 XAF
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What do I get with the brand preview?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete the form to see logo recommendations, color palette previews, font suggestions, 
                  and a brand strategy overview. You will get a taste of what your brand could look like.
                </p>
              </div>

              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Why do I pay a fee to preview?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The preview fee is there to chase away window shoppers, we believe that most people who 
                  want things for free are more likely to never pay for anything, so for those serious 
                  about building something credible they won’t mind previewing their brand. 
                  ( also we don’t mind making a bit of cash while still delivering value)
                </p>
              </div>

              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  When do I pay the 15,000 XAF?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  After completing the form and seeing your brand preview, you can choose to unlock the 
                  complete brand kit with a one-time payment of 15,000 XAF per brand. 
                  This gives you lifetime access to all files and assets for that specific brand.
                </p>
              </div>

              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is the 15,000 XAF price really a discount?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Absolutely! Our Complete Brand Kit normally costs 30,000 XAF, but we are offering it at 50% off for a limited time. This represents the value of professional branding services that would cost much more from a traditional agencies.
                </p>
              </div>
              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                data-aos="fade-up"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Do I own the rights to my designs?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! You own 100% of the rights to all designs created with Jara AI. You can use them for any commercial purpose without any restrictions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#F5A819]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to See Your Brand Preview?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Complete the form to see your brand recommendations, then unlock
                everything with one payment per brand. Save 10,000 XAF today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/form"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/form"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#3467AA] text-white rounded-full font-semibold hover:bg-[#3467AA]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Unlock Complete Brand Kit - Save 10,000 XAF
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
