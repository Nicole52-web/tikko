-- Restore UUID defaults on id columns (missing after migrate-to-uuid.sql)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE events ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE tickets ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE payments ALTER COLUMN id SET DEFAULT gen_random_uuid();
