"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { footerConfig } from "@/config/footer";

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "We collect information that you provide directly to us, such as when you create an account, make a reservation, or contact us.",
        "We automatically collect certain information about your device when you visit our website, including your IP address, browser type, and usage patterns.",
        "We may use cookies and similar tracking technologies to enhance your experience on our website.",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide, maintain, and improve our services.",
        "To process your orders and reservations.",
        "To communicate with you about our services, promotions, and updates.",
        "To personalize your experience and deliver relevant content.",
        "To detect, prevent, and address technical issues and security threats.",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "We use industry-standard encryption technologies to safeguard sensitive data.",
        "However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information at any time.",
        "You can opt-out of receiving promotional communications from us.",
        "You may request a copy of your personal data in a structured, machine-readable format.",
        "If you have any concerns about how we handle your data, please contact us.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border-b border-amber-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl mb-6">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="block text-white mb-2">Privacy</span>
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
              Last updated: {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 md:p-12 shadow-2xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                At <span className="text-amber-400 font-semibold">{footerConfig.brand.name}</span>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </motion.div>

            <div className="space-y-6 sm:space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 shadow-2xl hover:border-amber-500/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-3 ml-16">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-slate-400 text-sm sm:text-base leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-amber-400 mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Section */}
            <motion.div
              className="mt-8 sm:mt-12 bg-gradient-to-br from-amber-600/10 via-orange-600/10 to-red-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-amber-500/30 p-6 sm:p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4">
                If you have any questions or concerns about this Privacy Policy,
                please contact us at:
              </p>
              <a
                href={`mailto:${footerConfig.contact.email}`}
                className="text-amber-400 hover:text-amber-300 transition-colors text-sm sm:text-base font-semibold"
              >
                {footerConfig.contact.email}
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

