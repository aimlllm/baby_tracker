-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE feeding_type AS ENUM ('breast', 'formula', 'solid');
CREATE TYPE diaper_type AS ENUM ('wet', 'dirty', 'both');
CREATE TYPE consistency_type AS ENUM ('normal', 'soft', 'hard', 'watery');
CREATE TYPE sleep_quality AS ENUM ('good', 'fair', 'poor');
CREATE TYPE mood_type AS ENUM ('happy', 'neutral', 'fussy', 'crying');
CREATE TYPE caregiver_role AS ENUM ('parent', 'guardian', 'babysitter', 'other');
CREATE TYPE ocr_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE notification_type AS ENUM ('reminder', 'milestone', 'alert', 'share');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    preferences JSONB DEFAULT '{"autoApprove": false, "notifications": true, "timezone": "UTC", "dateFormat": "MM/DD/YYYY", "units": "metric"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Babies table
CREATE TABLE public.babies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender gender_type NOT NULL,
    medical_info JSONB DEFAULT '{}'::jsonb,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT babies_user_id_name_key UNIQUE (user_id, name)
);

-- Caregivers table
CREATE TABLE public.caregivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    caregiver_email TEXT NOT NULL,
    role caregiver_role NOT NULL DEFAULT 'babysitter',
    permissions JSONB DEFAULT '{"can_add_entries": true, "can_edit_entries": false, "can_delete_entries": false, "can_view_analytics": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT caregivers_baby_caregiver_key UNIQUE (baby_id, caregiver_email)
);

-- Feeding logs
CREATE TABLE public.feeding_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    time TIMESTAMPTZ NOT NULL,
    type feeding_type NOT NULL,
    amount_ml DECIMAL(6,2),
    duration_minutes INTEGER,
    food_type TEXT,
    breast_side TEXT CHECK (breast_side IN ('left', 'right', 'both')),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diaper logs
CREATE TABLE public.diaper_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    time TIMESTAMPTZ NOT NULL,
    type diaper_type NOT NULL,
    color TEXT,
    consistency consistency_type,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep logs
CREATE TABLE public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN end_time IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 60
            ELSE NULL
        END
    ) STORED,
    quality sleep_quality,
    location TEXT,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    time TIMESTAMPTZ NOT NULL,
    activity_type TEXT NOT NULL,
    location TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media attachments
CREATE TABLE public.media_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('photo', 'document')),
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OCR uploads
CREATE TABLE public.ocr_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    status ocr_status DEFAULT 'pending',
    extracted_text TEXT,
    extracted_data JSONB,
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth data
CREATE TABLE public.growth_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,1),
    head_circumference_cm DECIMAL(4,1),
    percentile_weight INTEGER CHECK (percentile_weight >= 0 AND percentile_weight <= 100),
    percentile_height INTEGER CHECK (percentile_height >= 0 AND percentile_height <= 100),
    percentile_head INTEGER CHECK (percentile_head >= 0 AND percentile_head <= 100),
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT growth_data_baby_date_key UNIQUE (baby_id, date)
);

-- Reminder settings
CREATE TABLE public.reminder_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
    feeding_interval_hours INTEGER,
    diaper_interval_hours INTEGER,
    sleep_reminder BOOLEAN DEFAULT FALSE,
    medication_reminders JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT reminder_settings_user_baby_key UNIQUE (user_id, baby_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_babies_user_id ON public.babies(user_id);
CREATE INDEX idx_feeding_logs_baby_id ON public.feeding_logs(baby_id);
CREATE INDEX idx_feeding_logs_time ON public.feeding_logs(time DESC);
CREATE INDEX idx_diaper_logs_baby_id ON public.diaper_logs(baby_id);
CREATE INDEX idx_diaper_logs_time ON public.diaper_logs(time DESC);
CREATE INDEX idx_sleep_logs_baby_id ON public.sleep_logs(baby_id);
CREATE INDEX idx_sleep_logs_start_time ON public.sleep_logs(start_time DESC);
CREATE INDEX idx_activity_logs_baby_id ON public.activity_logs(baby_id);
CREATE INDEX idx_activity_logs_time ON public.activity_logs(time DESC);
CREATE INDEX idx_growth_data_baby_id ON public.growth_data(baby_id);
CREATE INDEX idx_growth_data_date ON public.growth_data(date DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, read);
CREATE INDEX idx_ocr_uploads_user_id ON public.ocr_uploads(user_id, status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminder_settings_updated_at BEFORE UPDATE ON public.reminder_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaper_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own profile
CREATE POLICY users_select_policy ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_insert_policy ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY users_update_policy ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own babies
CREATE POLICY babies_select_policy ON public.babies
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.caregivers
            WHERE baby_id = babies.id AND caregiver_email = (
                SELECT email FROM public.users WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY babies_insert_policy ON public.babies
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY babies_update_policy ON public.babies
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY babies_delete_policy ON public.babies
    FOR DELETE USING (user_id = auth.uid());

-- Similar policies for logs (feeding, diaper, sleep, activity)
-- Users can view logs for their babies or babies they're caregivers for
CREATE POLICY feeding_logs_select_policy ON public.feeding_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.babies
            WHERE babies.id = feeding_logs.baby_id AND (
                babies.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.caregivers
                    WHERE baby_id = babies.id AND caregiver_email = (
                        SELECT email FROM public.users WHERE id = auth.uid()
                    )
                )
            )
        )
    );

-- Users can insert logs for babies they own or care for
CREATE POLICY feeding_logs_insert_policy ON public.feeding_logs
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.babies
            WHERE babies.id = feeding_logs.baby_id AND (
                babies.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.caregivers
                    WHERE baby_id = babies.id AND 
                    caregiver_email = (SELECT email FROM public.users WHERE id = auth.uid()) AND
                    (permissions->>'can_add_entries')::boolean = true
                )
            )
        )
    );

-- Apply similar policies to other log tables
-- (Repeat for diaper_logs, sleep_logs, activity_logs, growth_data)

-- Notifications are private to each user
CREATE POLICY notifications_select_policy ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY notifications_update_policy ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- OCR uploads are private to each user
CREATE POLICY ocr_uploads_select_policy ON public.ocr_uploads
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY ocr_uploads_insert_policy ON public.ocr_uploads
    FOR INSERT WITH CHECK (user_id = auth.uid());
