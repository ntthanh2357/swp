const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const supabase = require('../config/database');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');
const { handleValidationErrors } = require('../middleware/validation');
const { validateAuth } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// In-memory store for OTPs (in production, use Redis)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', 
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'advisor']).withMessage('Role must be either student or advisor'),
    body('fieldOfStudy').optional().trim().isLength({ max: 100 }),
    body('targetCountry').optional().trim().isLength({ max: 50 }),
    body('experience').optional().trim().isLength({ max: 1000 }),
    body('specializations').optional().isArray()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password, role, fieldOfStudy, targetCountry, experience, specializations } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP
      otpStore.set(email, {
        otp,
        expiry: otpExpiry,
        userData: {
          name,
          email,
          password_hash: hashedPassword,
          role,
          ...(role === 'student' && { field_of_study: fieldOfStudy, target_country: targetCountry }),
          ...(role === 'advisor' && { experience, specializations })
        }
      });

      // Send OTP email
      await emailService.sendOTPEmail(email, otp, name);

      logger.info(`Registration initiated for email: ${email}`);

      res.status(200).json({
        success: true,
        message: 'OTP sent to email. Please verify to complete registration.',
        email
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }
);

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Get stored OTP data
      const storedData = otpStore.get(email);
      
      if (!storedData) {
        return res.status(400).json({
          success: false,
          error: 'OTP not found or expired. Please request a new one.'
        });
      }

      // Check if OTP is expired
      if (new Date() > storedData.expiry) {
        otpStore.delete(email);
        return res.status(400).json({
          success: false,
          error: 'OTP has expired. Please request a new one.'
        });
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        return res.status(400).json({
          success: false,
          error: 'Invalid OTP. Please try again.'
        });
      }

      // Create user in database
      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          ...storedData.userData,
          email_verified: true
        }])
        .select()
        .single();

      if (error) {
        logger.error('User creation error:', error);
        throw error;
      }

      // Clean up OTP
      otpStore.delete(email);

      // Generate token
      const token = generateToken(user.id);

      // Send welcome email
      await emailService.sendWelcomeEmail(user);

      logger.info(`User registered successfully: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Email verified and account created successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          email_verified: user.email_verified
        }
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Email verification failed'
      });
    }
  }
);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP
// @access  Public
router.post('/resend-otp',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if there's pending registration data
      const storedData = otpStore.get(email);
      
      if (!storedData) {
        return res.status(400).json({
          success: false,
          error: 'No pending registration found for this email'
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Update stored data with new OTP
      otpStore.set(email, {
        ...storedData,
        otp,
        expiry: otpExpiry
      });

      // Send new OTP email
      await emailService.sendOTPEmail(email, otp, storedData.userData.name);

      res.status(200).json({
        success: true,
        message: 'New OTP sent to email'
      });
    } catch (error) {
      logger.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend OTP'
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists().withMessage('Password is required'),
    body('role').isIn(['student', 'advisor', 'admin']).withMessage('Valid role is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, role } = req.body;

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', role)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if email is verified
      if (!user.email_verified) {
        return res.status(403).json({
          success: false,
          error: 'Email not verified. Please verify your email first.'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Generate token
      const token = generateToken(user.id);

      logger.info(`User logged in: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          email_verified: user.email_verified
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email)
        .single();

      // Always return success for security (don't reveal if email exists)
      if (error || !user) {
        return res.status(200).json({
          success: true,
          message: 'If the email exists, a password reset link has been sent.'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token (in production, store in database)
      // For now, using in-memory store
      const resetStore = new Map();
      resetStore.set(resetToken, {
        userId: user.id,
        expiry: resetTokenExpiry
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', validateAuth, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar_url: req.user.avatar_url,
      email_verified: req.user.email_verified,
      created_at: req.user.created_at
    }
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', validateAuth, async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, we'll just return success as the client will remove the token
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;