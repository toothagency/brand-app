"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Target,
  Zap,
  Heart,
  Award,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      title: "Innovation First",
      description:
        "We push the boundaries of AI technology to deliver cutting-edge branding solutions that set our clients apart.",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Customer Success",
      description:
        "Your success is our success. We're committed to helping every business achieve their branding goals.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Quality & Trust",
      description:
        "We maintain the highest standards of quality and security in everything we do.",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Global Impact",
      description:
        "We empower businesses worldwide to create meaningful connections with their audiences.",
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Brands Created",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "50,000+",
      label: "Logos Generated",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      number: "99%",
      label: "Customer Satisfaction",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "AI Support",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/images/team/sarah.jpg",
      bio: "Former design lead at major tech companies with 15+ years in branding and AI.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/images/team/michael.jpg",
      bio: "AI/ML expert with experience building scalable platforms for millions of users.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "/images/team/emily.jpg",
      bio: "Award-winning designer passionate about making great design accessible to everyone.",
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "/images/team/david.jpg",
      bio: "Product strategist focused on creating intuitive user experiences that drive results.",
    },
  ];

  return (
    <>
      <Head>
        <title>About Us | Jara AI Brand Builder</title>
        <meta
          name="description"
          content="Learn about Jara AI's mission to democratize branding and make professional design accessible to every business."
        />
      </Head>

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Jara AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                We're on a mission to democratize branding and make professional
                design accessible to every business, regardless of size or
                budget.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Start Building Your Brand
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 text-center lg:text-left items-center">
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  We believe every business deserves a professional brand
                  identity. Traditional branding agencies charge thousands of
                  dollars and take months to deliver results. We're changing
                  that.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Using cutting-edge AI technology, we've created a platform
                  that generates stunning logos, brand kits, and marketing
                  materials in minutes—not months. Our goal is to level the
                  playing field for small businesses and entrepreneurs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      AI-powered design in minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Professional quality at affordable prices
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      No design skills required
                    </span>
                  </div>
                </div>
              </div>
              <div data-aos="fade-left">
                <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl transform rotate-3"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl transform -rotate-3"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Democratizing Design
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Making professional branding accessible to everyone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center text-white"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                These core values guide everything we do and shape how we serve
                our customers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The passionate people behind Jara AI who are dedicated to
                revolutionizing the branding industry.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16" data-aos="fade-up">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  How Jara AI came to be and why we're passionate about helping
                  businesses succeed.
                </p>
              </div>
              <div
                className="space-y-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <p>
                  Jara AI was born from a simple observation: while working with
                  small businesses and startups, we noticed that many brilliant
                  entrepreneurs had amazing ideas but struggled with branding.
                  They either couldn't afford professional design services or
                  didn't have the time to learn complex design tools.
                </p>
                <p>
                  We realized that AI technology had advanced enough to create
                  professional-quality designs, but no one was using it to solve
                  this specific problem. So we set out to build a platform that
                  would make professional branding accessible to everyone.
                </p>
                <p>
                  Today, Jara AI has helped thousands of businesses create
                  stunning brand identities in minutes. From local coffee shops
                  to tech startups, we're proud to be part of their success
                  stories. Our mission continues: to democratize design and
                  empower every business to look as professional as the big
                  players.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-600">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Build Your Brand?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of businesses that have transformed their brand
                with Jara AI.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
