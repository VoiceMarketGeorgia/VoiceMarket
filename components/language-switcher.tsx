"use client";

import { useLanguage, type Language } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const languages: Array<{
  code: Language;
  name: string;
}> = [
  { code: "ka", name: "ქართული" },
  { code: "en", name: "English" },
];

function GeorgiaFlag() {
  return (
    <svg viewBox="0 0 36 24" className="h-3.5 w-5 rounded-[2px] shadow-sm" aria-hidden="true">
      <rect width="36" height="24" fill="#fff" />
      <path d="M15 0h6v24h-6zM0 9h36v6H0z" fill="#ff0000" />
      <g fill="#ff0000">
        <path d="M7 3h2v6H7zM5 5h6v2H5z" />
        <path d="M27 3h2v6h-2zM25 5h6v2h-6z" />
        <path d="M7 15h2v6H7zM5 17h6v2H5z" />
        <path d="M27 15h2v6h-2zM25 17h6v2h-6z" />
      </g>
    </svg>
  );
}

function UnitedKingdomFlag() {
  return (
    <svg viewBox="0 0 60 36" className="h-3.5 w-5 rounded-[2px] shadow-sm" aria-hidden="true">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#fff" strokeWidth="7" />
      <path d="M0 0l60 36M60 0L0 36" stroke="#c8102e" strokeWidth="3" />
      <path d="M25 0h10v36H25zM0 13h60v10H0z" fill="#fff" />
      <path d="M28 0h4v36h-4zM0 16h60v4H0z" fill="#c8102e" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="flex items-center rounded-xl border border-border/80 bg-background/80 p-1 shadow-sm"
      role="group"
      aria-label="Language / ენა"
    >
      {languages.map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-label={option.name}
            aria-pressed={isActive}
            title={option.name}
            className={cn(
              "flex h-8 w-9 items-center justify-center rounded-lg transition-colors duration-200",
              isActive
                ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.code === "ka" ? <GeorgiaFlag /> : <UnitedKingdomFlag />}
          </button>
        );
      })}
    </div>
  );
}
