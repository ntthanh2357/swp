const express = require('express');
const { body, param } = require('express-validator');
const bcrypt = require('bcryptjs');

const supabase = require('../config/database');
const { validateAuth, requireRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All user routes require authentication
router.use(validateAuth);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, email_verified, created_at, field_of_study, target_country, experience, specializations')
      .eq('id', req.user.id)
      .single();

    if (error) {
      logger.error('Error fetching user profile:', error);
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('avatar_url').optional().isURL().withMessage('Avatar URL must be valid'),
    body('field_of_study').optional().trim().isLength({ max: 100 }),
    body('target_country').optional().trim().isLength({ max: 50 }),
    body('experience').optional().trim().isLength({ max: 1000 }),
    body('specializations').optional().isArray()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const allowedFields = ['name', 'avatar_url'];
      
      // Add role-specific fields
      if (req.user.role === 'student') {
        allowedFields.push('field_of_study', 'target_country');
      } else if (req.user.role === 'advisor') {
        allowedFields.push('experience', 'specializations');
      }

      // Filter out non-allowed fields
      const updateData = {};
      Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update'
        });
      }

      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, name, email, role, avatar_url, email_verified, created_at, field_of_study, target_country, experience, specializations')
        .single();

      if (error) {
        logger.error('Error updating user profile:', error);
        throw error;
      }

      logger.info(`User profile updated: ${userId}`);

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password',
  [
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get current password hash
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: hashedNewPassword })
        .eq('id', userId);

      if (updateError) {
        logger.error('Error updating password:', updateError);
        throw updateError;
      }

      logger.info(`Password changed for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  }
);

// @route   GET /api/users/advisors
// @desc    Get list of advisors
// @access  Private
router.get('/advisors', async (req, res) => {
  try {
    const { data: advisors, error } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, experience, specializations, created_at')
      .eq('role', 'advisor')
      .eq('email_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching advisors:', error);
      throw error;
    }

    res.status(200).json({
      success: true,
      data: advisors
    });
  } catch (error) {
    logger.error('Get advisors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advisors'
    });
  }
});

// @route   GET /api/users/:userId
// @desc    Get user by ID (public info only)
// @access  Private
router.get('/:userId',
  [
    param('userId').isUUID().withMessage('Valid user ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, avatar_url, role, created_at, experience, specializations')
        .eq('id', userId)
        .eq('email_verified', true)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }
);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account',
  [
    body('password').exists().withMessage('Password is required to delete account'),
    body('confirmation').equals('DELETE').withMessage('Type DELETE to confirm account deletion')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      // Get current password hash
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Incorrect password'
        });
      }

      // Delete user account (cascade will handle related records)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        logger.error('Error deleting user account:', deleteError);
        throw deleteError;
      }

      logger.info(`User account deleted: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete account'
      });
    }
  }
);

module.exports = router;