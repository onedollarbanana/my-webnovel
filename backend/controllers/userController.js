const bcrypt = require('bcrypt');

exports.getMe = async (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
};

exports.updateMe = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username) req.user.username = username;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      req.user.passwordHash = hash;
    }
    await req.user.save();
    res.json({ id: req.user.id, username: req.user.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
