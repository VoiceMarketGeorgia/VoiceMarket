-- Fix Admin Access Policies for VoiceMarket
-- Run this in your Supabase SQL editor to fix admin access

-- Add policies for authenticated users (admins) to read contact submissions and quote requests
CREATE POLICY "Authenticated users can read contact submissions" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read quote requests" ON public.quote_requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update status and notes
CREATE POLICY "Authenticated users can update contact submissions" ON public.contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update quote requests" ON public.quote_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Alternative: If the above doesn't work, you can temporarily disable RLS for admin tables
-- (Only run ONE of these approaches)

-- OPTION 1: Keep RLS but add broader admin access
-- This is the recommended approach

-- OPTION 2: Temporarily disable RLS for admin testing (NOT RECOMMENDED for production)
-- ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later if you used option 2:
-- ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
