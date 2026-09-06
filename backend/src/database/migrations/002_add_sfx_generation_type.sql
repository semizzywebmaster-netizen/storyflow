DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'generations_type_check' AND t.relname = 'generations' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE generations DROP CONSTRAINT generations_type_check;
  END IF;

  ALTER TABLE generations
    ADD CONSTRAINT generations_type_check
    CHECK (type IN ('STORY','CHARACTER','SCENE','IMAGE','VOICE','MUSIC','SFX','VIDEO','SUBTITLE','THUMBNAIL','SOCIAL'));
END $$;
