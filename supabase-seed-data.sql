-- VoiceMarket.ge Seed Data
-- Run this after creating the schema to populate with sample data

-- Insert voice actors (based on your 47 actors)
INSERT INTO public.voice_actors (actor_id, name, bio, image_url, cover_image_url, languages, tags, is_featured, rating, review_count) VALUES
('1', 'Actor 1', 'Professional voice actor with extensive experience in various voice-over projects. Specializes in კომერციული, გახმოვანება work with a distinctive and engaging voice style.', '/photos/1.jpg', '/photos/1.jpg', ARRAY['Georgian'], ARRAY['კომერციული', 'გახმოვანება'], true, 4.8, 124),
('2', 'Actor 2', 'Professional voice actor with extensive experience in various voice-over projects. Specializes in კომერციული, გახმოვანება work with a distinctive and engaging voice style.', '/photos/2.jpg', '/photos/2.jpg', ARRAY['Georgian'], ARRAY['კომერციული', 'გახმოვანება'], false, 4.7, 89),
('3', 'Actor 3', 'Professional voice actor with extensive experience in various voice-over projects. Specializes in კომერციული, გახმოვანება, დოკუმენტური work with a distinctive and engaging voice style.', '/photos/3.jpg', '/photos/3.jpg', ARRAY['Georgian', 'English'], ARRAY['კომერციული', 'გახმოვანება', 'დოკუმენტური'], true, 4.9, 156),
('4', 'Actor 4', 'Professional voice actor with extensive experience in various voice-over projects. Specializes in კომერციული, გახმოვანება, პერსონაჟი work with a distinctive and engaging voice style.', '/photos/4.jpg', '/photos/4.jpg', ARRAY['Georgian'], ARRAY['კომერციული', 'გახმოვანება', 'პერსონაჟი'], false, 4.6, 78),
('5', 'Actor 5', 'Professional voice actor with extensive experience in various voice-over projects. Specializes in კომერციული, გახმოვანება, დოკუმენტური work with a distinctive and engaging voice style.', '/photos/5.jpg', '/photos/5.jpg', ARRAY['Georgian'], ARRAY['კომერციული', 'გახმოვანება', 'დოკუმენტური'], false, 4.7, 92);

-- Generate all 47 actors
DO $$
DECLARE
    i INTEGER;
    actor_tags TEXT[];
BEGIN
    FOR i IN 6..47 LOOP
        -- Generate tags based on the same logic as your component
        actor_tags := ARRAY['კომერციული', 'გახმოვანება']; -- Default tags
        
        IF i % 4 = 0 THEN actor_tags := actor_tags || ARRAY['კომერციული']; END IF;
        IF i % 3 = 0 THEN actor_tags := actor_tags || ARRAY['გახმოვანება']; END IF;
        IF i % 5 = 0 THEN actor_tags := actor_tags || ARRAY['დოკუმენტური']; END IF;
        IF i % 7 = 0 THEN actor_tags := actor_tags || ARRAY['პერსონაჟი']; END IF;
        IF i % 6 = 0 THEN actor_tags := actor_tags || ARRAY['ელექტრონული სწავლება']; END IF;
        IF i % 8 = 0 THEN actor_tags := actor_tags || ARRAY['ანიმაცია']; END IF;
        IF i % 9 = 0 THEN actor_tags := actor_tags || ARRAY['ახალი ამბები']; END IF;
        IF i % 10 = 0 THEN actor_tags := actor_tags || ARRAY['კორპორატიული']; END IF;
        
        INSERT INTO public.voice_actors (
            actor_id, 
            name, 
            bio, 
            image_url, 
            cover_image_url, 
            languages, 
            tags, 
            is_featured,
            rating,
            review_count
        ) VALUES (
            i::TEXT,
            'Actor ' || i::TEXT,
            'Professional voice actor with extensive experience in various voice-over projects. Specializes in ' || array_to_string(actor_tags, ', ') || ' work with a distinctive and engaging voice style.',
            '/photos/' || i::TEXT || '.jpg',
            '/photos/' || i::TEXT || '.jpg',
            CASE WHEN i % 3 = 0 THEN ARRAY['Georgian', 'English'] ELSE ARRAY['Georgian'] END,
            actor_tags,
            CASE WHEN i <= 10 THEN true ELSE false END, -- First 10 are featured
            4.5 + (random() * 0.5), -- Rating between 4.5-5.0
            50 + floor(random() * 150)::INTEGER -- Review count between 50-200
        );
    END LOOP;
END $$;

-- Insert pricing for all actors
INSERT INTO public.actor_pricing (voice_actor_id, base_price, price_per_word, express_delivery_fee, background_music_fee, sound_effects_fee, revision_fee, is_fixed_price, fixed_price_amount, min_order)
SELECT 
    va.id,
    30 + (CAST(va.actor_id AS INTEGER) * 3) % 50, -- Base price 30-80
    0.05 + ((CAST(va.actor_id AS INTEGER) * 2) % 15) / 100.0, -- Price per word 0.05-0.20
    25 + (CAST(va.actor_id AS INTEGER) * 5) % 35, -- Express delivery 25-60
    15 + (CAST(va.actor_id AS INTEGER) * 3) % 25, -- Background music 15-40
    20 + (CAST(va.actor_id AS INTEGER) * 4) % 30, -- Sound effects 20-50
    10 + (CAST(va.actor_id AS INTEGER) * 2) % 15, -- Revision fee 10-25
    CASE WHEN CAST(va.actor_id AS INTEGER) % 10 = 0 THEN true ELSE false END, -- 10% fixed price
    CASE WHEN CAST(va.actor_id AS INTEGER) % 10 = 0 THEN 100 + (CAST(va.actor_id AS INTEGER) * 10) % 300 ELSE NULL END, -- Fixed price 100-400
    25 + (CAST(va.actor_id AS INTEGER) * 2) % 25 -- Min order 25-50
FROM public.voice_actors va;

-- Insert audio samples
DO $$
DECLARE
    actor_record RECORD;
    samples_count INTEGER;
    sample_names TEXT[] := ARRAY['სარეკლამო რგოლი', 'ავტომოპასუხე', 'მხატვრული', 'დოკუმენტური'];
    samples_per_actor INTEGER[] := ARRAY[3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 2, 3, 3, 4, 3, 3, 3, 3, 3, 2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 3, 3, 4, 2, 2, 2, 2, 2, 3, 2];
    j INTEGER;
    sample_name TEXT;
BEGIN
    FOR actor_record IN SELECT id, actor_id FROM public.voice_actors ORDER BY CAST(actor_id AS INTEGER) LOOP
        samples_count := samples_per_actor[CAST(actor_record.actor_id AS INTEGER)];
        
        FOR j IN 1..samples_count LOOP
            sample_name := sample_names[((j - 1) % array_length(sample_names, 1)) + 1];
            
            INSERT INTO public.audio_samples (
                voice_actor_id,
                sample_id,
                name,
                category,
                description,
                audio_url,
                order_index
            ) VALUES (
                actor_record.id,
                actor_record.actor_id || '-' || j::TEXT,
                sample_name,
                sample_name,
                'Professional ' || lower(sample_name) || ' voice sample.',
                '/audios/' || actor_record.actor_id || '/' || actor_record.actor_id || '.' || j::TEXT || '.wav',
                j
            );
        END LOOP;
    END LOOP;
END $$;
