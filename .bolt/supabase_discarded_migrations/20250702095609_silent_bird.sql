/*
  # Create scholarships table and related schema

  1. New Tables
    - `scholarships`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `provider` (text, required)
      - `amount` (integer, required)
      - `currency` (text, required)
      - `deadline` (timestamp, required)
      - `country` (text, required)
      - `field_of_study` (text[], required)
      - `academic_level` (text[], required)
      - `requirements` (text[], required)
      - `description` (text, required)
      - `application_url` (text, required)
      - `tags` (text[])
      - `featured` (boolean, default false)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    - `saved_scholarships` (relationship between users and scholarships)

  2. Security
    - Enable RLS on scholarships table
    - Add policy for users to read all scholarships
    - Add policy for advisors and admins to create scholarships
    - Add policy for creators to update their scholarships
    - Add policy for admins to update any scholarship
    - Add policy for creators to delete their scholarships
    - Add policy for admins to delete any scholarship
*/

-- Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  country TEXT NOT NULL,
  field_of_study TEXT[] NOT NULL,
  academic_level TEXT[] NOT NULL,
  requirements TEXT[] NOT NULL,
  description TEXT NOT NULL,
  application_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient searching and filtering
CREATE INDEX IF NOT EXISTS idx_scholarships_title ON scholarships USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scholarships_description ON scholarships USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships (country);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships (deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON scholarships (amount);
CREATE INDEX IF NOT EXISTS idx_scholarships_featured ON scholarships (featured);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON scholarships (created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_by ON scholarships (created_by);
CREATE INDEX IF NOT EXISTS idx_scholarships_field_of_study ON scholarships USING gin (field_of_study);
CREATE INDEX IF NOT EXISTS idx_scholarships_academic_level ON scholarships USING gin (academic_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_tags ON scholarships USING gin (tags);

-- Enable row-level security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read all scholarships
CREATE POLICY "Anyone can read scholarships"
  ON scholarships
  FOR SELECT
  USING (true);

-- Allow advisors and admins to create scholarships
CREATE POLICY "Advisors and admins can create scholarships"
  ON scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role') = 'advisor' OR (auth.jwt() ->> 'role') = 'admin');

-- Allow creators to update their own scholarships
CREATE POLICY "Creators can update their scholarships"
  ON scholarships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Allow admins to update any scholarship
CREATE POLICY "Admins can update any scholarship"
  ON scholarships
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Allow creators to delete their own scholarships
CREATE POLICY "Creators can delete their scholarships"
  ON scholarships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Allow admins to delete any scholarship
CREATE POLICY "Admins can delete any scholarship"
  ON scholarships
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin');

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scholarships_updated_at
BEFORE UPDATE ON scholarships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Saved Scholarships junction table (for users to save scholarships)
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, scholarship_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON saved_scholarships (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_scholarship_id ON saved_scholarships (scholarship_id);

-- Enable RLS on saved scholarships
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own saved scholarships
CREATE POLICY "Users can manage their own saved scholarships"
  ON saved_scholarships
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own saved scholarships
CREATE POLICY "Users can read their own saved scholarships"
  ON saved_scholarships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);