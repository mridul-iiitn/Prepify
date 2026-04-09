const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth, requireRole } = require('../middleware/auth');
const {
  createSubscription,
  getSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} = require('../controllers/subscriptionController');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('mealsPerWeek').isInt({ min: 1 }).withMessage('Meals per week must be at least 1'),
    body('deliveryDays').isArray({ min: 1 }).withMessage('At least one delivery day is required'),
    body('nextBillingDate').isISO8601().withMessage('Valid billing date is required'),
  ],
  validate,
  createSubscription
);

router.get('/', getSubscriptions);

router.patch('/:id/pause', pauseSubscription);
router.patch('/:id/resume', resumeSubscription);
router.patch('/:id/cancel', cancelSubscription);

module.exports = router;
