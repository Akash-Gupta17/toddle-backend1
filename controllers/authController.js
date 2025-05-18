const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');

exports.signup = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const stmt = db.prepare(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`);
    stmt.run(username, hashedPassword, role);

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const hashed = bcrypt.hashSync(password, 8);

  const token = jwt.sign(
    { username, role }, // mock role
    'secretKey',
    { expiresIn: '1h' }
  );

  res.json({ token });
};

