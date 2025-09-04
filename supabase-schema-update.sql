-- VoiceMarket.ge Database Schema Updates
-- Run this in your Supabase SQL editor to add missing fields

-- Add missing fields to voice_actors table
ALTER TABLE public.voice_actors ADD COLUMN IF NOT EXISTS age_range VARCHAR(20) DEFAULT '25-35';
ALTER TABLE public.voice_actors ADD COLUMN IF NOT EXISTS accent VARCHAR(100) DEFAULT 'Georgian Standard';
ALTER TABLE public.voice_actors ADD COLUMN IF NOT EXISTS voice_style TEXT[]; -- Array of voice styles
ALTER TABLE public.voice_actors ADD COLUMN IF NOT EXISTS photo_url TEXT; -- For user uploaded photos

-- Add missing fields to actor_pricing table  
ALTER TABLE public.actor_pricing ADD COLUMN IF NOT EXISTS base_price_per_word DECIMAL(6,4) DEFAULT 0.05;
ALTER TABLE public.actor_pricing ADD COLUMN IF NOT EXISTS rush_multiplier DECIMAL(4,2) DEFAULT 1.5;
ALTER TABLE public.actor_pricing ADD COLUMN IF NOT EXISTS revision_price DECIMAL(8,2) DEFAULT 50.00;
ALTER TABLE public.actor_pricing ADD COLUMN IF NOT EXISTS background_music_price DECIMAL(8,2) DEFAULT 25.00;
ALTER TABLE public.actor_pricing ADD COLUMN IF NOT EXISTS sound_effects_price DECIMAL(8,2) DEFAULT 30.00;

-- Update audio_samples table to include category/tag
ALTER TABLE public.audio_samples ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'კომერციული';
ALTER TABLE public.audio_samples ADD COLUMN IF NOT EXISTS audio_url TEXT; -- For user uploaded audio files

-- Create a table for file uploads (images and audio)
CREATE TABLE IF NOT EXISTS public.file_uploads (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image' or 'audio'
    file_size INTEGER,
    mime_type VARCHAR(100),
    related_table VARCHAR(50), -- 'voice_actors' or 'audio_samples'
    related_id INTEGER,
    uploaded_by UUID, -- User who uploaded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on file_uploads
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for file uploads (authenticated users can manage their files)
CREATE POLICY "Users can manage file uploads" ON public.file_uploads
    FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for actor photos (run this in Storage settings)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('actor-photos', 'actor-photos', true);

-- Create storage bucket for audio samples (run this in Storage settings)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audio-samples', 'audio-samples', true);

COMMENT ON TABLE public.file_uploads IS 'Tracks uploaded files for actors photos and audio samples';
COMMENT ON COLUMN public.voice_actors.photo_url IS 'User uploaded photo URL or default photo';
COMMENT ON COLUMN public.audio_samples.audio_url IS 'User uploaded audio file URL';
COMMENT ON COLUMN public.audio_samples.category IS 'Audio category: კომერციული, გახმოვანება, დოკუმენტური, etc.';
