"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChefHat,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import { footerConfig } from "@/config/footer";

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
};

interface StoreStatus {
  id: string;
  isOpen: boolean;
  message?: string;
  updatedAt: string;
}

function StoreStatusIndicator() {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/store-status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        // Default to open if API fails
        setStatus({
          id: "default",
          isOpen: true,
          message: "We are currently closed. Please check back later!",
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      // Default to open if fetch fails
      setStatus({
        id: "default",
        isOpen: true,
        message: "We are currently closed. Please check back later!",
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return (
      <div className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full animate-pulse ${
            status.isOpen ? "bg-emerald-400" : "bg-gray-400"
          }`}
        ></div>
        <span
          className={`text-sm font-semibold ${
            status.isOpen ? "text-emerald-400" : "text-gray-400"
          }`}
        >
          {status.isOpen ? "Now Open" : "Currently Closed"}
        </span>
      </div>
      <p className="text-xs text-slate-400">
        {status.isOpen
          ? "Accepting orders for dine-in and takeaway"
          : status.message ||
            "We are currently closed. Please check back later!"}
      </p>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-auto overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-wide"
                  style={{ fontFamily: 'var(--font-branding), cursive' }}
                >
                  {footerConfig.brand.name}
                </h3>
                <p className="text-xs text-slate-500">{footerConfig.brand.tagline}</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {footerConfig.brand.description}
            </p>
            <div className="flex gap-3">
              {footerConfig.socialLinks.map((social) => {
                const IconComponent = iconMap[social.icon];
                if (!IconComponent) return null;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-lg font-semibold mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
            >
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerConfig.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
            >
              <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-slate-400">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{footerConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <a
                  href={`tel:${footerConfig.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  {footerConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                <a
                  href={`mailto:${footerConfig.contact.email}`}
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  {footerConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3
              className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
            >
              <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Opening Hours
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm sm:text-base text-slate-400 space-y-2 flex-1">
                  {footerConfig.workingHours.map((schedule, index) => (
                    <p
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:gap-4"
                    >
                      <span className="font-medium text-slate-300">
                        {schedule.day}
                      </span>
                      <span>{schedule.hours}</span>
                    </p>
                  ))}
                </div>
              </div>
              <StoreStatusIndicator />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 pt-6 sm:pt-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <p className="text-slate-500 text-xs sm:text-sm text-center">
              {footerConfig.footerText}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm text-center">
              {footerConfig.madeWith.text} in {footerConfig.madeWith.location}{" "}
              <span className="text-red-400">❤️</span>
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-slate-500 hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-500 hover:text-amber-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
