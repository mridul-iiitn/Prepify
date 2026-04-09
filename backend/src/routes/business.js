const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const {
  getBusiness,
  getBusinessBySubdomain,
  updateBusiness,
  getWebsiteConfig,
  updateWebsiteConfig,
} = require('../controllers/businessController');
const { getMealsBySubdomain } = require('../controllers/mealController');

const router = express.Router();

// Public routes (for storefront rendering)
router.get('/subdomain/:subdomain', getBusinessBySubdomain);
router.get('/:businessId/website-config', getWebsiteConfig);
router.get('/:businessId/meals', getMealsBySubdomain);

// Protected routes
router.get('/', auth, requireRole('admin'), getBusiness);
router.put('/', auth, requireRole('admin'), updateBusiness);
router.put('/website-config', auth, requireRole('admin'), updateWebsiteConfig);

module.exports = router;
