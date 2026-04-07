const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  leaveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leave',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
