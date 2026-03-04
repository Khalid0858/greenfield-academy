const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Student, Teacher } = require('../config/models');
const { auth } = require('../middleware/auth');

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    if (!user.isActive) return res.status(403).json({ error: 'Account deactivated. Contact admin.' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'school_secret_key_2024',
      { expiresIn: '24h' }
    );

    let profile = null;
    if (user.role === 'student') profile = await Student.findOne({ where: { userId: user.id } });
    if (user.role === 'teacher') profile = await Teacher.findOne({ where: { userId: user.id } });

    res.json({
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        role: user.role, avatar: user.avatar, profile
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    let profile = null;
    if (req.user.role === 'student') profile = await Student.findOne({ where: { userId: req.user.id } });
    if (req.user.role === 'teacher') profile = await Teacher.findOne({ where: { userId: req.user.id } });
    res.json({ ...req.user.toJSON(), profile });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is wrong.' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
