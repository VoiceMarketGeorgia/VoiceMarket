-- VoiceMarket.ge Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create voice_actors table
CREATE TABLE public.voice_actors (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(10) UNIQUE NOT NULL, -- "1", "2", etc.
    name VARCHAR(255),
    title VARCHAR(255) DEFAULT 'Professional Voice Actor',
    bio TEXT,
    image_url TEXT,
    cover_image_url TEXT,
    languages TEXT[], -- Array of languages: ['Georgian', 'English']
    tags TEXT[], -- Array of tags: ['კომერციული', 'გახმოვანება', etc.]
    gradient_colors VARCHAR(100) DEFAULT 'from-orange-500 to-cyan-600',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    turnaround_time VARCHAR(50) DEFAULT '24-48 hours',
    rating DECIMAL(3,2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create actor_pricing table
CREATE TABLE public.actor_pricing (
    id SERIAL PRIMARY KEY,
    voice_actor_id INTEGER REFERENCES public.voice_actors(id) ON DELETE CASCADE,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    price_per_word DECIMAL(6,4) NOT NULL DEFAULT 0.10,
    express_delivery_fee DECIMAL(8,2) NOT NULL DEFAULT 50.00,
    background_music_fee DECIMAL(8,2) NOT NULL DEFAULT 30.00,
    sound_effects_fee DECIMAL(8,2) NOT NULL DEFAULT 40.00,
    revision_fee DECIMAL(8,2) NOT NULL DEFAULT 15.00,
    is_fixed_price BOOLEAN DEFAULT false,
    fixed_price_amount DECIMAL(10,2),
    min_order DECIMAL(8,2) NOT NULL DEFAULT 25.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create audio_samples table
CREATE TABLE public.audio_samples (
    id SERIAL PRIMARY KEY,
    voice_actor_id INTEGER REFERENCES public.voice_actors(id) ON DELETE CASCADE,
    sample_id VARCHAR(20) NOT NULL, -- "1-1", "1-2", etc.
    name VARCHAR(255) NOT NULL, -- "სარეკლამო რგოლი", "ავტომოპასუხე", etc.
    category VARCHAR(100),
    description TEXT,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER,
    file_size_bytes INTEGER,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL, -- 'general', 'support', 'billing', 'partnership', 'talent'
    message TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'responded', 'closed'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quote_requests table
CREATE TABLE public.quote_requests (
    id SERIAL PRIMARY KEY,
    voice_actor_id INTEGER REFERENCES public.voice_actors(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    script_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    revisions_requested INTEGER DEFAULT 2,
    express_delivery BOOLEAN DEFAULT false,
    background_music BOOLEAN DEFAULT false,
    sound_effects BOOLEAN DEFAULT false,
    estimated_price DECIMAL(10,2),
    delivery_date DATE,
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'quoted', 'accepted', 'completed', 'cancelled'
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_voice_actors_actor_id ON public.voice_actors(actor_id);
CREATE INDEX idx_voice_actors_featured ON public.voice_actors(is_featured) WHERE is_featured = true;
CREATE INDEX idx_voice_actors_active ON public.voice_actors(is_active) WHERE is_active = true;
CREATE INDEX idx_voice_actors_tags ON public.voice_actors USING GIN(tags);
CREATE INDEX idx_audio_samples_voice_actor ON public.audio_samples(voice_actor_id);
CREATE INDEX idx_audio_samples_active ON public.audio_samples(is_active) WHERE is_active = true;
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_quote_requests_voice_actor ON public.quote_requests(voice_actor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.voice_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actor_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Voice actors are viewable by everyone" ON public.voice_actors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Actor pricing is viewable by everyone" ON public.actor_pricing
    FOR SELECT USING (true);

CREATE POLICY "Audio samples are viewable by everyone" ON public.audio_samples
    FOR SELECT USING (is_active = true);

-- Contact submissions - only allow inserts from authenticated or anonymous users
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Quote requests - only allow inserts from authenticated or anonymous users
CREATE POLICY "Anyone can submit quote requests" ON public.quote_requests
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_voice_actors_updated_at
    BEFORE UPDATE ON public.voice_actors
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_actor_pricing_updated_at
    BEFORE UPDATE ON public.actor_pricing
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_audio_samples_updated_at
    BEFORE UPDATE ON public.audio_samples
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_quote_requests_updated_at
    BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
