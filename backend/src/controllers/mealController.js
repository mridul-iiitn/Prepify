const mealService = require('../services/mealService');
const catchAsync = require('../utils/catchAsync');

const createMeal = catchAsync(async (req, res) => {
  const meal = await mealService.createMeal(req.user.businessId, req.body);
  res.status(201).json({ success: true, data: meal });
});

const getMeals = catchAsync(async (req, res) => {
  const meals = await mealService.getMealsByBusiness(req.user.businessId, req.query);
  res.json({ success: true, data: meals });
});

const getMealsBySubdomain = catchAsync(async (req, res) => {
  const meals = await mealService.getMealsByBusiness(req.params.businessId, { available: 'true' });
  res.json({ success: true, data: meals });
});

const getMeal = catchAsync(async (req, res) => {
  const meal = await mealService.getMealById(req.params.id, req.user.businessId);
  res.json({ success: true, data: meal });
});

const updateMeal = catchAsync(async (req, res) => {
  const meal = await mealService.updateMeal(req.params.id, req.user.businessId, req.body);
  res.json({ success: true, data: meal });
});

const deleteMeal = catchAsync(async (req, res) => {
  await mealService.deleteMeal(req.params.id, req.user.businessId);
  res.json({ success: true, message: 'Meal deleted' });
});

module.exports = { createMeal, getMeals, getMealsBySubdomain, getMeal, updateMeal, deleteMeal };
