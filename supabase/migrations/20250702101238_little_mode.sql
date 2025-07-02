/*
  # Create scholarships and saved_scholarships tables

  1. New Tables
    - `scholarships`
      - `id` (uuid, primary key)
      - `title` (text, scholarship title)
      - `provider` (text, scholarship provider/organization)
      - `amount` (numeric, scholarship amount)
      - `currency` (text, currency code)
      - `deadline` (timestamptz, application deadline)
      - `country` (text, target country)
      - `field_of_study` (text[], academic fields)
      - `academic_level` (text[], degree levels)
      - `requirements` (text[], eligibility requirements)
      - `description` (text, detailed description)
      - `application_url` (text, application link)
      - `tags` (text[], searchable tags)
      - `featured` (boolean, featured status)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references users)

    - `saved_scholarships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `scholarship_id` (uuid, references scholarships)
      - `saved_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to scholarships
    - Add policies for users to manage their own saved scholarships

  3. Indexes
    - Performance indexes for common queries
    - Unique constraint on user_id + scholarship_id for saved_scholarships
*/

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  provider text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  deadline timestamptz NOT NULL,
  country text NOT NULL,
  field_of_study text[] DEFAULT '{}',
  academic_level text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  application_url text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Create saved_scholarships table
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scholarship_id)
);

-- Enable RLS
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

-- Scholarships policies (public read access)
CREATE POLICY "Anyone can read scholarships"
  ON scholarships
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create scholarships"
  ON scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own scholarships"
  ON scholarships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own scholarships"
  ON scholarships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Saved scholarships policies
CREATE POLICY "Users can read own saved scholarships"
  ON saved_scholarships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save scholarships"
  ON saved_scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave scholarships"
  ON saved_scholarships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_scholarships_featured ON scholarships(featured);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON scholarships(created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_by ON scholarships(created_by);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON scholarships(amount);

-- Indexes for text search
CREATE INDEX IF NOT EXISTS idx_scholarships_title_search ON scholarships USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_scholarships_description_search ON scholarships USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_scholarships_provider_search ON scholarships USING gin(to_tsvector('english', provider));

-- Indexes for array fields
CREATE INDEX IF NOT EXISTS idx_scholarships_field_of_study ON scholarships USING gin(field_of_study);
CREATE INDEX IF NOT EXISTS idx_scholarships_academic_level ON scholarships USING gin(academic_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_tags ON scholarships USING gin(tags);

-- Saved scholarships indexes
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_scholarship_id ON saved_scholarships(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_saved_at ON saved_scholarships(saved_at);