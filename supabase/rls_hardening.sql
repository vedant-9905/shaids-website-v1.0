-- ==========================================================
-- SHAIDS SUPABASE — PRODUCTION RLS HARDENING SCRIPT
-- Run this in your Supabase SQL Editor AFTER your project resumes.
-- Dashboard: https://supabase.com/dashboard/project/_/sql
--
-- What this does:
--   - Drops the current open "FOR ALL USING (true)" policies
--   - Replaces with: public SELECT (anyone can read)
--                    auth-only INSERT / UPDATE / DELETE (must be logged in)
--   - Hardens storage bucket policies the same way
--
-- After running: only your logged-in admin account can write data.
-- Public visitors can still read all content normally.
-- ==========================================================

-- ---- events ----
DROP POLICY IF EXISTS "Public Access Events" ON public.events;
CREATE POLICY "Public Read Events"   ON public.events FOR SELECT USING (true);
CREATE POLICY "Auth Write Events"    ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Events"   ON public.events FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Events"   ON public.events FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- team ----
DROP POLICY IF EXISTS "Public Access Team" ON public.team;
CREATE POLICY "Public Read Team"     ON public.team FOR SELECT USING (true);
CREATE POLICY "Auth Write Team"      ON public.team FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Team"     ON public.team FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Team"     ON public.team FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- staff ----
DROP POLICY IF EXISTS "Public Access Staff" ON public.staff;
CREATE POLICY "Public Read Staff"    ON public.staff FOR SELECT USING (true);
CREATE POLICY "Auth Write Staff"     ON public.staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Staff"    ON public.staff FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Staff"    ON public.staff FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- resources ----
DROP POLICY IF EXISTS "Public Access Resources" ON public.resources;
CREATE POLICY "Public Read Resources"  ON public.resources FOR SELECT USING (true);
CREATE POLICY "Auth Write Resources"   ON public.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Resources"  ON public.resources FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Resources"  ON public.resources FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- projects ----
DROP POLICY IF EXISTS "Public Access Projects" ON public.projects;
CREATE POLICY "Public Read Projects"   ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth Write Projects"    ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Projects"   ON public.projects FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Projects"   ON public.projects FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- nptel ----
DROP POLICY IF EXISTS "Public Access NPTEL" ON public.nptel;
CREATE POLICY "Public Read NPTEL"      ON public.nptel FOR SELECT USING (true);
CREATE POLICY "Auth Write NPTEL"       ON public.nptel FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update NPTEL"      ON public.nptel FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete NPTEL"      ON public.nptel FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- highlights ----
DROP POLICY IF EXISTS "Public Access Highlights" ON public.highlights;
CREATE POLICY "Public Read Highlights" ON public.highlights FOR SELECT USING (true);
CREATE POLICY "Auth Write Highlights"  ON public.highlights FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Highlights" ON public.highlights FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Highlights" ON public.highlights FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- fest_sub_events ----
DROP POLICY IF EXISTS "Public Access Fest Sub Events" ON public.fest_sub_events;
CREATE POLICY "Public Read FestSubEvents"  ON public.fest_sub_events FOR SELECT USING (true);
CREATE POLICY "Auth Write FestSubEvents"   ON public.fest_sub_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update FestSubEvents"  ON public.fest_sub_events FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete FestSubEvents"  ON public.fest_sub_events FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- fest_galleries ----
DROP POLICY IF EXISTS "Public Access Fest Galleries" ON public.fest_galleries;
CREATE POLICY "Public Read FestGalleries"  ON public.fest_galleries FOR SELECT USING (true);
CREATE POLICY "Auth Write FestGalleries"   ON public.fest_galleries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update FestGalleries"  ON public.fest_galleries FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete FestGalleries"  ON public.fest_galleries FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- toppers ----
DROP POLICY IF EXISTS "Public Access Toppers" ON public.toppers;
CREATE POLICY "Public Read Toppers"    ON public.toppers FOR SELECT USING (true);
CREATE POLICY "Auth Write Toppers"     ON public.toppers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update Toppers"    ON public.toppers FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Toppers"    ON public.toppers FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- domain_awards ----
DROP POLICY IF EXISTS "Public Access Domain Awards" ON public.domain_awards;
CREATE POLICY "Public Read DomainAwards"  ON public.domain_awards FOR SELECT USING (true);
CREATE POLICY "Auth Write DomainAwards"   ON public.domain_awards FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update DomainAwards"  ON public.domain_awards FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete DomainAwards"  ON public.domain_awards FOR DELETE  USING (auth.role() = 'authenticated');

-- ---- home_config ----
DROP POLICY IF EXISTS "Public Access Home Config" ON public.home_config;
CREATE POLICY "Public Read HomeConfig"    ON public.home_config FOR SELECT USING (true);
CREATE POLICY "Auth Write HomeConfig"     ON public.home_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update HomeConfig"    ON public.home_config FOR UPDATE  USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete HomeConfig"    ON public.home_config FOR DELETE  USING (auth.role() = 'authenticated');

-- ==========================================================
-- STORAGE BUCKET HARDENING
-- ==========================================================
DROP POLICY IF EXISTS "Public Insert Assets Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Assets Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Assets Bucket" ON storage.objects;

-- Keep public read (images must be publicly accessible for the site to display them)
-- Restrict write/delete to authenticated admin only
CREATE POLICY "Auth Insert Assets Bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'shaids-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update Assets Bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'shaids-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete Assets Bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'shaids-assets' AND auth.role() = 'authenticated');
