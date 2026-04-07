const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { users, leaves, comments, commentIdCounter } = require('../store');

// POST /comment/:leaveId
router.post('/:leaveId', auth, (req, res) => {
  try {
    const { comment } = req.body;
    const leaveId = req.params.leaveId;

    if (!comment) return res.status(400).json({ message: 'Comment text is required' });

    const leave = leaves.find(l => l._id === leaveId);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (req.user.role === 'employee' && leave.employee._id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const user = users.find(u => u._id === req.user.id);
    const newComment = {
      _id: commentIdCounter(),
      leaveId,
      userId: { _id: req.user.id, name: user?.name, role: user?.role },
      comment,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /comment/:leaveId
router.get('/:leaveId', auth, (req, res) => {
  try {
    const leaveId = req.params.leaveId;
    const leave = leaves.find(l => l._id === leaveId);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (req.user.role === 'employee' && leave.employee._id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const result = comments.filter(c => c.leaveId === leaveId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
