import type { Metadata } from "next";
import { Cormorant, Inter, Dancing_Script, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopProgressBar from "@/components/TopProgressBar";

// Elegant serif font for headings - refined and professional
const cormorant = Cormorant({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

// Ultra-elegant font for hero section - unique and sophisticated
const cinzel = Cinzel({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Clean, modern sans-serif for body text - excellent readability
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Cursive handwriting font for navbar branding
const dancingScript = Dancing_Script({
  variable: "--font-branding",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chinese Chekar | Premium Asian Cuisine & Live Inventory",
  description: "Experience authentic Chinese cuisine. Check our live inventory for daily specials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} ${dancingScript.variable} ${cinzel.variable} antialiased bg-dark-bg text-text-main flex flex-col min-h-screen`}
      >
        <Navbar />
        <TopProgressBar />
        <main className="grow pt-16 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
