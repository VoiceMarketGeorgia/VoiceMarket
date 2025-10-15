// Centralized constants for the application

// Language options with Georgian translations
export const LANGUAGE_OPTIONS = [
  { value: 'Georgian', label: 'ქართული' },
  { value: 'English', label: 'ინგლისური' },
  { value: 'Russian', label: 'რუსული' },
  { value: 'Armenian', label: 'სომხური' },
  { value: 'Azerbaijani', label: 'აზერბაიჯანული' },
]

// Age range options
export const AGE_RANGE_OPTIONS = ['18-25', '25-35', '35-45', '45-55', '55+']

// Accent options with Georgian translations
export const ACCENT_OPTIONS = [
  { value: 'Georgian Standard', label: 'ქართული სტანდარტული' },
  { value: 'Tbilisi', label: 'თბილისური' },
  { value: 'Western Georgian', label: 'დასავლეთ ქართული' },
  { value: 'Eastern Georgian', label: 'აღმოსავლეთ ქართული' },
  { value: 'English (American)', label: 'ინგლისური (ამერიკული)' },
  { value: 'English (British)', label: 'ინგლისური (ბრიტანული)' },
  { value: 'Russian', label: 'რუსული' },
]

// Voice style options with Georgian translations
export const VOICE_STYLE_OPTIONS = [
  { value: 'Conversational', label: 'სასაუბრო' },
  { value: 'Professional', label: 'პროფესიონალური' },
  { value: 'Warm', label: 'თბილი' },
  { value: 'Energetic', label: 'ენერგიული' },
  { value: 'Dramatic', label: 'დრამატული' },
  { value: 'Calm', label: 'მშვიდი' },
  { value: 'Authoritative', label: 'ავტორიტეტული' },
  { value: 'Friendly', label: 'მეგობრული' },
  { value: 'Serious', label: 'სერიოზული' },
  { value: 'Playful', label: 'მხიარული' },
]

// Audio categories / Tags - CENTRALIZED (used everywhere for consistency)
export const AUDIO_CATEGORIES = [
  { value: 'კომერციული', label: 'კომერციული' },
  { value: 'გახმოვანება', label: 'გახმოვანება' },
  { value: 'დოკუმენტური', label: 'დოკუმენტური' },
  { value: 'პერსონაჟი', label: 'პერსონაჟი' },
  { value: 'ელექტრონული სწავლება', label: 'ელექტრონული სწავლება' },
  { value: 'ანიმაცია', label: 'ანიმაცია' },
  { value: 'ახალი ამბები', label: 'ახალი ამბები' },
  { value: 'კორპორატიული', label: 'კორპორატიული' },
  { value: 'სარეკლამო', label: 'სარეკლამო' },
  { value: 'ავტომოპასუხე', label: 'ავტომოპასუხე' },
]

// Available tags for filtering (same as audio categories)
export const AVAILABLE_TAGS = AUDIO_CATEGORIES.map(cat => cat.value)

// Gender options with Georgian translations
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'კაცი' },
  { value: 'Female', label: 'ქალი' },
  { value: 'Child', label: 'ბავშვი' },
]

// Helper function to get Georgian label for a value
export function getGeorgianLabel(value: string, type?: 'language' | 'accent' | 'voiceStyle' | 'gender' | 'audioCategory'): string {
  if (!type) {
    // Try all types to find a match
    const allOptions = [
      ...LANGUAGE_OPTIONS,
      ...ACCENT_OPTIONS,
      ...VOICE_STYLE_OPTIONS,
      ...GENDER_OPTIONS,
      ...AUDIO_CATEGORIES,
    ]
    const found = allOptions.find(opt => opt.value === value)
    return found?.label || value
  }
  
  let options: Array<{ value: string; label: string }> = []
  
  switch (type) {
    case 'language':
      options = LANGUAGE_OPTIONS
      break
    case 'accent':
      options = ACCENT_OPTIONS
      break
    case 'voiceStyle':
      options = VOICE_STYLE_OPTIONS
      break
    case 'gender':
      options = GENDER_OPTIONS
      break
    case 'audioCategory':
      options = AUDIO_CATEGORIES
      break
  }
  
  const found = options.find(opt => opt.value === value)
  return found?.label || value
}

// Helper function to translate time/hours to Georgian
export function translateToGeorgian(text: string): string {
  return text
    .replace(/24 hours?/gi, '24 საათში')
    .replace(/48 hours?/gi, '48 საათში')
    .replace(/24-48 hours?/gi, '24-48 საათში')
}

