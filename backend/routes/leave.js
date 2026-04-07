const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { users, leaves, leaveIdCounter } = require('../store');

// POST /leave/apply
router.post('/apply', auth, (req, res) => {
  try {
    const { type, fromDate, toDate, reason, documentName } = req.body;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid dates provided.' });
    }
    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be earlier than start date.' });
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const user = users.find(u => String(u._id) === String(req.user.id));

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (days > user.leaveBalance) {
      return res.status(400).json({ message: `Insufficient leave balance. You have ${user.leaveBalance} days left.` });
    }

    const newLeave = {
      _id: leaveIdCounter(),
      employee: { _id: user._id, name: user.name, email: user.email },
      type, fromDate, toDate, reason,
      documentName: documentName || null,
      days,
      status: 'pending', // pending -> manager_approved -> approved/rejected
      createdAt: new Date().toISOString()
    };

    leaves.push(newLeave);
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /leave/all
router.get('/all', auth, (req, res) => {
  try {
    const { role, id } = req.user;
    let result = leaves;
    if (role === 'employee') {
      result = leaves.filter(l => String(l.employee._id) === String(id));
    }
    res.json([...result].reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /leave/:id
router.put('/:id', auth, (req, res) => {
  try {
    const { role } = req.user;
    if (role === 'employee') {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    const { status } = req.body;
    const leaveId = req.params.id.trim();
    const leave = leaves.find(l => String(l._id) === String(leaveId));
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    // Two-step approval flow enforcement
    if (role === 'manager') {
      if (leave.status !== 'pending') {
        return res.status(400).json({ message: 'Manager can only act on pending leaves.' });
      }
      // Manager approves -> manager_approved, Manager rejects -> rejected
      leave.status = status === 'approved' ? 'manager_approved' : 'rejected';
    } else if (role === 'hr') {
      if (leave.status !== 'manager_approved') {
        return res.status(400).json({ message: 'HR can only act on manager-approved leaves.' });
      }
      const previousStatus = leave.status;
      leave.status = status; // approved or rejected

      // Deduct leave balance only on final HR approval
      const user = users.find(u => String(u._id) === String(leave.employee._id));
      if (user) {
        if (status === 'approved' && previousStatus !== 'approved') {
          if (user.leaveBalance < leave.days) {
            leave.status = previousStatus;
            return res.status(400).json({ message: 'User does not have enough leave balance.' });
          }
          user.leaveBalance -= leave.days;
        } else if (previousStatus === 'approved' && status !== 'approved') {
          user.leaveBalance += leave.days;
        }
      }
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
