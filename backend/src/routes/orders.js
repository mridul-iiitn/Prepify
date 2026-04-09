const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth, requireRole } = require('../middleware/auth');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.mealId').isMongoId().withMessage('Valid meal ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('deliveryDate').optional().isISO8601().withMessage('Valid delivery date is required'),
  ],
  validate,
  createOrder
);

router.get('/', getOrders);

router.patch(
  '/:id/status',
  requireRole('admin'),
  [
    body('status')
      .isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateOrderStatus
);

module.exports = router;
