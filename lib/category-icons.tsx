import type { ComponentType, SVGProps } from "react";
import {
  Briefcase,
  FileText,
  Film,
  GraduationCap,
  Megaphone,
  Mic2,
  Music,
  Newspaper,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

type CategoryIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface AudioCategoryPresentation {
  icon_name?: string | null;
  color_class?: string | null;
}

export const CATEGORY_ICON_OPTIONS: Array<{
  value: string;
  label: string;
  icon: CategoryIcon;
}> = [
  { value: "Music", label: "მუსიკა", icon: Music },
  { value: "Megaphone", label: "მეგაფონი", icon: Megaphone },
  { value: "Mic2", label: "მიკროფონი", icon: Mic2 },
  { value: "FileText", label: "დოკუმენტი", icon: FileText },
  { value: "User", label: "მომხმარებელი", icon: User },
  { value: "GraduationCap", label: "განათლება", icon: GraduationCap },
  { value: "Film", label: "ფილმი", icon: Film },
  { value: "Newspaper", label: "გაზეთი", icon: Newspaper },
  { value: "Briefcase", label: "ბიზნესი", icon: Briefcase },
  { value: "Sparkles", label: "ბრწყინვალება", icon: Sparkles },
  { value: "Phone", label: "ტელეფონი", icon: Phone },
];

const ICON_MAP = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map(({ value, icon }) => [value, icon])
) as Record<string, CategoryIcon>;

export const CATEGORY_ICON_DEFAULTS: Record<string, string> = {
  კომერციული: "Megaphone",
  გახმოვანება: "Mic2",
  დოკუმენტური: "FileText",
  პერსონაჟი: "User",
  "ელექტრონული სწავლება": "GraduationCap",
  ანიმაცია: "Film",
  "ახალი ამბები": "Newspaper",
  კორპორატიული: "Briefcase",
  სარეკლამო: "Sparkles",
  ავტომოპასუხე: "Phone",
};

export function getCategoryIconName(
  category: string | null | undefined,
  configuredIcon?: string | null
) {
  return configuredIcon || (category ? CATEGORY_ICON_DEFAULTS[category] : undefined) || "Music";
}

export function getIconComponent(iconName: string | null | undefined): CategoryIcon {
  return (iconName && ICON_MAP[iconName]) || Music;
}

export function getIconElement(
  iconName: string | null | undefined,
  props?: SVGProps<SVGSVGElement>
) {
  const Icon = getIconComponent(iconName);
  return <Icon {...props} />;
}

export function buildAudioCategoryMap(
  categories: Array<{
    value: string;
    icon_name?: string | null;
    color_class?: string | null;
  }>
) {
  return new Map<string, AudioCategoryPresentation>(
    categories.map((category) => [
      category.value,
      {
        icon_name: getCategoryIconName(category.value, category.icon_name),
        color_class: category.color_class,
      },
    ])
  );
}
