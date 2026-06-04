-- Migrates existing integer/SERIAL ids to UUID (users, events, tickets, payments).
-- Run once: npm run db:migrate
-- Users must sign in again after migration (JWT will contain new UUIDs).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- Populate UUID columns ----------
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_uuid UUID;
UPDATE users SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
ALTER TABLE users ALTER COLUMN id_uuid SET NOT NULL;

ALTER TABLE events ADD COLUMN IF NOT EXISTS id_uuid UUID;
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id_uuid UUID;
UPDATE events SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE events e
SET user_id_uuid = u.id_uuid
FROM users u
WHERE e.user_id = u.id;
ALTER TABLE events ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE events ALTER COLUMN user_id_uuid SET NOT NULL;

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS id_uuid UUID;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS user_id_uuid UUID;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS event_id_uuid UUID;
UPDATE tickets SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE tickets t SET user_id_uuid = u.id_uuid FROM users u WHERE t.user_id = u.id;
UPDATE tickets t SET event_id_uuid = e.id_uuid FROM events e WHERE t.event_id = e.id;
ALTER TABLE tickets ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN user_id_uuid SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN event_id_uuid SET NOT NULL;

ALTER TABLE payments ADD COLUMN IF NOT EXISTS id_uuid UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id_uuid UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS event_id_uuid UUID;
UPDATE payments SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;
UPDATE payments p SET user_id_uuid = u.id_uuid FROM users u WHERE p.user_id = u.id;
UPDATE payments p SET event_id_uuid = e.id_uuid FROM events e WHERE p.event_id = e.id;
ALTER TABLE payments ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE payments ALTER COLUMN user_id_uuid SET NOT NULL;
ALTER TABLE payments ALTER COLUMN event_id_uuid SET NOT NULL;

-- ---------- Drop foreign key constraints ----------
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT con.conname AS name,
               rel.relname AS table_name
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE con.contype = 'f'
          AND nsp.nspname = 'public'
          AND rel.relname IN ('events', 'tickets', 'payments')
    ) LOOP
        EXECUTE format(
            'ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I',
            r.table_name,
            r.name
        );
    END LOOP;
END $$;

-- ---------- Replace integer columns with UUID ----------
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_pkey;
ALTER TABLE tickets DROP COLUMN IF EXISTS id;
ALTER TABLE tickets DROP COLUMN IF EXISTS user_id;
ALTER TABLE tickets DROP COLUMN IF EXISTS event_id;
ALTER TABLE tickets RENAME COLUMN id_uuid TO id;
ALTER TABLE tickets RENAME COLUMN user_id_uuid TO user_id;
ALTER TABLE tickets RENAME COLUMN event_id_uuid TO event_id;
ALTER TABLE tickets ADD PRIMARY KEY (id);

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE payments DROP COLUMN IF EXISTS id;
ALTER TABLE payments DROP COLUMN IF EXISTS user_id;
ALTER TABLE payments DROP COLUMN IF EXISTS event_id;
ALTER TABLE payments RENAME COLUMN id_uuid TO id;
ALTER TABLE payments RENAME COLUMN user_id_uuid TO user_id;
ALTER TABLE payments RENAME COLUMN event_id_uuid TO event_id;
ALTER TABLE payments ADD PRIMARY KEY (id);

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE events DROP COLUMN IF EXISTS id;
ALTER TABLE events DROP COLUMN IF EXISTS user_id;
ALTER TABLE events RENAME COLUMN id_uuid TO id;
ALTER TABLE events RENAME COLUMN user_id_uuid TO user_id;
ALTER TABLE events ADD PRIMARY KEY (id);

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE users DROP COLUMN IF EXISTS id;
ALTER TABLE users RENAME COLUMN id_uuid TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- ---------- Re-create foreign keys ----------
ALTER TABLE events
    ADD CONSTRAINT events_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE tickets
    ADD CONSTRAINT tickets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD CONSTRAINT tickets_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE payments
    ADD CONSTRAINT payments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD CONSTRAINT payments_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE events ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE tickets ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE payments ALTER COLUMN id SET DEFAULT gen_random_uuid();

COMMIT;
