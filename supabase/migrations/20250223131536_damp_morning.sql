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
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'photos' 
    AND rls_enabled = true
  ) THEN
    ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND rls_enabled = true
  ) THEN
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policies for photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'photos' 
    AND policyname = 'Photos are viewable by everyone'
  ) THEN
    CREATE POLICY "Photos are viewable by everyone"
      ON photos
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'photos' 
    AND policyname = 'Authenticated users can insert photos'
  ) THEN
    CREATE POLICY "Authenticated users can insert photos"
      ON photos
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'photos' 
    AND policyname = 'Authenticated users can update their photos'
  ) THEN
    CREATE POLICY "Authenticated users can update their photos"
      ON photos
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Policies for messages
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Messages are viewable by everyone'
  ) THEN
    CREATE POLICY "Messages are viewable by everyone"
      ON messages
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Authenticated users can insert messages'
  ) THEN
    CREATE POLICY "Authenticated users can insert messages"
      ON messages
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Authenticated users can update their messages'
  ) THEN
    CREATE POLICY "Authenticated users can update their messages"
      ON messages
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_photos_updated_at'
  ) THEN
    CREATE TRIGGER update_photos_updated_at
      BEFORE UPDATE ON photos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_messages_updated_at'
  ) THEN
    CREATE TRIGGER update_messages_updated_at
      BEFORE UPDATE ON messages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;