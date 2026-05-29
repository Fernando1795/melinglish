-- =====================================================
-- Melinglish — Schema completo
-- Aplicar en: Supabase proyecto iqvociniwlaezxqhzhkk
-- =====================================================

-- Perfiles de usuario (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  current_level text NOT NULL DEFAULT 'A1',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Suscripciones (sincronizadas desde Stripe via webhooks)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL CHECK (plan IN ('weekly', 'monthly', 'annual')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Niveles de idioma
CREATE TABLE IF NOT EXISTS levels (
  id text PRIMARY KEY,  -- 'A1', 'A2'
  title text NOT NULL,
  description text,
  total_hours int NOT NULL DEFAULT 30,
  order_index int NOT NULL DEFAULT 1
);

-- Módulos dentro de un nivel
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id text NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 1
);

-- Secciones dentro de un módulo
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  order_index int NOT NULL DEFAULT 1
);

-- Lecciones dentro de una sección
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes int NOT NULL DEFAULT 15,
  cumulative_hours numeric NOT NULL DEFAULT 0,
  intro_video_url text,   -- URL del video explicativo (opcional)
  order_index int NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT false
);

-- Ejercicios interactivos de cada lección
CREATE TABLE IF NOT EXISTS lesson_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('fill_blank', 'sentence_order', 'multiple_choice')),
  content jsonb NOT NULL,
  difficulty int NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  order_index int NOT NULL DEFAULT 1
);

-- Progreso del estudiante por lección
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  score int CHECK (score BETWEEN 0 AND 100),
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: cada usuario ve y edita solo su perfil; admins ven todos
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Subscriptions: cada usuario ve solo las suyas
CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Contenido: cualquier usuario autenticado puede leer
CREATE POLICY "levels_read" ON levels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "modules_read" ON modules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sections_read" ON sections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lessons_read" ON lessons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "blocks_read" ON lesson_blocks FOR SELECT USING (auth.role() = 'authenticated');

-- Admins pueden escribir contenido (usando service role en el backend)
CREATE POLICY "levels_admin" ON levels FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "modules_admin" ON modules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "sections_admin" ON sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "lessons_admin" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "blocks_admin" ON lesson_blocks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Progreso: cada usuario ve y escribe solo el suyo
CREATE POLICY "progress_own" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- Datos iniciales (Seed) — Nivel A1
-- =====================================================

INSERT INTO levels (id, title, description, total_hours, order_index) VALUES
  ('A1', 'Inglés Básico A1', 'Fundamentos del inglés: alfabeto, números, saludos y gramática básica', 30, 1),
  ('A2', 'Inglés Elemental A2', 'Expande tu vocabulario: pasado simple, futuro y temas cotidianos', 30, 2)
ON CONFLICT (id) DO NOTHING;

-- Módulo 1: Fundamentos
WITH m1 AS (
  INSERT INTO modules (level_id, title, description, order_index)
  VALUES ('A1', 'Fundamentos', 'Alfabeto, números, artículos y descripciones básicas', 1)
  RETURNING id
),
s1 AS (
  INSERT INTO sections (module_id, title, order_index)
  SELECT id, 'Primeros pasos', 1 FROM m1
  RETURNING id, module_id
),
s2 AS (
  INSERT INTO sections (module_id, title, order_index)
  SELECT module_id, 'Descripciones cortas en Inglés', 2 FROM s1
  RETURNING id
)
INSERT INTO lessons (section_id, title, duration_minutes, cumulative_hours, order_index, is_published)
SELECT s1.id, lsn.title, lsn.dur, lsn.cum, lsn.ord, true
FROM s1, (VALUES
  ('Alfabeto y Deletreo', 5, 0.08, 1),
  ('Números en Inglés para Principiantes', 7, 0.20, 2),
  ('Estructuras de Tener: have / has', 3, 0.25, 3),
  ('Uso de "a" y "an" según vocales y consonantes', 6, 0.35, 4)
) AS lsn(title, dur, cum, ord)
UNION ALL
SELECT s2.id, lsn.title, lsn.dur, lsn.cum, lsn.ord, true
FROM s2, (VALUES
  ('There is / There are en Inglés Básico', 2, 0.38, 1),
  ('Días de la Semana: pronunciación y uso', 3, 0.43, 2),
  ('Descripción personal: IS y ARE', 3, 0.48, 3),
  ('Conversación: Deletreo y Presentación Personal', 3, 0.53, 4),
  ('Descripciones con his / her / their', 4, 0.60, 5),
  ('Preguntas sobre personas y sus roles', 2, 0.63, 6)
) AS lsn(title, dur, cum, ord);

-- =====================================================
-- Ejercicios de muestra para las primeras lecciones
-- (Se agregan más desde el panel admin)
-- =====================================================
