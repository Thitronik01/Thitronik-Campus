-- Chronik entries (admin-managed via app)
CREATE TABLE campus_chronik (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year        INT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  video_url   TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  created_by  UUID REFERENCES auth.users(id)
);

-- Images per entry (Supabase Storage paths)
CREATE TABLE campus_chronik_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronik_id   UUID REFERENCES campus_chronik(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption      TEXT,
  sort_order   INT DEFAULT 0
);

-- Comments (all authenticated users)
CREATE TABLE campus_chronik_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronik_id UUID REFERENCES campus_chronik(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id),
  user_name  TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE campus_chronik ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_chronik_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_chronik_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated read chronik" ON campus_chronik FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read images" ON campus_chronik_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated read comments" ON campus_chronik_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated insert comments" ON campus_chronik_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own delete comments" ON campus_chronik_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Supabase Storage bucket for chronik images
INSERT INTO storage.buckets (id, name, public) VALUES ('chronik-images', 'chronik-images', false);
CREATE POLICY "authenticated read chronik images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'chronik-images');
CREATE POLICY "authenticated upload chronik images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chronik-images');
