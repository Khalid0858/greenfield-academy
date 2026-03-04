const jwt = require('jsonwebtoken');
const { User } = require('../config/models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'school_secret_key_2024');
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid token or user deactivated.' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
};

const teacherOrAdmin = (req, res, next) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ error: 'Teacher or Admin access required.' });
  next();
};

module.exports = { auth, adminOnly, teacherOrAdmin };
