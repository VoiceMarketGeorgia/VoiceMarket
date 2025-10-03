import { createSupabaseClient, VoiceActor, ActorPricing, AudioSample, ContactSubmission, QuoteRequest, VoiceActorWithPricing } from './supabase'
const supabase = createSupabaseClient()

// Voice Actors Queries
export async function getAllVoiceActors(): Promise<VoiceActorWithPricing[]> {
  // Try the relationship query first
  const { data: dataWithRelation, error: errorWithRelation } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)

  // If relationship query works and has pricing, use it
  if (!errorWithRelation && dataWithRelation) {
    const actorsWithPricing = dataWithRelation.filter(a => a.pricing && a.pricing.length > 0).length
    
    if (actorsWithPricing > 0) {
      const sortedData = dataWithRelation.sort((a, b) => {
        const numA = parseInt(a.actor_id)
        const numB = parseInt(b.actor_id)
        return numA - numB
      })
      return sortedData
    }
  }

  // Fallback: Fetch actors and pricing separately
  // console.log('⚠️ Public pricing: Using manual JOIN fallback...')
  
  const { data: actors, error: actorsError } = await supabase
    .from('voice_actors')
    .select('*')
    .eq('is_active', true)

  if (actorsError) {
    console.error('Error fetching voice actors:', actorsError)
    throw actorsError
  }

  const { data: allPricing, error: pricingError } = await supabase
    .from('actor_pricing')
    .select('*')

  if (pricingError) {
    console.error('Error fetching pricing:', pricingError)
    throw pricingError
  }

  const { data: allSamples, error: samplesError } = await supabase
    .from('audio_samples')
    .select('*')
    .eq('is_active', true)

  if (samplesError) {
    console.error('Error fetching samples:', samplesError)
    throw samplesError
  }

  // Manually join the data
  const actorsWithData = actors?.map(actor => {
    const pricing = allPricing?.filter(p => p.voice_actor_id === actor.id) || []
    const samples = allSamples?.filter(s => s.voice_actor_id === actor.id) || []
    
    return {
      ...actor,
      pricing,
      samples
    }
  }) || []

  // Sort by numeric value of actor_id to get proper order (1, 2, 3... instead of 1, 10, 11...)
  const sortedData = actorsWithData.sort((a, b) => {
    const numA = parseInt(a.actor_id)
    const numB = parseInt(b.actor_id)
    return numA - numB
  })

  return sortedData
}

export async function getFeaturedVoiceActors(): Promise<VoiceActorWithPricing[]> {
  // Try the relationship query first
  const { data: dataWithRelation, error: errorWithRelation } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6)

  // If relationship query works and has pricing, use it
  if (!errorWithRelation && dataWithRelation) {
    const actorsWithPricing = dataWithRelation.filter(a => a.pricing && a.pricing.length > 0).length
    
    if (actorsWithPricing > 0) {
      const sortedData = dataWithRelation.sort((a, b) => {
        const numA = parseInt(a.actor_id)
        const numB = parseInt(b.actor_id)
        return numA - numB
      })
      return sortedData
    }
  }

  // Fallback: Fetch featured actors and pricing separately
  const { data: actors, error: actorsError } = await supabase
    .from('voice_actors')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6)

  if (actorsError) {
    console.error('Error fetching featured voice actors:', actorsError)
    throw actorsError
  }

  const actorIds = actors?.map(a => a.id) || []
  
  const { data: allPricing } = await supabase
    .from('actor_pricing')
    .select('*')
    .in('voice_actor_id', actorIds)

  const { data: allSamples } = await supabase
    .from('audio_samples')
    .select('*')
    .in('voice_actor_id', actorIds)
    .eq('is_active', true)

  // Manually join the data
  const actorsWithData = actors?.map(actor => {
    const pricing = allPricing?.filter(p => p.voice_actor_id === actor.id) || []
    const samples = allSamples?.filter(s => s.voice_actor_id === actor.id) || []
    
    return {
      ...actor,
      pricing,
      samples
    }
  }) || []

  // Sort by numeric value of actor_id for consistent ordering
  const sortedData = actorsWithData.sort((a, b) => {
    const numA = parseInt(a.actor_id)
    const numB = parseInt(b.actor_id)
    return numA - numB
  })

  return sortedData
}

export async function getVoiceActorById(actorId: string): Promise<VoiceActorWithPricing | null> {
  // Try the relationship query first
  const { data: dataWithRelation, error: errorWithRelation } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .eq('actor_id', actorId)
    .eq('is_active', true)
    .single()

  if (errorWithRelation) {
    if (errorWithRelation.code === 'PGRST116') {
      // No rows returned
      return null
    }
  }

  // If relationship query works and has pricing, use it
  if (dataWithRelation && dataWithRelation.pricing && dataWithRelation.pricing.length > 0) {
    return dataWithRelation
  }

  // Fallback: Fetch actor and pricing separately
  const { data: actor, error: actorError } = await supabase
    .from('voice_actors')
    .select('*')
    .eq('actor_id', actorId)
    .eq('is_active', true)
    .single()

  if (actorError) {
    if (actorError.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching voice actor:', actorError)
    throw actorError
  }

  const { data: pricing } = await supabase
    .from('actor_pricing')
    .select('*')
    .eq('voice_actor_id', actor.id)

  const { data: samples } = await supabase
    .from('audio_samples')
    .select('*')
    .eq('voice_actor_id', actor.id)
    .eq('is_active', true)

  return {
    ...actor,
    pricing: pricing || [],
    samples: samples || []
  }
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
    category: sample.category,
    icon: null // You'll need to map this based on category
  })) || []

  const p = voiceActor.pricing && voiceActor.pricing[0] ? voiceActor.pricing[0] as any : {}
  // Map admin-saved fields with safe defaults (no hidden base added)
  const basePrice = p.base_price ?? 0
  const pricePerWord = p.price_per_word ?? p.base_price_per_word ?? 0
  const expressDeliveryFee = p.express_delivery_fee ?? 0
  const backgroundMusicFee = p.background_music_fee ?? p.background_music_price ?? 0
  const soundEffectsFee = p.sound_effects_fee ?? p.sound_effects_price ?? 0
  const revisionFee = p.revision_fee ?? p.revision_price ?? 0
  const isFixedPrice = p.is_fixed_price ?? false
  const fixedPriceAmount = p.fixed_price_amount ?? undefined
  const minOrder = p.min_order ?? 0

  return {
    id: voiceActor.actor_id,
    name: voiceActor.name || `Actor ${voiceActor.actor_id}`,
    image: voiceActor.image_url || `/photos/${voiceActor.actor_id}.jpg`,
    samples,
    gradient: voiceActor.gradient_colors || 'from-orange-500 to-cyan-600',
    languages: voiceActor.languages,
    tags: voiceActor.tags,
    voice_style: voiceActor.voice_style || [], // ADDED: Pass voice_style for filtering
    gender: (voiceActor as any).gender || 'Male', // ADDED: Pass gender for filtering
    pricing: {
      basePrice,
      pricePerWord,
      expressDeliveryFee,
      backgroundMusicFee,
      soundEffectsFee,
      revisionFee,
      isFixedPrice,
      fixedPriceAmount,
      minOrder
    }
  }
}

// Admin-specific Voice Actor Queries (includes inactive actors)
export async function getAllVoiceActorsAdmin(): Promise<VoiceActorWithPricing[]> {
  // console.log('🔍 Fetching voice actors with pricing...')
  
  // Try the relationship query first
  const { data: dataWithRelation, error: errorWithRelation } = await supabase
    .from('voice_actors')
    .select(`
      *,
      pricing:actor_pricing(*),
      samples:audio_samples(*)
    `)
    .order('created_at', { ascending: false })

  // console.log('📊 Relationship query response:', { 
  //   hasError: !!errorWithRelation, 
  //   dataLength: dataWithRelation?.length,
  //   firstActorPricing: dataWithRelation?.[0]?.pricing
  // })

  // If relationship query works, use it
  if (!errorWithRelation && dataWithRelation) {
    const actorsWithPricing = dataWithRelation.filter(a => a.pricing && a.pricing.length > 0).length
    // console.log(`💰 Actors with pricing (relationship): ${actorsWithPricing} out of ${dataWithRelation.length}`)
    
    if (actorsWithPricing > 0) {
      const sortedData = dataWithRelation.sort((a, b) => {
        const numA = parseInt(a.actor_id)
        const numB = parseInt(b.actor_id)
        return numA - numB
      })
      return sortedData
    }
  }

  // Fallback: Fetch actors and pricing separately
  // console.log('⚠️ Relationship query failed or returned no pricing, trying manual JOIN...')
  
  const { data: actors, error: actorsError } = await supabase
    .from('voice_actors')
    .select('*')
    .order('created_at', { ascending: false })

  if (actorsError) {
    console.error('❌ Error fetching voice actors:', actorsError)
    throw actorsError
  }

  const { data: allPricing, error: pricingError } = await supabase
    .from('actor_pricing')
    .select('*')

  if (pricingError) {
    console.error('❌ Error fetching pricing:', pricingError)
    throw pricingError
  }

  const { data: allSamples, error: samplesError } = await supabase
    .from('audio_samples')
    .select('*')

  if (samplesError) {
    console.error('❌ Error fetching samples:', samplesError)
    throw samplesError
  }

  // console.log(`📦 Manual fetch: ${actors?.length} actors, ${allPricing?.length} pricing records, ${allSamples?.length} samples`)

  // Manually join the data
  const actorsWithData = actors?.map(actor => {
    const pricing = allPricing?.filter(p => p.voice_actor_id === actor.id) || []
    const samples = allSamples?.filter(s => s.voice_actor_id === actor.id) || []
    
    return {
      ...actor,
      pricing,
      samples
    }
  }) || []

  // console.log(`💰 Actors with pricing (manual): ${actorsWithData.filter(a => a.pricing.length > 0).length} out of ${actorsWithData.length}`)

  // Sort by numeric value of actor_id for consistent ordering
  const sortedData = actorsWithData.sort((a, b) => {
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
  voice_style: string[]
  gender: string
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
      age_range: actorData.age_range,
      voice_style: actorData.voice_style,
      gender: actorData.gender
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
      // Map admin form fields to pricing table columns
      price_per_word: actorData.base_price_per_word,
      express_delivery_fee: actorData.rush_multiplier,
      revision_fee: actorData.revision_price,
      background_music_fee: actorData.background_music_price,
      sound_effects_fee: actorData.sound_effects_price
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
    voice_style: string[]
    gender: string
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
      age_range: actorData.age_range,
      voice_style: actorData.voice_style,
      gender: actorData.gender,
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
  // First, check if pricing record exists
  const { data: existingPricing, error: checkError } = await supabase
    .from('actor_pricing')
    .select('id')
    .eq('voice_actor_id', actorId)
    .maybeSingle() // Use maybeSingle() instead of single() to avoid error when no rows found

  const pricingData = {
    voice_actor_id: actorId,
    // Map admin form fields to pricing table columns
    price_per_word: actorData.base_price_per_word,
    express_delivery_fee: actorData.rush_multiplier,
    revision_fee: actorData.revision_price,
    background_music_fee: actorData.background_music_price,
    sound_effects_fee: actorData.sound_effects_price,
    updated_at: new Date().toISOString()
  }

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "no rows returned" - that's okay, we'll insert
    console.error('Error checking existing pricing:', checkError)
    throw checkError
  }

  let pricingError
  if (existingPricing && existingPricing.id) {
    // Update existing pricing record
    // console.log('Updating pricing for voice_actor_id:', actorId, 'with data:', pricingData)
    const result = await supabase
      .from('actor_pricing')
      .update(pricingData)
      .eq('voice_actor_id', actorId) // Use voice_actor_id instead of id for safety
      .select()
    pricingError = result.error
    // if (!pricingError) {
    //   console.log('Pricing updated successfully:', result.data)
    // }
  } else {
    // Create new pricing record
    // console.log('Creating new pricing for voice_actor_id:', actorId, 'with data:', pricingData)
    const result = await supabase
      .from('actor_pricing')
      .insert(pricingData)
      .select()
    pricingError = result.error
    // if (!pricingError) {
    //   console.log('Pricing created successfully:', result.data)
    // }
  }

  if (pricingError) {
    console.error('Error updating/creating actor pricing:', pricingError)
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
