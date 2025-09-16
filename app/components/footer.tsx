"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());
  const pathname = usePathname();

  // ✨ Move this array here
  const routesWithoutNavbar = ["/login", "/register", "/dashboard", "/dashboard/overview", "/dashboard/brands", "/dashboard/analytics", "/dashboard/documents", "/dashboard/marketing", "/dashboard/settings"];

  // ✨ Move the check to the top, before any other hooks
  if (routesWithoutNavbar.includes(pathname)) {
    return null; // Don't render anything if the path matches
  }

  return (
    <section className="pt-16 pb-7 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-14 border-b-2 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-8 xl:gap-14 w-full lg:max-w-full mx-auto">
            <div className="flex flex-col gap-4 items-center lg:items-start">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center space-x-2"
                aria-label="Jara AI Brand Builder - Home"
              >
                <div
                  className={`md:size-24 size-20 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300`}
                >
                  <Image
                    src="/Logo-alt.png"
                    alt="Jara AI Brand Builder logo"
                    width={1000}
                    height={1000}
                  />
                </div>
              </Link>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400 max-[470px]:text-center">
                Take the First Step Towards Success!
              </p>
              <div className="flex items-center max-[470px]:justify-center gap-5">
                <a
                  href="mailto:support@jara-ai.com"
                  className="p-2 text-black dark:text-gray-200 rounded transition-all duration-500 hover:bg-yellow-800 dark:hover:bg-yellow-700 focus-within:bg-yellow-800 dark:focus-within:bg-yellow-700 hover:text-white dark:hover:text-white focus-within:outline-0 focus-within:text-white"
                >
                  <Mail />
                </a>
                <a
                  href="https://x.com/jara_ai"
                  className="p-2 h-10 w-10 flex items-center justify-center text-black dark:text-gray-200 rounded transition-all duration-500 hover:bg-yellow-800 dark:hover:bg-yellow-700 focus-within:outline-0 focus-within:bg-yellow-800 dark:focus-within:bg-yellow-700 hover:text-white dark:hover:text-white focus-within:text-white"
                >
                  <Twitter />
                </a>
                <a
                  href="https://www.instagram.com/jara_ai/"
                  className="p-2 text-black dark:text-gray-200 rounded transition-all duration-500 hover:bg-yellow-800 dark:hover:bg-yellow-700 focus-within:bg-yellow-800 dark:focus-within:bg-yellow-700 hover:text-white dark:hover:text-white focus-within:outline-0 focus-within:text-white"
                >
                  <Instagram />
                </a>
                <a
                  href="https://www.facebook.com/jara.ai"
                  className="p-2 text-black dark:text-gray-200 group rounded transition-all duration-500 hover:bg-yellow-800 dark:hover:bg-yellow-700 focus-within:bg-yellow-800 dark:focus-within:bg-yellow-700 hover:text-white dark:hover:text-white focus-within:outline-0 focus-within:text-white"
                >
                  <Facebook />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full lg:max-w-full mx-auto flex flex-col min-[470px]:flex-row justify-between text-center lg:text-left gap-6 sm:gap-20 md:gap-10 xl:gap-24">
            <div className="">
              <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-7 max-[470px]:text-center">
                Pagedone
              </h6>
              <ul className="flex flex-col max-[470px]:items-center max-[470px]:justify-center gap-6">
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Pro Version
                  </a>
                </li>
              </ul>
            </div>
            <div className="">
              <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-7 max-[470px]:text-center">
                Products
              </h6>
              <ul className="flex flex-col max-[470px]:items-center max-[470px]:justify-center gap-6">
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Figma UI System
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Icons Assets
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Responsive Blocks
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Components Library
                  </a>
                </li>
              </ul>
            </div>
            <div className="">
              <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-7 max-[470px]:text-center">
                Resources
              </h6>
              <ul className="flex flex-col max-[470px]:items-center max-[470px]:justify-center gap-6">
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Quick Start
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
                  >
                    User Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-5 sm:flex-row items-center first-letter:items-center justify-between pt-7">
          <p className="font-normal text-sm text-gray-500 dark:text-gray-400">
            ©
            <a href="https://jara-ai.com" className="hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors">
              Jara AI{" "}
            </a>
            {year} All rights reserved.
          </p>
          <ul className="flex items-center gap-9">
            <li>
              <a
                href="javascript:;"
                className="text-gray-500 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="text-gray-500 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="javascript:;"
                className="text-gray-500 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-yellow-800 dark:hover:text-yellow-400 focus-within:outline-0 focus-within:text-yellow-800 dark:focus-within:text-yellow-400"
              >
                Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}