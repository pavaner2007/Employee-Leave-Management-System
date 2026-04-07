require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
const commentRoutes = require('./routes/comment');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/leave', leaveRoutes);
app.use('/comment', commentRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Leave Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Demo users ready (password: password123)');
  console.log('  employee@example.com');
  console.log('  manager@example.com');
  console.log('  hr@example.com');
});
