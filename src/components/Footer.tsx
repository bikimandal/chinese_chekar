"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
      <motion.div
        className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="w-2 h-2 bg-slate-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-semibold text-slate-400">
            Loading...
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, borderColor: "rgba(245, 158, 11, 0.5)" }}
    >
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${
            status.isOpen ? "bg-emerald-400" : "bg-gray-400"
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.span
          className={`text-sm font-semibold ${
            status.isOpen ? "text-emerald-400" : "text-gray-400"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {status.isOpen ? "Now Open" : "Currently Closed"}
        </motion.span>
      </motion.div>
      <motion.p
        className="text-xs text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {status.isOpen
          ? "Accepting orders for dine-in and takeaway"
          : status.message ||
            "We are currently closed. Please check back later!"}
      </motion.p>
    </motion.div>
  );
}

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-auto overflow-hidden">
      {/* Decorative top border */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
        >
          {/* Brand Section */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={sectionVariants}
          >
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div>
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-wide"
                  style={{ fontFamily: 'var(--font-branding), cursive' }}
                >
                  {footerConfig.brand.name}
                </h3>
                <p className="text-xs text-slate-500">{footerConfig.brand.tagline}</p>
              </div>
            </motion.div>
            <motion.p
              className="text-sm sm:text-base text-slate-400 leading-relaxed"
              variants={itemVariants}
            >
              {footerConfig.brand.description}
            </motion.p>
            <motion.div
              className="flex gap-3"
              variants={itemVariants}
            >
              {footerConfig.socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.icon];
                if (!IconComponent) return null;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 hover:bg-amber-600 border border-slate-700 hover:border-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={sectionVariants}>
            <motion.h3
              className="text-lg font-semibold mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              Quick Links
            </motion.h3>
            <ul className="space-y-3">
              {footerConfig.quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <motion.span
                      className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div id="contact" variants={sectionVariants}>
            <motion.h3
              className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              Contact Us
            </motion.h3>
            <ul className="space-y-3 sm:space-y-4">
              <motion.li
                className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-slate-400"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                </motion.div>
                <span>{footerConfig.contact.address}</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                </motion.div>
                <a
                  href={`tel:${footerConfig.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  {footerConfig.contact.phone}
                </a>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-400"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                </motion.div>
                <a
                  href={`mailto:${footerConfig.contact.email}`}
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  {footerConfig.contact.email}
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Operating Hours */}
          <motion.div variants={sectionVariants}>
            <motion.h3
              className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white flex items-center gap-2 font-sans"
              style={{ fontFamily: 'var(--font-body), sans-serif' }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              Opening Hours
            </motion.h3>
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                className="flex items-start gap-2 sm:gap-3"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                </motion.div>
                <div className="text-sm sm:text-base text-slate-400 space-y-2 flex-1">
                  {footerConfig.workingHours.map((schedule, index) => (
                    <motion.p
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: "-50px" }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium text-slate-300">
                        {schedule.day}
                      </span>
                      <span>{schedule.hours}</span>
                    </motion.p>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StoreStatusIndicator />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-slate-800/50 pt-6 sm:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-50px" }}
          >
            <motion.p
              className="text-slate-500 text-xs sm:text-sm text-center"
              variants={itemVariants}
            >
              {footerConfig.footerText}
            </motion.p>
            <motion.p
              className="text-slate-400 text-xs sm:text-sm text-center"
              variants={itemVariants}
            >
              {footerConfig.madeWith.text} in {footerConfig.madeWith.location}{" "}
              <motion.span
                className="text-red-400 inline-block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ❤️
              </motion.span>
            </motion.p>
            <motion.div
              className="flex gap-4 sm:gap-6 text-xs sm:text-sm"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/privacy"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/terms"
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
