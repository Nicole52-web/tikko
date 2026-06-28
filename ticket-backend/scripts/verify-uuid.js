const pool = require("../src/db");

pool
  .query(
    `SELECT table_name, data_type
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND column_name = 'id'
       AND table_name IN ('users', 'events', 'tickets', 'payments')
     ORDER BY table_name`
  )
  .then((r) => {
    console.table(r.rows);
    return pool.end();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
