-- ============================================
-- ADD TERMS AND CONDITIONS COLUMN TO EVENTS
-- ============================================
-- Run this in your Supabase SQL Editor to add the terms_and_conditions field

-- Add terms_and_conditions column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN events.terms_and_conditions IS 'Event-specific terms and conditions. If null, default terms will be displayed.';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'terms_and_conditions';


