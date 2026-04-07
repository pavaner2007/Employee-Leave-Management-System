// In-memory data store
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const users = [
  { _id: '1', name: 'Demo Employee', email: 'employee@example.com', password: bcrypt.hashSync('password123', salt), role: 'employee', leaveBalance: 20 },
  { _id: '2', name: 'Demo Manager',  email: 'manager@example.com',  password: bcrypt.hashSync('password123', salt), role: 'manager',  leaveBalance: 20 },
  { _id: '3', name: 'Demo HR',       email: 'hr@example.com',       password: bcrypt.hashSync('password123', salt), role: 'hr',       leaveBalance: 20 },
];

const leaves = [];
const comments = [];

let leaveIdCounter = 1;
let commentIdCounter = 1;

module.exports = { users, leaves, comments, leaveIdCounter: () => String(leaveIdCounter++), commentIdCounter: () => String(commentIdCounter++) };
