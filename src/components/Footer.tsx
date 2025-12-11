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
} from "lucide-react";

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

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Chinese Chekar
                </h3>
                <p className="text-xs text-slate-500">Premium Cuisine</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Experience authentic Chinese flavors crafted with passion and
              precision. Where tradition meets modern culinary excellence.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  123 Culinary Street, Food District, Howrah, West Bengal
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="hover:text-amber-400 transition-colors"
                >
                  +91 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a
                  href="mailto:info@chinesechekar.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  info@chinesechekar.com
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              Opening Hours
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-slate-400 space-y-2">
                  <p className="flex justify-between gap-8">
                    <span className="font-medium text-slate-300">
                      Monday - Friday
                    </span>
                    <span>11:00 AM - 10:00 PM</span>
                  </p>
                  <p className="flex justify-between gap-8">
                    <span className="font-medium text-slate-300">
                      Saturday - Sunday
                    </span>
                    <span>11:00 AM - 11:00 PM</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-400">
                    Now Open
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Accepting orders for dine-in and takeaway
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Chinese Chekar. All rights
              reserved. Crafted with passion.
            </p>
            <div className="flex gap-6 text-sm">
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
