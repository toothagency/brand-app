"use client";
import React, { useState, useMemo } from "react";
import Head from "next/head";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CreditCard,
  Settings,
  Shield,
  Users,
  FileText,
} from "lucide-react";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqData = {
    "getting-started": {
      title: "Getting Started",
      icon: <Sparkles className="w-5 h-5" />,
      questions: [
        {
          id: "gs-1",
          question: "What is Jara AI?",
          answer:
            "Jara AI is a tool that is specifically designed to help you build your brand from scratch in just 10 minutes. It uses artificial intelligence to generate logos, color palettes, typography, and complete brand strategies based on your business information.",
        },
        {
          id: "gs-2",
          question: "How do I use Jara AI?",
          answer:
            "Simply sign up, answer a few guided questions about your business, and Jara AI will generate your logo, brand colours, overall strategy, and a downloadable brand blueprint. The process is completely automated and takes only 10 minutes.",
        },
        {
          id: "gs-3",
          question: "How long does it take to build a brand with Jara AI?",
          answer:
            "Building a brand with Jara takes exactly 10 minutes. No more, no less. From answering questions to receiving your complete brand kit, the entire process is designed to be lightning-fast.",
        },
        {
          id: "gs-4",
          question: "What information do I need to provide?",
          answer:
            "You'll need to provide basic information about your business including: business name, industry, target audience, brand personality, and any specific preferences for colors or styles. The more detailed your answers, the better your results will be.",
        },
        {
          id: "gs-5",
          question: "Do I need design skills to use Jara AI?",
          answer:
            "No design skills required! Jara AI is designed to be beginner-friendly. Anyone can create a professional brand without needing a branding expert or design experience.",
        },
      ],
    },
    features: {
      title: "Features & Capabilities",
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          id: "feat-1",
          question: "What file formats do I get with my brand kit?",
          answer:
            "With the Complete Brand Kit, you get all file formats including PNG, SVG, PDF, and AI files. The free trial only provides logo recommendations and previews.",
        },
        {
          id: "feat-2",
          question: "Can I customize my logo after generation?",
          answer:
            "Yes! With the Complete Brand Kit, you get multiple logo variations and can request customizations. The AI generates several options based on your preferences.",
        },
        {
          id: "feat-3",
          question: "Do you offer social media templates?",
          answer:
            "Yes, the Complete Brand Kit includes social media templates for all major platforms including Instagram, Facebook, Twitter, LinkedIn, and TikTok.",
        },
        {
          id: "feat-4",
          question: "What's included in the brand guidelines?",
          answer:
            "The brand guidelines include color palette specifications, typography rules, logo usage guidelines, spacing requirements, and examples of how to apply your brand consistently across different mediums.",
        },
        {
          id: "feat-5",
          question: "Can I use the designs commercially?",
          answer:
            "Absolutely! You own 100% of the rights to all designs created with Jara AI. You can use them for any commercial purpose without any restrictions.",
        },
      ],
    },
    pricing: {
      title: "Pricing & Plans",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          id: "price-1",
          question: "How much does Jara AI cost?",
          answer:
            "Less than a designer, less than a brand strategist, and less than a marketing specialist. Our Complete Brand Kit is priced at 10,000 XAF (50% off from 20,000 XAF) for lifetime access.",
        },
        {
          id: "price-2",
          question: "What's included in the free trial?",
          answer:
            "The free trial includes logo recommendations, basic color palette preview, font suggestions, brand strategy overview, and sample brand elements. You can complete the form and see what your brand could look like.",
        },
        {
          id: "price-3",
          question: "When do I pay the 10,000 XAF?",
          answer:
            "After completing the form and seeing your brand preview, you can choose to unlock the complete brand kit with a one-time payment of 10,000 XAF. This gives you lifetime access to all files and assets.",
        },
        {
          id: "price-4",
          question: "Is there a money-back guarantee?",
          answer:
            "We're confident you'll love your brand, but if you're not satisfied within 30 days, we offer a full refund. Your satisfaction is our priority.",
        },
        {
          id: "price-5",
          question: "Can I upgrade from free to premium later?",
          answer:
            "Yes! You can upgrade to the Complete Brand Kit at any time after completing the form. The 10,000 XAF price is a one-time payment for lifetime access.",
        },
      ],
    },
    technical: {
      title: "Technical Support",
      icon: <Settings className="w-5 h-5" />,
      questions: [
        {
          id: "tech-1",
          question: "What browsers are supported?",
          answer:
            "Jara AI works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience.",
        },
        {
          id: "tech-2",
          question: "How do I download my files?",
          answer:
            "After purchasing the Complete Brand Kit, you'll receive instant access to download all your brand files. Files are available in multiple formats and can be downloaded individually or as a complete package.",
        },
        {
          id: "tech-3",
          question: "What if I lose my files?",
          answer:
            "No worries! Once you purchase the Complete Brand Kit, you have lifetime access to your files. You can download them again anytime from your account dashboard.",
        },
        {
          id: "tech-4",
          question: "Can I use the files with design software?",
          answer:
            "Yes! The files are compatible with all major design software including Adobe Illustrator, Photoshop, Canva, Figma, and more. We provide both vector and raster formats.",
        },
        {
          id: "tech-5",
          question: "Is my data secure?",
          answer:
            "Absolutely. We use industry-standard encryption and security measures to protect your data. Your information is never shared with third parties without your consent.",
        },
      ],
    },
    account: {
      title: "Account & Billing",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          id: "acc-1",
          question: "How do I create an account?",
          answer:
            "Creating an account is simple! Just click 'Get Started' and follow the registration process. You'll need to provide your email and create a password.",
        },
        {
          id: "acc-2",
          question: "Can I change my account information?",
          answer:
            "Yes, you can update your account information anytime from your account settings. This includes your email, password, and personal details.",
        },
        {
          id: "acc-3",
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, debit cards, and digital payment methods. All payments are processed securely through our payment partners.",
        },
        {
          id: "acc-4",
          question: "How do I access my brand files?",
          answer:
            "Once you purchase the Complete Brand Kit, you can access all your files from your account dashboard. Files are organized by category for easy navigation.",
        },
        {
          id: "acc-5",
          question: "Can I share my account with my team?",
          answer:
            "Yes! The Complete Brand Kit includes team collaboration features, allowing you to share your brand assets with your team members securely.",
        },
      ],
    },
    business: {
      title: "Business & Legal",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          id: "bus-1",
          question: "Do I own the rights to my designs?",
          answer:
            "Yes! You own 100% of the rights to all designs created with Jara AI. You can use them for any commercial purpose without any restrictions or licensing fees.",
        },
        {
          id: "bus-2",
          question: "Can I trademark my logo?",
          answer:
            "Absolutely! Since you own the rights to your logo, you can trademark it with your local trademark office. We recommend consulting with a legal professional for trademark registration.",
        },
        {
          id: "bus-3",
          question: "What if I need to modify my brand later?",
          answer:
            "You can always come back and create a new brand or request modifications. The Complete Brand Kit includes lifetime access, so you can update your brand as your business evolves.",
        },
        {
          id: "bus-4",
          question: "Do you offer business partnerships?",
          answer:
            "Yes! We're always interested in partnerships with agencies, designers, and businesses. Contact us through our contact page to discuss partnership opportunities.",
        },
        {
          id: "bus-5",
          question: "Is Jara AI suitable for all business types?",
          answer:
            "Jara AI is designed to work for businesses of all sizes and industries. From startups to established companies, our AI can create professional brands for any type of business.",
        },
      ],
    },
  };

  const categories = [
    {
      id: "all",
      title: "All Questions",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    ...Object.entries(faqData).map(([id, data]) => ({
      id,
      title: data.title,
      icon: data.icon,
    })),
  ];

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = useMemo(() => {
    let filtered = Object.entries(faqData);

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        ([categoryId]) => categoryId === activeCategory
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered
        .map(
          ([categoryId, categoryData]) =>
            [
              categoryId,
              {
                ...categoryData,
                questions: categoryData.questions.filter(
                  (q) =>
                    q.question
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                ),
              },
            ] as [string, typeof categoryData]
        )
        .filter(([, categoryData]) => categoryData.questions.length > 0);
    }

    return filtered;
  }, [searchTerm, activeCategory]);

  const totalQuestions = Object.values(faqData).reduce(
    (acc, category) => acc + category.questions.length,
    0
  );
  const visibleQuestions = filteredFAQs.reduce(
    (acc, [, categoryData]) => acc + categoryData.questions.length,
    0
  );

  return (
    <>
      <Head>
        <title>FAQ | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Jara AI Brand Builder. Get help with pricing, features, technical support, and more."
        />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Find answers to common questions about Jara AI. Can't find what
                you're looking for? Contact our support team.
              </p>

              {/* Search Bar */}
              <div
                className="max-w-2xl mx-auto mb-8"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 mb-2 lg:mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    {totalQuestions} Questions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    6 Categories
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories & FAQ Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Category Filters */}
              <div className="mb-12" data-aos="fade-up">
                <div className="flex flex-wrap justify-center gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {category.icon}
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              {searchTerm && (
                <div className="text-center mb-8" data-aos="fade-up">
                  <p className="text-gray-600 dark:text-gray-300">
                    Found {visibleQuestions} result
                    {visibleQuestions !== 1 ? "s" : ""} for "{searchTerm}"
                  </p>
                </div>
              )}

              {/* FAQ Items */}
              <div className="space-y-6">
                {filteredFAQs.map(([categoryId, categoryData]) => (
                  <div key={categoryId} className="space-y-4">
                    {activeCategory === "all" && (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        {categoryData.icon}
                        {categoryData.title}
                      </h2>
                    )}

                    {categoryData.questions.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                        data-aos="fade-up"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                            {item.question}
                          </h3>
                          {expandedItems.has(item.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>

                        {expandedItems.has(item.id) && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredFAQs.length === 0 && searchTerm && (
                <div className="text-center py-12" data-aos="fade-up">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try searching with different keywords or browse our
                    categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View All Questions
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Still Have Questions?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Can't find the answer you're looking for? Our support team is
                here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Support
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a
                  href="/form"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  Try Jara AI
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
