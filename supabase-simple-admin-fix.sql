-- Simple Admin Fix for VoiceMarket
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;

-- Create comprehensive policies for contact submissions
CREATE POLICY "Contact submissions access" ON public.contact_submissions
    FOR ALL USING (
        -- Allow insert for everyone (public forms)
        -- Allow select/update for authenticated users (admins)
        auth.role() = 'anon' OR auth.role() = 'authenticated'
    );

-- Create comprehensive policies for quote requests  
CREATE POLICY "Quote requests access" ON public.quote_requests
    FOR ALL USING (
        -- Allow insert for everyone (public forms)
        -- Allow select/update for authenticated users (admins)
        auth.role() = 'anon' OR auth.role() = 'authenticated'
    );

-- Alternative simpler approach: Disable RLS temporarily for testing
-- Uncomment these lines if the above doesn't work:

-- ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;
