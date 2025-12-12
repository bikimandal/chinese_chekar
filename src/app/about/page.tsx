"use client";

import { motion } from "framer-motion";
import {
  ChefHat,
  Heart,
  Award,
  Users,
  MapPin,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Leaf,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { footerConfig } from "@/config/footer";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: UtensilsCrossed,
      title: "Authentic Recipes",
      description:
        "Traditional Chinese recipes passed down through generations, prepared with authentic techniques and ingredients.",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      description:
        "We source the finest, freshest ingredients daily to ensure every dish meets our high standards of quality.",
      color: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: Flame,
      title: "Passion for Excellence",
      description:
        "Every dish is crafted with passion, attention to detail, and a commitment to delivering an exceptional dining experience.",
      color: "from-red-500/20 to-orange-500/20",
      iconColor: "text-red-400",
    },
    {
      icon: Award,
      title: "Award-Winning Cuisine",
      description:
        "Recognized for our culinary excellence and dedication to preserving authentic Chinese flavors while embracing innovation.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description:
        "We never compromise on quality. Every ingredient is carefully selected, and every dish is prepared with meticulous attention to detail.",
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      description:
        "Your satisfaction is our priority. We strive to create memorable dining experiences that keep you coming back for more.",
    },
    {
      icon: ChefHat,
      title: "Culinary Heritage",
      description:
        "We honor traditional Chinese cooking methods while continuously innovating to bring you the best of both worlds.",
    },
    {
      icon: Sparkles,
      title: "Excellence",
      description:
        "Excellence is not an act, but a habit. We maintain the highest standards in everything we do, from kitchen to table.",
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
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border-b border-amber-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full mb-6 sm:mb-8"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-200 font-medium tracking-wider">
                OUR STORY
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span className="block text-white mb-2">About</span>
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                Chinese Chekar
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
            >
              Where authentic Chinese flavors meet modern culinary excellence.
              Experience the art of traditional cooking with a contemporary
              touch.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 md:p-12 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent mb-4">
                    Our Story
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6"></div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                <p>
                  Founded with a passion for authentic Chinese cuisine,{" "}
                  <span className="text-amber-400 font-semibold">
                    Chinese Chekar
                  </span>{" "}
                  brings the rich flavors and traditions of China to the heart
                  of Bidhannagar. Our journey began with a simple vision: to
                  create a dining experience that honors traditional Chinese
                  cooking while embracing modern culinary innovation.
                </p>
                <p>
                  Our master chefs, trained in authentic Chinese cooking
                  techniques, prepare each dish with precision and care. We
                  believe that great food starts with great ingredients, which
                  is why we source only the finest, freshest produce and spices,
                  ensuring every meal is a celebration of flavor and quality.
                </p>
                <p>
                  At Chinese Chekar, we don't just serve food—we create
                  memories. Every dish tells a story, every flavor carries
                  tradition, and every meal is an opportunity to experience the
                  rich culinary heritage of China.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Our </span>
              <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Mission & Values
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Why Choose </span>
              <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              What sets us apart in the culinary world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto`}
                >
                  <feature.icon
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.iconColor}`}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
                <span className="text-white">Visit </span>
                <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Us
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        Location
                      </h3>
                      <p className="text-slate-400 text-sm sm:text-base">
                        {footerConfig.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        Opening Hours
                      </h3>
                      <div className="space-y-1 text-slate-400 text-sm sm:text-base">
                        {footerConfig.workingHours.map((schedule, index) => (
                          <p key={index}>
                            <span className="font-medium text-slate-300">
                              {schedule.day}:
                            </span>{" "}
                            {schedule.hours}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
                  <iframe
                    src={footerConfig.maps.embedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-amber-600/10 via-orange-600/10 to-red-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-amber-500/30 p-8 sm:p-12 md:p-16 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-white">Ready to Experience </span>
                <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Authentic Flavors?
                </span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
                Visit us today or explore our live inventory to see what's
                available. We can't wait to serve you!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/inventory"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 flex items-center gap-2 font-semibold text-sm sm:text-base"
                >
                  <span>View Live Menu</span>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-amber-500/50 text-white rounded-full transition-all duration-300 hover:bg-slate-800/70 font-semibold text-sm sm:text-base"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
