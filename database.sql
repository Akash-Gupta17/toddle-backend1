-- USERS TABLE (optional if auth is mocked)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  role TEXT
);

-- JOURNALS TABLE
CREATE TABLE IF NOT EXISTS journals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  published_at TEXT,
  created_by TEXT,
  attachment TEXT,
  attachment_type TEXT
);

-- JOURNAL-STUDENTS TAGGING TABLE
CREATE TABLE IF NOT EXISTS journal_students (
  journal_id INTEGER,
  student_name TEXT
);
