ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS participant2_by_event JSONB NOT NULL DEFAULT '[]'::JSONB;
