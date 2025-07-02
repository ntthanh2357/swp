/*
  # Create scholarships and saved scholarships tables

  1. New Tables
    - `scholarships`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `provider` (text, required)
      - `amount` (numeric, required)
      - `currency` (text, required)
      - `deadline` (timestamp with time zone, required)
      - `country` (text, required)
      - `field_of_study` (text array)
      - `academic_level` (text array)
      - `requirements` (text array)
      - `description` (text, required)
      - `application_url` (text, required)
      - `tags` (text array)
      - `featured` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())
      - `created_by` (uuid, foreign key to users)

    - `saved_scholarships`
      - `user_id` (uuid, foreign key to users)
      - `scholarship_id` (uuid, foreign key to scholarships)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for scholarships (public read, authenticated create/update/delete for own)
    - Add policies for saved_scholarships (users can only manage their own saved scholarships)

  3. Indexes
    - Add indexes for frequently queried columns like deadline, country, field_of_study, etc.
    - Add composite unique index on saved_scholarships for user_id + scholarship_id
*/

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  provider text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  deadline timestamptz NOT NULL,
  country text NOT NULL,
  field_of_study text[] DEFAULT '{}',
  academic_level text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  description text NOT NULL,
  application_url text NOT NULL,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Create saved_scholarships table
CREATE TABLE IF NOT EXISTS saved_scholarships (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, scholarship_id)
);

-- Enable RLS
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;

-- Scholarships policies
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

-- Indexes for scholarships table
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships (deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships (country);
CREATE INDEX IF NOT EXISTS idx_scholarships_featured ON scholarships (featured);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON scholarships (created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_created_by ON scholarships (created_by);
CREATE INDEX IF NOT EXISTS idx_scholarships_field_of_study ON scholarships USING GIN (field_of_study);
CREATE INDEX IF NOT EXISTS idx_scholarships_academic_level ON scholarships USING GIN (academic_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_tags ON scholarships USING GIN (tags);

-- Indexes for saved_scholarships table
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON saved_scholarships (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_scholarship_id ON saved_scholarships (scholarship_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_created_at ON saved_scholarships (created_at);