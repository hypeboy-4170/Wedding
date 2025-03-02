/*
  # Wedding App Database Schema

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text): 写真のURL
      - `created_at` (timestamp): 作成日時
      - `updated_at` (timestamp): 更新日時
    
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text): メッセージ内容
      - `created_at` (timestamp): 作成日時
      - `updated_at` (timestamp): 更新日時

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update
*/

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for photos
CREATE POLICY "Photos are viewable by everyone"
  ON photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for messages
CREATE POLICY "Messages are viewable by everyone"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();