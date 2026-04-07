const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_12345');
    
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied.' });
    }
    
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed.', error: err.message });
  }
};

module.exports = auth;
