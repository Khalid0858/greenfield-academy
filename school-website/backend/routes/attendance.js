const express = require('express');
const router = express.Router();
const { Attendance, Student, User } = require('../config/models');
const { auth, teacherOrAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

// Mark attendance (teacher/admin)
router.post('/mark', auth, teacherOrAdmin, async (req, res) => {
  try {
    const { records, date, className, subject } = req.body;
    // records = [{ studentId, status, remarks }]
    const teacher = req.user.role === 'teacher'
      ? await require('../config/models').Teacher.findOne({ where: { userId: req.user.id } })
      : null;

    const created = [];
    for (const rec of records) {
      const [att, wasCreated] = await Attendance.findOrCreate({
        where: { studentId: rec.studentId, date, className, subject },
        defaults: {
          ...rec, date, className, subject,
          teacherId: teacher?.id || null
        }
      });
      if (!wasCreated) {
        att.status = rec.status;
        att.remarks = rec.remarks || att.remarks;
        await att.save();
      }
      created.push(att);
    }
    res.json({ message: 'Attendance marked.', count: created.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance.' });
  }
});

// Get attendance for a class/date
router.get('/class', auth, teacherOrAdmin, async (req, res) => {
  try {
    const { date, className, subject } = req.query;
    const where = {};
    if (date) where.date = date;
    if (className) where.className = className;
    if (subject) where.subject = subject;

    const records = await Attendance.findAll({
      where,
      include: [{ model: Student, include: [{ model: User, attributes: ['name', 'email'] }] }],
      order: [['date', 'DESC']]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get today's summary
router.get('/today-summary', auth, teacherOrAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const total = await Student.count();
    const present = await Attendance.count({ where: { date: today, status: 'present' } });
    const absent = await Attendance.count({ where: { date: today, status: 'absent' } });
    const late = await Attendance.count({ where: { date: today, status: 'late' } });

    res.json({ date: today, total, present, absent, late, unmarked: total - (present + absent + late) });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get student's own attendance
router.get('/my', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ error: 'Student profile not found.' });

    const { month, year } = req.query;
    const where = { studentId: student.id };
    if (month && year) {
      where.date = {
        [Op.between]: [`${year}-${month}-01`, `${year}-${month}-31`]
      };
    }

    const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
    const summary = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length
    };
    res.json({ records, summary });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
