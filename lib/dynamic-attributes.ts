/**
 * Dynamic Attributes Utility
 * 
 * This module provides functions to fetch dynamic attributes from the database.
 * Falls back to static constants if database fetch fails.
 */

import {
  getActiveLanguages,
  getActiveVoiceStyles,
  getActiveAudioCategories,
} from './supabase-queries'

import {
  LANGUAGE_OPTIONS,
  VOICE_STYLE_OPTIONS,
  AUDIO_CATEGORIES,
} from './constants'

// Cache for attributes (to avoid repeated database calls)
let languagesCache: Array<{ value: string; label: string }> | null = null
let voiceStylesCache: Array<{ value: string; label: string }> | null = null
let audioCategoriesCache: Array<{ value: string; label: string; icon_name?: string; color_class?: string }> | null = null

/**
 * Get languages from database or fallback to static constants
 */
export async function getDynamicLanguages(): Promise<Array<{ value: string; label: string }>> {
  // Return cached data if available
  if (languagesCache) {
    return languagesCache
  }

  try {
    const data = await getActiveLanguages()
    if (data && data.length > 0) {
      languagesCache = data.map(item => ({
        value: item.value,
        label: item.label,
      }))
      return languagesCache
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic languages, using fallback:', error)
  }

  // Fallback to static constants
  return LANGUAGE_OPTIONS
}

/**
 * Get voice styles from database or fallback to static constants
 */
export async function getDynamicVoiceStyles(): Promise<Array<{ value: string; label: string }>> {
  // Return cached data if available
  if (voiceStylesCache) {
    return voiceStylesCache
  }

  try {
    const data = await getActiveVoiceStyles()
    if (data && data.length > 0) {
      voiceStylesCache = data.map(item => ({
        value: item.value,
        label: item.label,
      }))
      return voiceStylesCache
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic voice styles, using fallback:', error)
  }

  // Fallback to static constants
  return VOICE_STYLE_OPTIONS
}

/**
 * Get audio categories from database or fallback to static constants
 */
export async function getDynamicAudioCategories(): Promise<Array<{
  value: string
  label: string
  icon_name?: string
  color_class?: string
}>> {
  // Return cached data if available
  if (audioCategoriesCache) {
    return audioCategoriesCache
  }

  try {
    const data = await getActiveAudioCategories()
    if (data && data.length > 0) {
      audioCategoriesCache = data.map(item => ({
        value: item.value,
        label: item.label,
        icon_name: item.icon_name,
        color_class: item.color_class,
      }))
      return audioCategoriesCache
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic audio categories, using fallback:', error)
  }

  // Fallback to static constants (without icon_name and color_class)
  return AUDIO_CATEGORIES
}

/**
 * Clear all caches (useful when attributes are updated)
 */
export function clearAttributesCache() {
  languagesCache = null
  voiceStylesCache = null
  audioCategoriesCache = null
}

/**
 * Get icon name for a category value
 */
export async function getCategoryIcon(categoryValue: string): Promise<string> {
  const categories = await getDynamicAudioCategories()
  const category = categories.find(cat => cat.value === categoryValue)
  return category?.icon_name || 'Music'
}

/**
 * Get color class for a category value
 */
export async function getCategoryColor(categoryValue: string): Promise<string> {
  const categories = await getDynamicAudioCategories()
  const category = categories.find(cat => cat.value === categoryValue)
  return category?.color_class || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

