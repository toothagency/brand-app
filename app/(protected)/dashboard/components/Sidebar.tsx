"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  BarChart3,
  Settings,
  User,
  LogOut,
  Plus,
  Home,
  FileText,
  TrendingUp,
  Bell,
  HelpCircle,
  Users,
  X,
} from "lucide-react";
import { useClientAuth } from "../../../(auth)/hooks/useClientAuth";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import Image from "next/image";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useClientAuth();

  const navigationItems = [
    {
      name: "Overview",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "My Brands",
      href: "/dashboard/brands",
      icon: Palette,
    },
    {
      name: "Referrals",
      href: "/dashboard/referrals",
      icon: Users,
    },
    // {
    //   name: "Analytics",
    //   href: "/dashboard/analytics",
    //   icon: BarChart3,
    // },
    // {
    //   name: "Documents",
    //   href: "/dashboard/documents",
    //   icon: FileText,
    // },
    // {
    //   name: "Marketing",
    //   href: "/dashboard/marketing",
    //   icon: TrendingUp,
    // },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 mb-10 py-6 px-2 border-b border-gray-200 dark:border-gray-700">
          <Link
              href="/dashboard"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            ><X className="w-5 h-5" />
            </Button>
          </div>

         

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                 
                </Link>
              );
            })}
          </nav>

         

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Link
                href="/dashboard/notifications"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
