const Database = require('better-sqlite3');
const db = new Database('./journal.db');

// Users table (optional)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    role TEXT
  )
`).run();

// Journals table
db.prepare(`
  CREATE TABLE IF NOT EXISTS journals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    published_at TEXT,
    created_by TEXT,
    attachment TEXT,
    attachment_type TEXT
  )
`).run();

// Journal-Students (tagging)
db.prepare(`
  CREATE TABLE IF NOT EXISTS journal_students (
    journal_id INTEGER,
    student_name TEXT
  )
`).run();

module.exports = db;
