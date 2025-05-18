const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

