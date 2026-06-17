const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { validate } = require('../../middleware/errorHandler');
const { authMiddleware } = require('../../middleware/auth');
const { authRateLimiter } = require('../../middleware/rateLimiter');
const config = require('../../config');
const { getDb } = require('../../database/models');

// Rate-limited Login - User
router.post('/login', authRateLimiter(),
  [
    body('phone').isMobilePhone('ar-SA').withMessage('Invalid phone number'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { phone, password } = req.body;
      const db = getDb();
      
      const user = db.prepare('SELECT * FROM users WHERE phone = ? AND is_active = 1').get(phone);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (user.password && !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, phone: user.phone, role: user.role_id || 'role_user', type: 'user' },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      const refreshToken = jwt.sign(
        { id: user.id, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );
      
      // Store refresh token
      const refreshTokenId = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      db.prepare('INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
        .run(refreshTokenId, user.id, refreshToken, expiresAt);
      
      res.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Rate-limited Login - Admin
router.post('/admin/login', authRateLimiter(),
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 4 }).withMessage('Password required')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const db = getDb();
      
      const admin = db.prepare('SELECT * FROM admins WHERE email = ? AND is_active = 1').get(email);
      
      if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role_id || 'role_admin', type: 'admin' },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      const refreshToken = jwt.sign(
        { id: admin.id, type: 'refresh' },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );
      
      res.json({
        success: true,
        token,
        refreshToken,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Rate-limited Register - User
router.post('/register', authRateLimiter(),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('phone').isMobilePhone('ar-SA').withMessage('Invalid Saudi phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('email').optional().isEmail().withMessage('Invalid email')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, phone, password, email } = req.body;
      const db = getDb();
      
      // Check if user exists
      const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
      if (existingUser) {
        return res.status(409).json({ error: 'Phone number already registered' });
      }
      
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userId = uuidv4();
      
      db.prepare(`
        INSERT INTO users (id, name, phone, password, email, role_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, name, phone, hashedPassword, email || null, 'role_user');
      
      const token = jwt.sign(
        { id: userId, phone, role: 'role_user', type: 'user' },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      res.status(201).json({
        success: true,
        token,
        user: { id: userId, name, phone, email }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh Token
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token required')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const db = getDb();
      
      try {
        const decoded = jwt.verify(refreshToken, config.jwt.secret);
        
        // Check if token exists in database
        const storedToken = db.prepare('SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > ?')
          .get(refreshToken, new Date().toISOString());
        
        if (!storedToken) {
          return res.status(401).json({ error: 'Invalid refresh token' });
        }
        
        let user;
        if (storedToken.user_id) {
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(storedToken.user_id);
        } else if (storedToken.admin_id) {
          user = db.prepare('SELECT * FROM admins WHERE id = ?').get(storedToken.admin_id);
        }
        
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        
        const newToken = jwt.sign(
          { id: user.id, phone: user.phone, email: user.email, role: user.role_id, type: storedToken.user_id ? 'user' : 'admin' },
          config.jwt.secret,
          { expiresIn: config.jwt.expiresIn }
        );
        
        res.json({ success: true, token: newToken });
      } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Logout
router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    const db = getDb();
    
    // Remove refresh tokens for this user
    if (req.user.type === 'user') {
      db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(req.user.id);
    } else if (req.user.type === 'admin') {
      db.prepare('DELETE FROM refresh_tokens WHERE admin_id = ?').run(req.user.id);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Forgot Password - Rate limited, no token-based reset in this version
router.post('/forgot-password', authRateLimiter(),
  [
    body('phone').isMobilePhone('ar-SA').withMessage('Invalid phone number')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { phone } = req.body;
      const db = getDb();
      
      const user = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
      
      // Always return same message to prevent phone enumeration
      res.json({ 
        success: true, 
        message: 'If the phone number exists, you will receive a verification code via SMS.',
        note: 'This feature requires SMS integration. Contact support for password recovery.'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reset Password - DISABLED: Requires OTP verification (placeholder for future)
router.post('/reset-password', authRateLimiter(),
  [
    body('phone').isMobilePhone('ar-SA').withMessage('Invalid phone number'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  async (req, res, next) => {
    // Feature disabled - requires SMS OTP integration
    res.status(501).json({ 
      error: 'Password reset via OTP is not yet available',
      message: 'Please contact support for password recovery.'
    });
  }
);

module.exports = router;
