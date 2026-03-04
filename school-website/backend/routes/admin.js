const express = require('express');
const router = express.Router();
const { User, Student, Teacher, Admission, Attendance, ExamResult } = require('../config/models');
const { auth, adminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');

// Dashboard stats
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalStudents, totalTeachers, pendingAdmissions, todayPresent, totalAdmissions] = await Promise.all([
      Student.count(),
      Teacher.count(),
      Admission.count({ where: { status: 'pending' } }),
      Attendance.count({ where: { date: today, status: 'present' } }),
      Admission.count()
    ]);

    res.json({
      totalStudents, totalTeachers, pendingAdmissions,
      todayPresent, totalAdmissions
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const users = await User.findAll({
      where, attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Teacher, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Create user (admin creates teachers/students)
router.post('/users', auth, adminOnly, async (req, res) => {
  try {
    const { profile, ...userData } = req.body;
    const user = await User.create(userData);

    if (userData.role === 'student' && profile) {
      const count = await Student.count();
      await Student.create({
        ...profile, userId: user.id,
        studentId: `STU${String(count + 1).padStart(4, '0')}`
      });
    }
    if (userData.role === 'teacher' && profile) {
      const count = await Teacher.count();
      await Teacher.create({
        ...profile, userId: user.id,
        teacherId: `TCH${String(count + 1).padStart(4, '0')}`
      });
    }

    const created = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Student, required: false }, { model: Teacher, required: false }]
    });
    res.status(201).json(created);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Update user
router.put('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { profile, password, ...userData } = req.body;
    await user.update(userData);

    if (profile) {
      if (user.role === 'student') {
        await Student.update(profile, { where: { userId: user.id } });
      }
      if (user.role === 'teacher') {
        await Teacher.update(profile, { where: { userId: user.id } });
      }
    }

    res.json({ message: 'Updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
