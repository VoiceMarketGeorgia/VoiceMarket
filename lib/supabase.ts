import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component auth client
export const createSupabaseClient = () => createClientComponentClient()

// Database types based on our schema
export interface VoiceActor {
  id: number
  actor_id: string
  name: string | null
  title: string | null
  bio: string | null
  image_url: string | null
  cover_image_url: string | null
  languages: string[]
  tags: string[]
  gradient_colors: string | null
  is_featured: boolean
  is_active: boolean
  turnaround_time: string | null
  rating: number | null
  review_count: number | null
  created_at: string
  updated_at: string
}

export interface ActorPricing {
  id: number
  voice_actor_id: number
  base_price: number
  price_per_word: number
  express_delivery_fee: number
  background_music_fee: number
  sound_effects_fee: number
  revision_fee: number
  is_fixed_price: boolean
  fixed_price_amount: number | null
  min_order: number
  created_at: string
  updated_at: string
}

export interface AudioSample {
  id: number
  voice_actor_id: number
  sample_id: string
  name: string
  category: string | null
  description: string | null
  audio_url: string
  duration_seconds: number | null
  file_size_bytes: number | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  subject: string
  message: string
  ip_address: string | null
  user_agent: string | null
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface QuoteRequest {
  id: number
  voice_actor_id: number | null
  client_name: string | null
  client_email: string | null
  client_phone: string | null
  script_text: string
  word_count: number
  revisions_requested: number
  express_delivery: boolean
  background_music: boolean
  sound_effects: boolean
  estimated_price: number | null
  delivery_date: string | null
  special_requirements: string | null
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

// Combined types for frontend components
export interface VoiceActorWithPricing extends VoiceActor {
  pricing: ActorPricing
  samples: AudioSample[]
}

// Legacy interface compatibility for existing components
export interface Talent {
  id: string
  name: string
  image: string
  samples: Array<{
    id: string
    name: string
    icon: JSX.Element
    url: string
  }>
  gradient: string
  languages: string[]
  tags: string[]
  pricing: {
    basePrice: number
    pricePerWord: number
    expressDeliveryFee: number
    backgroundMusicFee: number
    soundEffectsFee: number
    revisionFee: number
    isFixedPrice: boolean
    fixedPriceAmount?: number
    minOrder: number
  }
}
