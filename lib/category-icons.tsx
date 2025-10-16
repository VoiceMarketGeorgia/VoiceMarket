/**
 * Category Icon Mapping Utility
 * 
 * Maps category names to their corresponding Lucide icons.
 * This is used to display icons in voice cards based on audio sample categories.
 */

import {
  Music,
  Megaphone,
  Mic2,
  FileText,
  User,
  GraduationCap,
  Film,
  Newspaper,
  Briefcase,
  Sparkles,
  Phone,
} from 'lucide-react'

// Map icon names (from database) to Lucide icon components
export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Music,
  Megaphone,
  Mic2,
  FileText,
  User,
  GraduationCap,
  Film,
  Newspaper,
  Briefcase,
  Sparkles,
  Phone,
}

/**
 * Get icon component by name
 * Falls back to Music icon if not found
 */
export function getIconComponent(iconName: string | undefined): React.ComponentType<any> {
  if (!iconName) return Music
  return ICON_MAP[iconName] || Music
}

/**
 * Get icon JSX element by name with optional props
 */
export function getIconElement(iconName: string | undefined, props?: any) {
  const IconComponent = getIconComponent(iconName)
  return <IconComponent {...props} />
}

/**
 * Category to icon mapping (for backward compatibility with static data)
 * This provides default icons for categories before dynamic data is loaded
 */
export const CATEGORY_ICON_DEFAULTS: Record<string, string> = {
  'კომერციული': 'Megaphone',
  'გახმოვანება': 'Mic2',
  'დოკუმენტური': 'FileText',
  'პერსონაჟი': 'User',
  'ელექტრონული სწავლება': 'GraduationCap',
  'ანიმაცია': 'Film',
  'ახალი ამბები': 'Newspaper',
  'კორპორატიული': 'Briefcase',
  'სარეკლამო': 'Sparkles',
  'ავტომოპასუხე': 'Phone',
}

/**
 * Get icon name for a category value (with fallback)
 */
export function getCategoryIconName(categoryValue: string | undefined): string {
  if (!categoryValue) return 'Music'
  return CATEGORY_ICON_DEFAULTS[categoryValue] || 'Music'
}

