import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "leaflet/dist/leaflet.css";

// Google Font
const inter = Inter({ subsets: ["latin"] });

// Custom Dachi font (using /fonts/ for Next.js to serve from public folder)
const dachiFont = localFont({
  src: "/fonts/Dachi-the-Lynx-46841546889.woff",
  variable: "--font-dachi",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoiceMarket - Find the Perfect Voice Talent",
  description: "Discover and hire professional voice actors for your projects",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${dachiFont.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
