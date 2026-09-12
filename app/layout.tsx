import type React from "react";
import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteShell } from "@/components/site-shell";

// Latin text: Noto Sans Georgian's Latin, self-hosted by Next at build time.
const siteFont = Noto_Sans_Georgian({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// Georgian text: the same typeface, modified so ordinary Georgian letters are
// drawn with their tall Mtavruli forms. Every Georgian string on the site -
// including database content and typed input - renders in capitals, while
// the underlying text stays normal for search, copy-paste and screen readers.
//
// Built from Noto Sans Georgian (SIL Open Font License 1.1) by pointing the
// Mkhedruli code points U+10D0-10FA and U+10FD-10FF at the Mtavruli glyphs;
// renamed as the licence requires for modified versions. CSS
// text-transform cannot do this: in Chrome, uppercase turns Mtavruli back
// into lower case.
const georgianCaps = localFont({
  src: "./fonts/voicemarket-georgian-caps.woff2",
  variable: "--font-georgian",
  weight: "100 900",
  display: "swap",
  // No generated fallback: next/font would add an Arial-based face with no
  // unicode-range, which then catches Latin before --font-sans can.
  adjustFontFallback: false,
  fallback: [],
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0589, U+10A0-10FF, U+1C90-1CBA, U+1CBD-1CBF, U+205A, U+2D00-2D2F, U+2E31",
    },
  ],
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
      <body className={`${georgianCaps.variable} ${siteFont.variable} font-sans`}>
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
