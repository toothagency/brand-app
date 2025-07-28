"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useClientAuth } from "../(auth)/hooks/useClientAuth"; // Adjust path if needed
import Image from "next/image";

interface NavLink {
  name: string;
  href: string;
  dropdown?: NavLink[];
}

const Navbar: React.FC = () => {
  const pathname = usePathname();

  // ✨ Move this array here
  const routesWithoutNavbar = ["/login", "/register"];

  // ✨ Move the check to the top, before any other hooks
  if (routesWithoutNavbar.includes(pathname)) {
    return null; // Don't render anything if the path matches
  }

  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isHomePage: boolean = pathname === "/";

  const { user, isLoading, logout } = useClientAuth();

  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Dark mode state and logic
  const [isDark, setIsDark] = useState(false);

  // On mount, set theme from localStorage or system
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Toggle handler
  const toggleDark = () => {
    if (typeof window === "undefined") return;
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target as Node)
      ) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect for handling scroll-based style changes
  useEffect(() => {
    const handleScroll = (): void => {
      setHasScrolled(window.scrollY > 10);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setHasScrolled(true); // Other pages should always have the solid navbar
    }
  }, [isHomePage]);

  // Handle escape key to close menus
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsAvatarMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navbarClasses: string = hasScrolled
    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-800 dark:text-gray-200 shadow-lg border-b border-gray-100 dark:border-gray-800"
    : "bg-transparent text-black dark:text-white";

  const navLinks: NavLink[] = [
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Feedback", href: "/feedback" },
    {
      name: "Contact Us",
      href: "/contact",
    }
  ];

  const handleMobileMenuToggle = (): void =>
    setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = (): void => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${navbarClasses}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Main Nav Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center space-x-2"
              aria-label="Jara AI Brand Builder - Home"
            >
              <div
                className={`md:size-36 size-32 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 `}
              >
                <Image
                  src="/Logo.png"
                  alt="Jara AI Brand Builder logo"
                  width={1000}
                  height={1000}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center space-x-2"
              role="menubar"
            >
              {navLinks.map((link, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() =>
                    link.dropdown && setActiveDropdown(link.name)
                  }
                  onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    role="menuitem"
                    aria-haspopup={link.dropdown ? "true" : undefined}
                    aria-expanded={
                      link.dropdown && activeDropdown === link.name
                        ? "true"
                        : undefined
                    }
                  >
                    {link.name}
                    {link.dropdown && (
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Link>
                  {link.dropdown && activeDropdown === link.name && (
                    <div
                      className="absolute top-full left-0  w-48 bg-white dark:bg-gray-800 rounded-lg  shadow-2xl border border-gray-100 dark:border-gray-800 "
                      role="menu"
                      aria-label={`${link.name} submenu`}
                    >
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-800 dark:hover:bg-yellow-500/20 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA / User Avatar Section */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle button */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" aria-hidden="true" />
              )}
            </button>
            <div className="hidden lg:flex items-center space-x-4">
              {isLoading ? (
                <div
                  className="w-36 h-10 bg-gray-200 rounded-full animate-pulse"
                  aria-label="Loading user information"
                ></div>
              ) : user ? (
                <div className="relative" ref={avatarMenuRef}>
                  <button
                    onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-blue-500 hover:ring-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label={`User menu for ${user.username}`}
                    aria-haspopup="true"
                    aria-expanded={isAvatarMenuOpen}
                  >
                    <span
                      className="font-semibold text-gray-700"
                      aria-hidden="true"
                    >
                      {user.initials}
                    </span>
                  </button>
                  {isAvatarMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2"
                      role="menu"
                      aria-label="User account menu"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsAvatarMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                        role="menuitem"
                      >
                        <LayoutDashboard
                          className="w-4 h-4"
                          aria-hidden="true"
                        />{" "}
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsAvatarMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                        role="menuitem"
                      >
                        <Settings className="w-4 h-4" aria-hidden="true" />{" "}
                        Settings
                      </Link>
                      <div
                        className="h-px bg-gray-200 dark:bg-gray-700 my-1"
                        aria-hidden="true"
                      ></div>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" /> Log
                        Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-y-auto ${
            isMobileMenuOpen
              ? "max-h-[calc(100vh-5rem)] opacity-100"
              : "max-h-0 opacity-0"
          }`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 mt-2 mb-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-yellow-800 dark:hover:text-yellow-400 rounded-lg transition-colors font-medium focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  {link.name}
                </Link>
              ))}
              <div
                className="h-px bg-gray-200 dark:bg-gray-700 my-3"
                aria-hidden="true"
              ></div>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-yellow-800 dark:hover:text-yellow-400 rounded-lg transition-colors font-medium focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                    role="menuitem"
                  >
                    <LayoutDashboard className="w-5 h-5" aria-hidden="true" />{" "}
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-yellow-800 dark:hover:text-yellow-400 rounded-lg transition-colors font-medium focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-yellow-800 dark:focus:text-yellow-400"
                    role="menuitem"
                  >
                    <Settings className="w-5 h-5" aria-hidden="true" /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 w-full py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
                    role="menuitem"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" /> Log Out
                  </button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    href="/login"
                    className="block w-full mt-4 text-center bg-gray-200 dark:bg-gray-700 px-6 py-3 text-sm font-medium hover:text-white hover:bg-yellow-600 dark:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block w-full mt-4 px-6 py-3 bg-gray-700 dark:bg-gray-700 text-white dark:text-gray-200 text-center rounded font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
