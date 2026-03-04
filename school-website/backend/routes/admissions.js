const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Admission } = require('../config/models');
const { auth, adminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');

// Submit admission application (public)
router.post('/apply', [
  body('applicantName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty(),
  body('dateOfBirth').isDate(),
  body('gender').isIn(['male', 'female', 'other']),
  body('address').notEmpty(),
  body('applyingForClass').notEmpty(),
  body('parentName').notEmpty(),
  body('parentPhone').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const admission = await Admission.create(req.body);
    res.status(201).json({ message: 'Application submitted successfully!', id: admission.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// Get all admissions (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.applicantName = { [Op.like]: `%${search}%` };

    const admissions = await Admission.findAndCountAll({
      where, order: [['createdAt', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * limit
    });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update admission status (admin only)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const admission = await Admission.findByPk(req.params.id);
    if (!admission) return res.status(404).json({ error: 'Application not found.' });

    admission.status = status;
    if (remarks) admission.remarks = remarks;
    await admission.save();
    res.json({ message: 'Status updated.', admission });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get single admission
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const admission = await Admission.findByPk(req.params.id);
    if (!admission) return res.status(404).json({ error: 'Not found.' });
    res.json(admission);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
