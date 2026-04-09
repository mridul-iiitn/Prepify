const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth, requireRole } = require('../middleware/auth');
const {
  createMeal,
  getMeals,
  getMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/mealController');

const router = express.Router();

// All meal routes require authentication
router.use(auth);

router.post(
  '/',
  requireRole('admin'),
  [
    body('name').trim().notEmpty().withMessage('Meal name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().trim(),
  ],
  validate,
  createMeal
);

router.get('/', getMeals);

router.get('/:id', getMeal);

router.put(
  '/:id',
  requireRole('admin'),
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  validate,
  updateMeal
);

router.delete('/:id', requireRole('admin'), deleteMeal);

module.exports = router;
