import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopProgressBar from "@/components/TopProgressBar";

// Elegant serif font for headings - perfect for restaurant branding
const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  style: ["normal", "italic"],
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
        className={`${playfair.variable} ${inter.variable} ${dancingScript.variable} antialiased bg-dark-bg text-text-main flex flex-col min-h-screen`}
      >
        <Navbar />
        <TopProgressBar />
        <main className="grow pt-16 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
