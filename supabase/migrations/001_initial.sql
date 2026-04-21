-- ========================================
-- ResaKit — Migration initiale
-- ========================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- TABLES
-- ========================================

-- PRESTATAIRES
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  city TEXT NOT NULL DEFAULT 'Toulouse',
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  description TEXT,
  short_description TEXT,
  photos TEXT[] DEFAULT '{}',
  logo_url TEXT,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  contact_name TEXT,
  contact_email TEXT UNIQUE,
  contact_phone TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  commission_rate DECIMAL(4,2) DEFAULT 0.10,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- EXPÉRIENCES
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  duration_minutes INTEGER,
  min_people INTEGER DEFAULT 2,
  max_people INTEGER DEFAULT 30,
  price_per_person DECIMAL(8,2),
  price_fixed DECIMAL(8,2),
  deposit_percent INTEGER DEFAULT 30,
  cancellation_policy TEXT DEFAULT '72h avant l''événement',
  what_included TEXT,
  what_to_bring TEXT,
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  photos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  occasions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  rating_average DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CRÉNEAUX
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME,
  total_capacity INTEGER NOT NULL,
  booked_capacity INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(experience_id, date, time_start)
);

-- RÉSERVATIONS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL DEFAULT 'RK-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  experience_id UUID REFERENCES experiences(id),
  slot_id UUID REFERENCES slots(id),
  provider_id UUID REFERENCES providers(id),
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT,
  occasion TEXT,
  message_to_provider TEXT,
  group_size INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2),
  commission_amount DECIMAL(10,2) NOT NULL,
  provider_amount DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT,
  stripe_session_id TEXT,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'deposit_paid', 'fully_paid', 'confirmed', 'completed', 'cancelled', 'refunded')),
  split_payment_enabled BOOLEAN DEFAULT false,
  split_payment_code TEXT UNIQUE,
  split_payment_deadline TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PARTICIPANTS
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount_due DECIMAL(8,2) NOT NULL,
  amount_paid DECIMAL(8,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AVIS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  experience_id UUID REFERENCES experiences(id),
  provider_id UUID REFERENCES providers(id),
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  occasion TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- WAITLIST
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  city TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- INDEX
-- ========================================

CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_category ON providers(category);
CREATE INDEX idx_providers_active ON providers(is_active);
CREATE INDEX idx_experiences_provider ON experiences(provider_id);
CREATE INDEX idx_experiences_active ON experiences(is_active);
CREATE INDEX idx_experiences_tags ON experiences USING gin(tags);
CREATE INDEX idx_experiences_occasions ON experiences USING gin(occasions);
CREATE INDEX idx_slots_experience_date ON slots(experience_id, date);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_experience ON bookings(experience_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_split_code ON bookings(split_payment_code);
CREATE INDEX idx_participants_booking ON participants(booking_id);
CREATE INDEX idx_reviews_experience ON reviews(experience_id);

-- ========================================
-- TRIGGERS
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update rating on review insert
CREATE OR REPLACE FUNCTION update_experience_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE experiences
  SET
    rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE experience_id = NEW.experience_id AND is_published = true
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE experience_id = NEW.experience_id AND is_published = true
    )
  WHERE id = NEW.experience_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_experience_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_experience_rating();

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- PROVIDERS
CREATE POLICY "Providers: public read active" ON providers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Providers: own update" ON providers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers: own insert" ON providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- EXPERIENCES
CREATE POLICY "Experiences: public read active" ON experiences
  FOR SELECT USING (is_active = true);

CREATE POLICY "Experiences: own manage" ON experiences
  FOR ALL USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );

-- SLOTS
CREATE POLICY "Slots: public read" ON slots
  FOR SELECT USING (true);

CREATE POLICY "Slots: own manage" ON slots
  FOR ALL USING (
    experience_id IN (
      SELECT e.id FROM experiences e
      JOIN providers p ON p.id = e.provider_id
      WHERE p.user_id = auth.uid()
    )
  );

-- BOOKINGS
CREATE POLICY "Bookings: provider read own" ON bookings
  FOR SELECT USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );

-- PARTICIPANTS (lecture via API uniquement avec split_payment_code)
CREATE POLICY "Participants: provider read own" ON participants
  FOR SELECT USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      WHERE b.provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
    )
  );

-- REVIEWS
CREATE POLICY "Reviews: public read published" ON reviews
  FOR SELECT USING (is_published = true);

-- WAITLIST
CREATE POLICY "Waitlist: public insert" ON waitlist
  FOR INSERT WITH CHECK (true);

-- ========================================
-- DONNÉES SEED (exemples pour dev)
-- ========================================

INSERT INTO providers (name, slug, category, city, address, description, short_description, contact_email, contact_phone, is_active) VALUES
('Enigma Escape Toulouse', 'enigma-escape-toulouse', 'escape_game', 'Toulouse', '12 rue des Lois, 31000 Toulouse', 'Les meilleurs escape games de Toulouse avec 8 salles immersives. Idéal pour EVJF, anniversaires et team building.', 'Escape games immersifs au cœur de Toulouse', 'contact@enigma-toulouse.fr', '05 61 00 00 01', true),
('Atelier Cocktail Chez Théo', 'atelier-cocktail-chez-theo', 'atelier_cocktail', 'Toulouse', '45 rue Saint-Rome, 31000 Toulouse', 'Apprenez l''art de la mixologie avec un chef barman professionnel. Parfait pour EVJF et team building.', 'Cours de cocktails pour groupe', 'theo@ateliercocktail.fr', '05 61 00 00 02', true),
('Les Petits Crus Gaming', 'les-petits-crus-gaming', 'atelier_oenologie', 'Toulouse', '8 place du Capitole, 31000 Toulouse', 'Food gaming avec dégustation de vins, fromages et chocolats. Expériences œnologiques immersives.', 'Dégustation ludique vins et fromages', 'commercial@lespetitscrus.com', '05 61 00 00 03', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO experiences (provider_id, title, slug, description, short_description, duration_minutes, min_people, max_people, price_per_person, deposit_percent, what_included, address, occasions, tags, photos) VALUES
((SELECT id FROM providers WHERE slug = 'enigma-escape-toulouse'),
 'Le Braquage du Siècle',
 'enigma-braquage-du-siecle',
 'Plongez dans un scénario de braquage haletant. 60 minutes pour résoudre les énigmes et sortir avec le butin. Parfait pour cohésion d''équipe.',
 'Escape room 60 min — ambiance cinéma',
 60, 4, 8, 25.00, 30,
 'Briefing + 60 min de jeu + boisson offerte + photo souvenir',
 '12 rue des Lois, 31000 Toulouse',
 ARRAY['EVJF', 'Anniversaire', 'Team building', 'Entre amis'],
 ARRAY['escape', 'énigme', 'groupe', 'team-building'],
 ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800']),
((SELECT id FROM providers WHERE slug = 'atelier-cocktail-chez-theo'),
 'Atelier Mixologie Signature',
 'mixologie-signature-toulouse',
 'Apprenez à créer 4 cocktails signature avec un chef barman. Dégustation et techniques pro. Idéal EVJF.',
 'Apprends à faire 4 cocktails comme un pro',
 120, 6, 16, 55.00, 50,
 '4 cocktails à réaliser + planche de tapas + tablier offert',
 '45 rue Saint-Rome, 31000 Toulouse',
 ARRAY['EVJF', 'Anniversaire', 'Team building'],
 ARRAY['cocktail', 'mixologie', 'atelier', 'EVJF'],
 ARRAY['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800']),
((SELECT id FROM providers WHERE slug = 'les-petits-crus-gaming'),
 'Food Gaming Vins & Fromages',
 'food-gaming-vins-fromages',
 'Un concept unique : résolvez des énigmes tout en dégustant vins et fromages d''exception. Une expérience œnologique ludique.',
 'Dégustation ludique : énigmes + fromages + vins',
 90, 4, 12, 48.00, 30,
 'Dégustation 5 vins + plateau fromages MOF + énigmes ludiques',
 '8 place du Capitole, 31000 Toulouse',
 ARRAY['EVJF', 'Anniversaire', 'Team building', 'Entre amis'],
 ARRAY['œnologie', 'dégustation', 'ludique', 'EVJF'],
 ARRAY['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'])
ON CONFLICT (slug) DO NOTHING;
