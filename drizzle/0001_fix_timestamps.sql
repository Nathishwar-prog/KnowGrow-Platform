-- Safely convert VARCHAR timestamps to TIMESTAMP
DO $$ BEGIN
  -- admins.createdAt
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admins' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "admins" ALTER COLUMN "createdAt" TYPE timestamp USING "createdAt"::timestamp;
  END IF;

  -- admins.lastLogin
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admins' AND column_name = 'lastLogin'
  ) THEN
    ALTER TABLE "admins" ALTER COLUMN "lastLogin" TYPE timestamp USING "lastLogin"::timestamp;
  END IF;

  -- quizzes.createdAt
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "quizzes" ALTER COLUMN "createdAt" TYPE timestamp USING "createdAt"::timestamp;
  END IF;
END $$;