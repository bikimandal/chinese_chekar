"use client";

import { motion } from "framer-motion";
import { Scale, FileCheck, AlertTriangle, Gavel } from "lucide-react";
import { footerConfig } from "@/config/footer";

export default function TermsPage() {
  const sections = [
    {
      icon: FileCheck,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.",
      ],
    },
    {
      icon: Scale,
      title: "Use License",
      content: [
        "Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials, use the materials for any commercial purpose, or attempt to decompile or reverse engineer any software contained on the website.",
        "This license shall automatically terminate if you violate any of these restrictions.",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer",
      content: [
        "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.",
        "We do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our website or otherwise relating to such materials.",
        "We are not responsible for any errors or omissions in the content of this website.",
      ],
    },
    {
      icon: Gavel,
      title: "Limitations",
      content: [
        "In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.",
        "We reserve the right to refuse service to anyone for any reason at any time.",
        "You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express written permission from us.",
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
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="block text-white mb-2">Terms of</span>
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                Service
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
                Welcome to <span className="text-amber-400 font-semibold">{footerConfig.brand.name}</span>. These Terms of Service ("Terms") govern your access to and use of our website and services. Please read these Terms carefully before using our services.
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
                Questions About Our Terms?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
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

