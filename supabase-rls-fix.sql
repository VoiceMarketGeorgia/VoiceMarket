-- =====================================================================
-- VoiceMarket - row level security
--
-- Run the whole file in the Supabase SQL editor. Safe to run repeatedly.
-- It changes permissions only: no columns, no data.
--
-- Supabase policies are ADDITIVE - if any policy allows an action, it is
-- allowed. So this first removes every existing policy on these five
-- tables (by looking them up, rather than guessing names) and then
-- recreates exactly the set we want. The last statement prints the
-- result so you can see what ended up in place.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Clear every existing policy on these tables
-- ---------------------------------------------------------------------
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
              'voice_actors',
              'actor_pricing',
              'audio_samples',
              'contact_submissions',
              'quote_requests'
          )
    LOOP
        EXECUTE format(
            'DROP POLICY IF EXISTS %I ON public.%I',
            pol.policyname,
            pol.tablename
        );
    END LOOP;
END $$;

-- Make sure RLS is actually switched on for all five.
ALTER TABLE public.voice_actors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actor_pricing       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_samples       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests      ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------
-- 2. The public website - read only, active records only
-- ---------------------------------------------------------------------
CREATE POLICY "public_read_active_actors" ON public.voice_actors
    FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_pricing" ON public.actor_pricing
    FOR SELECT USING (true);

CREATE POLICY "public_read_active_samples" ON public.audio_samples
    FOR SELECT USING (is_active = true);


-- ---------------------------------------------------------------------
-- 3. The admin panel - signed-in admins may do everything
--
-- Without this, creating an actor failed with 42501 and editing one
-- silently changed zero rows. It also restores visibility of records
-- switched to inactive, which the public policy above hides.
-- ---------------------------------------------------------------------
CREATE POLICY "admin_manage_actors" ON public.voice_actors
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_manage_pricing" ON public.actor_pricing
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_manage_samples" ON public.audio_samples
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------
-- 4. Customer data - submit only, never read back
--
-- The anon key is embedded in the website's JavaScript and is public by
-- design. Anything anon may read, the whole internet may read.
-- ---------------------------------------------------------------------
CREATE POLICY "public_submit_contact" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "public_submit_quotes" ON public.quote_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_manage_contact" ON public.contact_submissions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_manage_quotes" ON public.quote_requests
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------
-- 5. Result - this prints below the editor when the script finishes
--
-- Expect 11 rows. "roles" should read {authenticated} on every admin_*
-- policy, and {public} on the public_* ones.
-- ---------------------------------------------------------------------
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
      'voice_actors',
      'actor_pricing',
      'audio_samples',
      'contact_submissions',
      'quote_requests'
  )
ORDER BY tablename, policyname;
