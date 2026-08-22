import type { Language } from "@/components/language-provider";

const AUDIO_LABELS: Record<string, { ka: string; en: string }> = {
  "სარეკლამო რგოლი": { ka: "სარეკლამო რგოლი", en: "Commercial" },
  "ავტომოპასუხე": { ka: "ავტომოპასუხე", en: "IVR / phone system" },
  "მხატვრული": { ka: "მხატვრული", en: "Character / artistic" },
  "დოკუმენტური": { ka: "დოკუმენტური", en: "Documentary" },
  commercial: { ka: "სარეკლამო რგოლი", en: "Commercial" },
  documentary: { ka: "დოკუმენტური", en: "Documentary" },
};

export function localizeAudioName(name: string, language: Language) {
  return AUDIO_LABELS[name.trim().toLowerCase()]?.[language] ||
    AUDIO_LABELS[name.trim()]?.[language] ||
    name;
}
