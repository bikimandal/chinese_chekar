import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopProgressBar from "@/components/TopProgressBar";

// Premium serif font for headings and elegant text
const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  style: ["normal", "italic"],
});

// Clean, modern sans-serif for body text
const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${cormorant.variable} ${workSans.variable} antialiased bg-dark-bg text-text-main flex flex-col min-h-screen`}
      >
        <Navbar />
        <TopProgressBar />
        <main className="grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
