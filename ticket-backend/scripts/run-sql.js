const fs = require("fs");
const path = require("path");
const pool = require("../src/db");

async function main() {
  const relPath = process.argv[2];
  if (!relPath) {
    console.error("Usage: node scripts/run-sql.js <sql-file>");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), relPath);
  const sql = fs.readFileSync(filePath, "utf8");

  console.log(`Running ${filePath}...`);
  await pool.query(sql);
  console.log("Done.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
