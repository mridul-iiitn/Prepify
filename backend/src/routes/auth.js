const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { register, login, getProfile } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['admin', 'customer']).withMessage('Role must be admin or customer'),
    body('businessName').if(body('role').equals('admin')).notEmpty().withMessage('Business name is required for admin'),
    body('subdomain')
      .if(body('role').equals('admin'))
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Subdomain can only contain lowercase letters, numbers, and hyphens'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/profile', auth, getProfile);

module.exports = router;
