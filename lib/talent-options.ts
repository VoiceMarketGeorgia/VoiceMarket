import type { Language } from "@/components/language-provider";

export interface LocalizedTalentOption {
  value: string;
  ka: string;
  en: string;
}

export const TALENT_LANGUAGE_OPTIONS: LocalizedTalentOption[] = [
  { value: "Georgian", ka: "ქართული", en: "Georgian" },
  { value: "English", ka: "ინგლისური", en: "English" },
  { value: "Russian", ka: "რუსული", en: "Russian" },
  { value: "Armenian", ka: "სომხური", en: "Armenian" },
  { value: "Azerbaijani", ka: "აზერბაიჯანული", en: "Azerbaijani" },
];

export const TALENT_GENDER_OPTIONS: LocalizedTalentOption[] = [
  { value: "Female", ka: "ქალი", en: "Woman" },
  { value: "Male", ka: "კაცი", en: "Man" },
  { value: "Child", ka: "ბავშვი", en: "Child" },
];

export function localizeTalentOptions(
  options: LocalizedTalentOption[],
  language: Language
) {
  return options.map((option) => ({
    value: option.value,
    label: option[language],
  }));
}

export function getTalentOptionLabel(
  options: LocalizedTalentOption[],
  value: string,
  language: Language
) {
  return options.find((option) => option.value === value)?.[language] || value;
}
