-- =============================================================================
-- SUPABASE PRODUCTION BOOTSTRAP — مواعيدك
-- =============================================================================
-- هذا الملف جاهز للتطبيق عند إنشاء مشروع Supabase جديد
-- انسخ المحتويات ونفّذها في SQL Editor في لوحة Supabase
-- =============================================================================

-- =============================================================================
-- SECTION 1: USER PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  city_key TEXT,
  city_name_ar TEXT,
  timezone TEXT DEFAULT 'Asia/Riyadh',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin', 'owner')),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  location_consent BOOLEAN DEFAULT FALSE,
  notification_consent BOOLEAN DEFAULT FALSE,
  time_format_preference TEXT DEFAULT '24h' CHECK (time_format_preference IN ('12h', '24h')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- =============================================================================
-- SECTION 2: ROW LEVEL SECURITY — USER PROFILES
-- =============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (
    role IN ('admin', 'super_admin', 'owner')
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.user_profiles FOR UPDATE
  USING (
    role IN ('admin', 'super_admin', 'owner')
  );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SECTION 3: FINANCIAL EVENTS (User-specific schedules)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.financial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'salary', 'citizen_account', 'housing_support', 'social_security',
    'retirement', 'insurance', 'saned', 'hafiz', 'rehabilitation',
    'agricultural_support', 'other'
  )),
  program_name_ar TEXT NOT NULL DEFAULT '',
  next_date DATE NOT NULL,
  hijri_date TEXT,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_days_before INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_events_user ON public.financial_events(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_events_type ON public.financial_events(type);
CREATE INDEX IF NOT EXISTS idx_financial_events_next_date ON public.financial_events(next_date);

ALTER TABLE public.financial_events ENABLE ROW LEVEL SECURITY;

-- Users manage their own financial events
CREATE POLICY "Users manage own financial events"
  ON public.financial_events FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 4: APPOINTMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  category TEXT DEFAULT 'general',
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_date TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own appointments"
  ON public.appointments FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 5: TRIPS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user ON public.trips(user_id);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own trips"
  ON public.trips FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 6: COMPLAINTS & FEEDBACK
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('complaint', 'suggestion', 'inquiry')),
  category TEXT DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_type ON public.complaints(type);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Anyone can submit complaints (even guests with null user_id)
CREATE POLICY "Anyone can create complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- Users can view their own complaints
CREATE POLICY "Users view own complaints"
  ON public.complaints FOR SELECT
  USING (auth.uid() = user_id OR role IN ('admin', 'super_admin', 'owner'));

-- Admins can manage all complaints
CREATE POLICY "Admins manage complaints"
  ON public.complaints FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

-- =============================================================================
-- SECTION 7: NOTIFICATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'prayer_reminder', 'financial_reminder', 'appointment_reminder',
    'trip_reminder', 'system', 'admin_message'
  )),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 8: NOTIFICATION PREFERENCES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_reminders BOOLEAN DEFAULT TRUE,
  financial_reminders BOOLEAN DEFAULT TRUE,
  appointment_reminders BOOLEAN DEFAULT TRUE,
  system_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notification preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 9: DAILY MESSAGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.daily_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_text TEXT NOT NULL,
  day_of_year INTEGER NOT NULL DEFAULT 1 CHECK (day_of_year BETWEEN 1 AND 366),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_messages_day ON public.daily_messages(day_of_year);

ALTER TABLE public.daily_messages ENABLE ROW LEVEL SECURITY;

-- Everyone can read daily messages
CREATE POLICY "Anyone can read daily messages"
  ON public.daily_messages FOR SELECT
  USING (is_active = TRUE);

-- Only admins can manage daily messages
CREATE POLICY "Admins manage daily messages"
  ON public.daily_messages FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

-- =============================================================================
-- SECTION 10: OFFICIAL PRAYER TIMES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.official_prayer_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_key TEXT NOT NULL,
  city_name_ar TEXT NOT NULL,
  date_gregorian DATE NOT NULL,
  date_hijri TEXT,
  timezone TEXT DEFAULT 'Asia/Riyadh',
  fajr TIME NOT NULL,
  sunrise TIME,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  source_name TEXT,
  source_url TEXT,
  is_official BOOLEAN DEFAULT FALSE,
  is_confirmed BOOLEAN DEFAULT FALSE,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_key, date_gregorian)
);

CREATE INDEX IF NOT EXISTS idx_official_prayer_city ON public.official_prayer_times(city_key);
CREATE INDEX IF NOT EXISTS idx_official_prayer_date ON public.official_prayer_times(date_gregorian);

ALTER TABLE public.official_prayer_times ENABLE ROW LEVEL SECURITY;

-- Everyone can read confirmed prayer times
CREATE POLICY "Anyone can read confirmed prayer times"
  ON public.official_prayer_times FOR SELECT
  USING (is_confirmed = TRUE);

-- Only admins can manage prayer times
CREATE POLICY "Admins manage prayer times"
  ON public.official_prayer_times FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

-- =============================================================================
-- SECTION 11: OFFICIAL FINANCIAL DATES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.official_financial_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_key TEXT NOT NULL,
  program_name_ar TEXT NOT NULL,
  owning_authority_name TEXT,
  official_source_url TEXT,
  source_type TEXT DEFAULT 'official',
  is_official BOOLEAN DEFAULT TRUE,
  occurrence_date_gregorian DATE NOT NULL,
  occurrence_date_hijri TEXT,
  adjustment_status TEXT DEFAULT 'none' CHECK (adjustment_status IN ('none', 'advance', 'delay', 'correction')),
  adjustment_reason TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_official_financial_program ON public.official_financial_dates(program_key);
CREATE INDEX IF NOT EXISTS idx_official_financial_date ON public.official_financial_dates(occurrence_date_gregorian);

ALTER TABLE public.official_financial_dates ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved financial dates
CREATE POLICY "Anyone can read approved financial dates"
  ON public.official_financial_dates FOR SELECT
  USING (approval_status = 'approved');

-- Only admins can manage financial dates
CREATE POLICY "Admins manage financial dates"
  ON public.official_financial_dates FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

-- =============================================================================
-- SECTION 12: FINANCIAL DATE ADJUSTMENTS (Audit Log)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.financial_date_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_key TEXT NOT NULL,
  event_id UUID REFERENCES public.official_financial_dates(id) ON DELETE SET NULL,
  old_date DATE,
  new_date DATE NOT NULL,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('advance', 'delay', 'correction')),
  reason TEXT,
  official_source_name TEXT,
  official_source_url TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financial_adjustments_program ON public.financial_date_adjustments(program_key);

ALTER TABLE public.financial_date_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage adjustments"
  ON public.financial_date_adjustments FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

CREATE POLICY "Users view adjustments"
  ON public.financial_date_adjustments FOR SELECT
  USING (TRUE);

-- =============================================================================
-- SECTION 13: APP SETTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read app settings"
  ON public.app_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage app settings"
  ON public.app_settings FOR ALL
  USING (role IN ('admin', 'super_admin', 'owner'));

-- =============================================================================
-- SECTION 14: AUDIT LOGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit logs"
  ON public.audit_logs FOR SELECT
  USING (role IN ('admin', 'super_admin', 'owner'));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (role IN ('admin', 'super_admin', 'owner') OR user_id IS NULL);

-- =============================================================================
-- SECTION 15: SAMPLE DATA — DAILY MESSAGES
-- =============================================================================

INSERT INTO public.daily_messages (message_text, day_of_year) VALUES
  ('يبدأ يومك بنية طيبة، وتوكّل على الله في كل خطوة.', 1),
  ('حافظ على صلاتك في وقتها، فهي نور لك في الدنيا والآخرة.', 2),
  ('ابدأ يومك بالصلاة ثم الذهاب إلى عملك بنشاط.', 3),
  ('الورد والصباح الجميل يبدأان من القلب.', 4),
  ('لا تؤجل عمل اليوم إلى الغد، فكل يوم له فرصته.', 5),
  ('أحسن الظن بالله، وافعل ما بوسعك، وتوكّل على الله.', 6),
  ('مهما كانت التحديات، ثق أن الفرج قريب.', 7),
  ('اجعل لك هدفاً كل يوم، وحققه قبل منتصف النهار.', 8),
  ('التفاؤل يغير الحياة، فابدأ يومك بابتسامة.', 9),
  ('ذكر الله نعمة، فاحمده على نعمائه.', 10),
  ('العمل عبادة، فأتقن ما بيدك.', 11),
  ('لا تستعجل النتائج، فالأجور تأتي.', 12),
  ('كن باراً بوالديك، فالدعاء مستجاب.', 13),
  ('التوازن بين العمل والعبادة مفتاح السعادة.', 14),
  ('كل يوم جديد هو فرصة جديدة للتغيير.', 15),
  ('الصلاة على النبي حياة للقلب.', 16),
  ('العمل الصالح لا يضيع أبداً.', 17),
  ('توكل على الله في كل أمر، فهو خير معين.', 18),
  ('ازرع خيراً حيثما حللت، تحصد خيراً حيثما كنت.', 19),
  ('ابدأ يومك بالصلاة، واختم يومك بالاستغفار.', 20),
  ('الفرج قريب، فلا تيأس.', 21),
  ('ازرع优良品德，收获美好人生。', 22),
  ('ابدأ بالتوكل على الله تنجح.', 23),
  ('أحسن إلى الناس تستعبد قلوبهم.', 24)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 16: SAMPLE DATA — SAUDI CITIES PRAYER TIMES (Template)
-- =============================================================================

-- هذا قسم توضيحي - يجب ملؤه ببيانات حقيقية من مصدر موثوق
-- يمكن إدخال البيانات يدوياً أو عبر API منMinistry of Islamic Affairs

-- =============================================================================
-- SECTION 17: ENABLE REALTIME (Optional)
-- =============================================================================

-- تفعيل Realtime للإشعارات (اختياري)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =============================================================================
-- END OF BOOTSTRAP
-- =============================================================================

-- ملاحظة: لإنشاء حساب مالك/مدير، استخدم لوحة Supabase > Authentication
-- أو API بعد إنشاء حساب عادي، حدّث role من 'user' إلى 'owner' في جدول user_profiles