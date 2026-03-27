const path = require("path");
const Database = require("better-sqlite3");

const databasePath = path.join(__dirname, "reviseflow.db");
const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

// Create tables once when the server starts.
db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    topic TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL,
    revision_day INTEGER NOT NULL,
    revision_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
  );
`);

// Add the topic column for existing databases created before topics were introduced.
const problemColumns = db
  .prepare("PRAGMA table_info(problems)")
  .all()
  .map((column) => column.name);

if (!problemColumns.includes("topic")) {
  db.exec("ALTER TABLE problems ADD COLUMN topic TEXT");
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(baseDate, days) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

module.exports = {
  db,
  formatDate,
  addDays,
};
