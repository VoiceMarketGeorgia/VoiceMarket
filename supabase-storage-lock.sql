-- =====================================================================
-- VoiceMarket - storage buckets
--
-- RUN THIS ONLY AFTER the updated site code is deployed.
--
-- Why: the photos and audios buckets currently accept uploads from the
-- public anon key - anyone could add or replace files. The updated code
-- uploads using the signed-in admin's session instead, so the buckets
-- can be closed to everyone else. Running this before deploying would
-- break uploads in the old code.
--
-- Afterwards: open the admin panel and replace one actor photo to
-- confirm uploads still work.
-- =====================================================================

-- Remove existing rules for these two buckets, whatever they are named.
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Anyone may view the files (the website shows them).
CREATE POLICY "public_read_media" ON storage.objects
    FOR SELECT USING (bucket_id IN ('photos', 'audios'));

-- Only signed-in admins may upload, replace or delete.
CREATE POLICY "admin_write_media" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id IN ('photos', 'audios'))
    WITH CHECK (bucket_id IN ('photos', 'audios'));

SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
