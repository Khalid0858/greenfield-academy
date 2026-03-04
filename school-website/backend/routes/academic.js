const express = require('express');
const router = express.Router();
const { ExamResult, Notice, Student, User, Teacher } = require('../config/models');
const { auth, adminOnly, teacherOrAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

// ==================== RESULTS ====================

// Add result (teacher/admin)
router.post('/results', auth, teacherOrAdmin, async (req, res) => {
  try {
    const result = await ExamResult.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add result.' });
  }
});

// Get results for a student (student sees own, admin/teacher see all)
router.get('/results/my', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ error: 'Student profile not found.' });

    const results = await ExamResult.findAll({
      where: { studentId: student.id },
      order: [['examDate', 'DESC']]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get all results (admin/teacher)
router.get('/results', auth, teacherOrAdmin, async (req, res) => {
  try {
    const { className, examName, subject } = req.query;
    const where = {};
    if (className) where.className = className;
    if (examName) where.examName = { [Op.like]: `%${examName}%` };
    if (subject) where.subject = subject;

    const results = await ExamResult.findAll({
      where,
      include: [{ model: Student, include: [{ model: User, attributes: ['name'] }] }],
      order: [['examDate', 'DESC']]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ==================== NOTICES ====================

// Get active notices (public)
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ expiryDate: null }, { expiryDate: { [Op.gte]: new Date() } }]
      },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Create notice (admin)
router.post('/notices', auth, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, publishedBy: req.user.id });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice.' });
  }
});

// Update notice (admin)
router.put('/notices/:id', auth, adminOnly, async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found.' });
    await notice.update(req.body);
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Delete notice
router.delete('/notices/:id', auth, adminOnly, async (req, res) => {
  try {
    await Notice.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
