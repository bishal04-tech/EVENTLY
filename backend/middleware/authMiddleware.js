import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token signature against your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user belonging to this token and attach them to the request object
      req.user = await User.findById(decoded.id);

      // Move on to the actual route handler
      next();
    } catch (error) {
      console.error('❌ Token Verification Failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};