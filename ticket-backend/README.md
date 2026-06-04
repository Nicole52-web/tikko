# Ticket Backend

## Database (UUID)

Primary keys for `users`, `events`, `tickets`, and `payments` use **UUID** (`gen_random_uuid()`).

### New database (Docker)

On first `docker compose up`, Postgres runs `sql/schema-uuid.sql` automatically.

### Existing database (integer ids → UUID)

From `ticket-backend`:

```bash
npm run db:migrate
```

Preserves data. **All users must sign in again** after migration (JWTs contain the old numeric ids).

If inserts fail with `null value in column "id"`, run:

```bash
npm run db:fix-defaults
```

### Dev reset (wipes all data)

```bash
npm run db:reset
```

### Schema only (tables already exist / IF NOT EXISTS)

```bash
npm run db:schema
```
