import { supabase, VoiceActor, ActorPricing, AudioSample, ContactSubmission, QuoteRequest, VoiceActorWithPricing } from './supabase'

// Voice Actors Queries
export async function getAllVoiceActors(): Promise<VoiceActorWithPricing[]> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching voice actors:', error)
    throw error
  }

  // Sort by numeric value of actor_id to get proper order (1, 2, 3... instead of 1, 10, 11...)
  const sortedData = (data || []).sort((a, b) => {
    const numA = parseInt(a.actor_id)
    const numB = parseInt(b.actor_id)
    return numA - numB
  })

  return sortedData
}

export async function getFeaturedVoiceActors(): Promise<VoiceActorWithPricing[]> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6)

  if (error) {
    console.error('Error fetching featured voice actors:', error)
    throw error
  }

  // Sort by numeric value of actor_id for consistent ordering
  const sortedData = (data || []).sort((a, b) => {
    const numA = parseInt(a.actor_id)
    const numB = parseInt(b.actor_id)
    return numA - numB
  })

  return sortedData
}

export async function getVoiceActorById(actorId: string): Promise<VoiceActorWithPricing | null> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('actor_id', actorId)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching voice actor:', error)
    throw error
  }

  return data
}

export async function getVoiceActorsByTags(tags: string[]): Promise<VoiceActorWithPricing[]> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)
    .overlaps('tags', tags)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching voice actors by tags:', error)
    throw error
  }

  return data || []
}

export async function searchVoiceActors(searchTerm: string): Promise<VoiceActorWithPricing[]> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error searching voice actors:', error)
    throw error
  }

  return data || []
}

// Audio Samples Queries
export async function getAudioSamplesByActorId(actorId: string): Promise<AudioSample[]> {
  const { data: actor } = await supabase
    .from('voice_actors')
    .select('id')
    .eq('actor_id', actorId)
    .single()

  if (!actor) return []

  const { data, error } = await supabase
    .from('audio_samples')
    .select('*')
    .eq('voice_actor_id', actor.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching audio samples:', error)
    throw error
  }

  return data || []
}

// Contact Form Submission
export async function submitContactForm(submission: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        status: 'new'
      }])

    if (error) {
      console.error('Error submitting contact form:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error submitting contact form:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Quote Request Submission
export async function submitQuoteRequest(request: {
  voice_actor_id?: number
  client_name?: string
  client_email?: string
  client_phone?: string
  script_text: string
  word_count: number
  revisions_requested: number
  express_delivery: boolean
  background_music: boolean
  sound_effects: boolean
  estimated_price?: number
  special_requirements?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .insert([{
        ...request,
        status: 'pending'
      }])

    if (error) {
      console.error('Error submitting quote request:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error submitting quote request:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Admin Queries (require service role key)
export async function getContactSubmissions(status?: string): Promise<ContactSubmission[]> {
  let query = supabase
    .from('contact_submissions')
    .select('*')

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact submissions:', error)
    throw error
  }

  return data || []
}

export async function getQuoteRequests(status?: string): Promise<QuoteRequest[]> {
  let query = supabase
    .from('quote_requests')
    .select('*')

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching quote requests:', error)
    throw error
  }

  return data || []
}

// Utility function to convert database records to legacy Talent interface
export function convertToTalent(voiceActor: VoiceActorWithPricing): any {
  const samples = voiceActor.samples?.map(sample => ({
    id: sample.sample_id,
    name: sample.name,
    url: sample.audio_url,
    icon: null // You'll need to map this based on category
  })) || []

  return {
    id: voiceActor.actor_id,
    name: voiceActor.name || `Actor ${voiceActor.actor_id}`,
    image: voiceActor.image_url || `/photos/${voiceActor.actor_id}.jpg`,
    samples,
    gradient: voiceActor.gradient_colors || 'from-orange-500 to-cyan-600',
    languages: voiceActor.languages,
    tags: voiceActor.tags,
    pricing: {
      basePrice: voiceActor.pricing[0]?.base_price || 50,
      pricePerWord: voiceActor.pricing[0]?.price_per_word || 0.1,
      expressDeliveryFee: voiceActor.pricing[0]?.express_delivery_fee || 50,
      backgroundMusicFee: voiceActor.pricing[0]?.background_music_fee || 30,
      soundEffectsFee: voiceActor.pricing[0]?.sound_effects_fee || 40,
      revisionFee: voiceActor.pricing[0]?.revision_fee || 15,
      isFixedPrice: voiceActor.pricing[0]?.is_fixed_price || false,
      fixedPriceAmount: voiceActor.pricing[0]?.fixed_price_amount || undefined,
      minOrder: voiceActor.pricing[0]?.min_order || 25
    }
  }
}

// Admin-specific Voice Actor Queries (includes inactive actors)
export async function getAllVoiceActorsAdmin(): Promise<VoiceActorWithPricing[]> {
  const { data, error } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all voice actors for admin:', error)
    throw error
  }

  // Sort by numeric value of actor_id for consistent ordering
  const sortedData = (data || []).sort((a, b) => {
    const numA = parseInt(a.actor_id)
    const numB = parseInt(b.actor_id)
    return numA - numB
  })

  return sortedData
}

export async function createVoiceActor(actorData: {
  actor_id: string
  name: string
  bio: string
  languages: string[]
  age_range: string
  accent: string
  voice_style: string[]
  photo_url: string
  is_featured: boolean
  is_active: boolean
  base_price_per_word: number
  rush_multiplier: number
  revision_price: number
  background_music_price: number
  sound_effects_price: number
}): Promise<VoiceActor> {
  // First, create the voice actor
  const { data: actorResult, error: actorError } = await supabase
    .from('voice_actors')
    .insert({
      actor_id: actorData.actor_id,
      name: actorData.name,
      bio: actorData.bio,
      languages: actorData.languages,
      image_url: actorData.photo_url || null, // Use image_url instead of photo_url
      tags: actorData.voice_style || [], // Use tags instead of voice_style
      is_featured: actorData.is_featured,
      is_active: actorData.is_active,
      // Note: age_range and accent will be added after schema update
      age_range: actorData.age_range,
      accent: actorData.accent,
      voice_style: actorData.voice_style
    })
    .select()
    .single()

  if (actorError) {
    console.error('Error creating voice actor:', actorError)
    throw actorError
  }

  // Then create the pricing record
  const { error: pricingError } = await supabase
    .from('actor_pricing')
    .insert({
      voice_actor_id: actorResult.id,
      base_price_per_word: actorData.base_price_per_word,
      rush_multiplier: actorData.rush_multiplier,
      revision_price: actorData.revision_price,
      background_music_price: actorData.background_music_price,
      sound_effects_price: actorData.sound_effects_price
    })

  if (pricingError) {
    console.error('Error creating actor pricing:', pricingError)
    // If pricing creation fails, we should delete the actor to maintain consistency
    await supabase.from('voice_actors').delete().eq('id', actorResult.id)
    throw pricingError
  }

  return actorResult
}

export async function updateVoiceActor(
  actorId: number,
  actorData: {
    actor_id: string
    name: string
    bio: string
    languages: string[]
    age_range: string
    accent: string
    voice_style: string[]
    photo_url: string
    is_featured: boolean
    is_active: boolean
    base_price_per_word: number
    rush_multiplier: number
    revision_price: number
    background_music_price: number
    sound_effects_price: number
  }
): Promise<VoiceActor> {
  // Update the voice actor
  const { data: actorResult, error: actorError } = await supabase
    .from('voice_actors')
    .update({
      actor_id: actorData.actor_id,
      name: actorData.name,
      bio: actorData.bio,
      languages: actorData.languages,
      image_url: actorData.photo_url || null, // Use image_url instead of photo_url
      tags: actorData.voice_style || [], // Use tags instead of voice_style  
      is_featured: actorData.is_featured,
      is_active: actorData.is_active,
      // Note: age_range and accent will be added after schema update
      age_range: actorData.age_range,
      accent: actorData.accent,
      voice_style: actorData.voice_style,
      updated_at: new Date().toISOString()
    })
    .eq('id', actorId)
    .select()
    .single()

  if (actorError) {
    console.error('Error updating voice actor:', actorError)
    throw actorError
  }

  // Update or create pricing record
  const { error: pricingError } = await supabase
    .from('actor_pricing')
    .upsert({
      voice_actor_id: actorId,
      base_price_per_word: actorData.base_price_per_word,
      rush_multiplier: actorData.rush_multiplier,
      revision_price: actorData.revision_price,
      background_music_price: actorData.background_music_price,
      sound_effects_price: actorData.sound_effects_price
    })

  if (pricingError) {
    console.error('Error updating actor pricing:', pricingError)
    throw pricingError
  }

  return actorResult
}

export async function deleteVoiceActor(actorId: number): Promise<void> {
  // Delete pricing records first (due to foreign key constraint)
  const { error: pricingError } = await supabase
    .from('actor_pricing')
    .delete()
    .eq('voice_actor_id', actorId)

  if (pricingError) {
    console.error('Error deleting actor pricing:', pricingError)
    throw pricingError
  }

  // Delete audio samples
  const { error: samplesError } = await supabase
    .from('audio_samples')
    .delete()
    .eq('voice_actor_id', actorId)

  if (samplesError) {
    console.error('Error deleting audio samples:', samplesError)
    throw samplesError
  }

  // Finally delete the voice actor
  const { error: actorError } = await supabase
    .from('voice_actors')
    .delete()
    .eq('id', actorId)

  if (actorError) {
    console.error('Error deleting voice actor:', actorError)
    throw actorError
  }
}

// Audio Sample Management Functions
export async function createAudioSample(sample: {
  voice_actor_id: number
  sample_id: string
  name: string
  audio_url: string
  category: string
}): Promise<AudioSample> {
  const { data, error } = await supabase
    .from('audio_samples')
    .insert(sample)
    .select()
    .single()

  if (error) {
    console.error('Error creating audio sample:', error)
    throw error
  }

  return data
}

export async function updateAudioSample(
  sampleId: number,
  updates: Partial<AudioSample>
): Promise<AudioSample> {
  const { data, error } = await supabase
    .from('audio_samples')
    .update(updates)
    .eq('id', sampleId)
    .select()
    .single()

  if (error) {
    console.error('Error updating audio sample:', error)
    throw error
  }

  return data
}

export async function deleteAudioSample(sampleId: number): Promise<void> {
  const { error } = await supabase
    .from('audio_samples')
    .delete()
    .eq('id', sampleId)

  if (error) {
    console.error('Error deleting audio sample:', error)
    throw error
  }
}

export async function getAudioSamplesByActor(actorId: number): Promise<AudioSample[]> {
  const { data, error } = await supabase
    .from('audio_samples')
    .select('*')
    .eq('voice_actor_id', actorId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching audio samples:', error)
    throw error
  }

  return data || []
}
