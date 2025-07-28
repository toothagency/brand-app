"use client";
import React, { useState } from "react";
import Head from "next/head";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Globe,
  Users,
  Building,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@jaraai.com",
      link: "mailto:hello@jaraai.com",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available 24/7",
      link: "#",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    },
  ];

  const officeInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Headquarters",
      details: "123 Innovation Drive, Tech City, TC 12345",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM EST",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Support Team",
      details: "Available 24/7 for urgent inquiries",
    },
  ];

  return (
    <>
      <Head>
        <title>Contact Us | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="Get in touch with the Jara AI team. We're here to help with your branding needs and answer any questions."
        />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-6">
                Get in{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Have questions about Jara AI? We're here to help you build the
                perfect brand.
              </p>
              <div className="flex justify-center items-center gap-4 mb-2 lg:mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    24/7 Support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Quick Response
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Expert Team
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the method that works best for you. We're here to help
                with any questions about Jara AI.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </p>
                  <a
                    href={method.link}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {method.contact}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="order-2 lg:order-1" data-aos="fade-right">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Send Us a Message
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Fill out the form below and we'll get back to you within
                        24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-600 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-600 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-600 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="pricing">Pricing Questions</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-600 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Tell us how we can help you..."
                          required
                        />
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

                      {success && (
                        <div
                          className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
                          role="alert"
                          aria-live="polite"
                        >
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Thank you! We'll get back to you within 24 hours.
                          </span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="order-1 lg:order-2" data-aos="fade-left">
                  <div className="text-center lg:text-left">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Let's Build Something Amazing Together
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Whether you're ready to start your brand journey or just
                        have questions, our team is here to help you succeed.
                      </p>
                    </div>

                    <div className="space-y-6 mb-8">
                      {officeInfo.map((info, index) => (
                        <div
                          key={index}
                          className="flex flex-col lg:flex-row items-center lg:items-start gap-4"
                        >
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            {info.icon}
                          </div>
                          <div className="text-center lg:text-left">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {info.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {info.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FAQ Link */}
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Quick Questions?
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Check out our FAQ section for quick answers to common
                        questions.
                      </p>
                      <a
                        href="/#faq"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        View FAQ
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Illustration */}
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-600">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Brand Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                While you're here, why not try creating your brand with Jara AI?
                It only takes 10 minutes!
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
