const db = require('../database');

exports.createJournal = (req, res) => {
  const { description, published_at, students, attachment, attachment_type } = req.body;
  const file = req.file;
  const username = req.user.username;

  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create journals' });
  }

  const finalAttachment = file ? file.path : attachment;
  const finalType = file ? file.mimetype.split('/')[0] : attachment_type;

  try {
    const insert = db.prepare(`
      INSERT INTO journals (description, published_at, created_by, attachment, attachment_type)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(description, published_at, username, finalAttachment, finalType);
    const journalId = result.lastInsertRowid;

    if (students && students.length > 0) {
      const stmt = db.prepare(`INSERT INTO journal_students (journal_id, student_name) VALUES (?, ?)`);
      for (const student of students) {
        stmt.run(journalId, student);
        console.log(`📢 Notification: ${student}@school.com was tagged in Journal #${journalId}`);
      }
    }

    res.status(201).json({
      message: 'Journal created with attachment',
      journal_id: journalId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getFeed = (req, res) => {
  const { role, username } = req.user;

  if (role === 'teacher') {
    db.all(
      `SELECT * FROM journals WHERE created_by = ? ORDER BY published_at DESC`,
      [username],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ role, feed: rows });
      }
    );
  } else if (role === 'student') {
    const now = new Date().toISOString();
    db.all(
      `
      SELECT j.* FROM journals j
      JOIN journal_students js ON j.id = js.journal_id
      WHERE js.student_name = ?
        AND j.published_at <= ?
      ORDER BY j.published_at DESC
      `,
      [username, now],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ role, feed: rows });
      }
    );
  } else {
    res.status(403).json({ message: 'Invalid role' });
  }
};

exports.updateJournal = (req, res) => {
  const { id } = req.params;
  const { description, published_at } = req.body;
  const username = req.user.username;

  // Only update if teacher owns the journal
  db.run(
    `UPDATE journals SET description = ?, published_at = ? WHERE id = ? AND created_by = ?`,
    [description, published_at, id, username],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(403).json({ message: 'Not allowed or journal not found' });
      res.json({ message: 'Journal updated' });
    }
  );
};

exports.deleteJournal = (req, res) => {
  const { id } = req.params;
  const username = req.user.username;

  db.run(
    `DELETE FROM journals WHERE id = ? AND created_by = ?`,
    [id, username],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(403).json({ message: 'Not allowed or journal not found' });

      // Clean up journal_students
      db.run(`DELETE FROM journal_students WHERE journal_id = ?`, [id]);

      res.json({ message: 'Journal deleted' });
    }
  );
};

exports.publishJournal = (req, res) => {
  const { id } = req.params;
  const published_at = new Date().toISOString(); // Now
  const username = req.user.username;

  db.run(
    `UPDATE journals SET published_at = ? WHERE id = ? AND created_by = ?`,
    [published_at, id, username],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(403).json({ message: 'Not allowed or journal not found' });
      res.json({ message: 'Journal published', published_at });
    }
  );
};

