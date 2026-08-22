import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteShell } from "@/components/site-shell";

const dachiFont = localFont({
  src: "./fonts/Dachi-the-Lynx-46841546889.woff",
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
    <html lang="ka" suppressHydrationWarning>
      <body className={dachiFont.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SiteShell>{children}</SiteShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
