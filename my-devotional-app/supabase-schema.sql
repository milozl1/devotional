-- Devotional App schema + secure RLS defaults.
-- Apply with: CONFIRM_DB_SETUP=yes SUPABASE_DB_URL=... node setup-db.mjs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS devotionals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  bible_passage_reference VARCHAR(255) NOT NULL,
  bible_passage_text TEXT NOT NULL,
  text_questions JSONB NOT NULL DEFAULT '[]',
  meditation_questions JSONB NOT NULL DEFAULT '[]',
  prayer_text TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  devotional_id UUID REFERENCES devotionals(id) ON DELETE CASCADE,
  completed_steps JSONB NOT NULL DEFAULT '{"passage": false, "textQuestions": false, "meditation": false, "prayer": false}',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (device_id, devotional_id)
);

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devotionals_day ON devotionals(day_number);
CREATE INDEX IF NOT EXISTS idx_devotionals_date ON devotionals(date);
CREATE INDEX IF NOT EXISTS idx_devotionals_published ON devotionals(is_published);
CREATE INDEX IF NOT EXISTS idx_progress_device ON user_progress(device_id);
CREATE INDEX IF NOT EXISTS idx_progress_devotional ON user_progress(devotional_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_devotionals_updated_at ON devotionals;
CREATE TRIGGER update_devotionals_updated_at
  BEFORE UPDATE ON devotionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_updated_at ON user_progress;
CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reads x-device-id request header injected by the client.
CREATE OR REPLACE FUNCTION public.request_device_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.headers', true)::jsonb ->> 'x-device-id',
    ''
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published devotionals" ON devotionals;
DROP POLICY IF EXISTS "Admins can do everything with devotionals" ON devotionals;
DROP POLICY IF EXISTS "Anyone can manage their progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can read profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Public read published devotionals" ON devotionals;
DROP POLICY IF EXISTS "Admins read all devotionals" ON devotionals;
DROP POLICY IF EXISTS "Admins insert devotionals" ON devotionals;
DROP POLICY IF EXISTS "Admins update devotionals" ON devotionals;
DROP POLICY IF EXISTS "Admins delete devotionals" ON devotionals;
DROP POLICY IF EXISTS "Device read own progress" ON user_progress;
DROP POLICY IF EXISTS "Device insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Device update own progress" ON user_progress;
DROP POLICY IF EXISTS "Device delete own progress" ON user_progress;
DROP POLICY IF EXISTS "Admins read own profile" ON admin_profiles;

CREATE POLICY "Public read published devotionals"
  ON devotionals FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins read all devotionals"
  ON devotionals FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins insert devotionals"
  ON devotionals FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins update devotionals"
  ON devotionals FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete devotionals"
  ON devotionals FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Device read own progress"
  ON user_progress FOR SELECT
  TO anon, authenticated
  USING (device_id = public.request_device_id());

CREATE POLICY "Device insert own progress"
  ON user_progress FOR INSERT
  TO anon, authenticated
  WITH CHECK (device_id = public.request_device_id());

CREATE POLICY "Device update own progress"
  ON user_progress FOR UPDATE
  TO anon, authenticated
  USING (device_id = public.request_device_id())
  WITH CHECK (device_id = public.request_device_id());

CREATE POLICY "Device delete own progress"
  ON user_progress FOR DELETE
  TO anon, authenticated
  USING (device_id = public.request_device_id());

CREATE POLICY "Admins read own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());
