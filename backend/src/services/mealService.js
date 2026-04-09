const Meal = require('../models/Meal');
const AppError = require('../utils/AppError');

const createMeal = async (businessId, mealData) => {
  const meal = await Meal.create({ ...mealData, businessId });
  return meal;
};

const getMealsByBusiness = async (businessId, filters = {}) => {
  const query = { businessId };

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.available !== undefined) {
    query.isAvailable = filters.available === 'true';
  }

  const meals = await Meal.find(query).sort({ createdAt: -1 });
  return meals;
};

const getMealById = async (mealId, businessId) => {
  const meal = await Meal.findOne({ _id: mealId, businessId });
  if (!meal) {
    throw new AppError('Meal not found', 404);
  }
  return meal;
};

const updateMeal = async (mealId, businessId, updates) => {
  const meal = await Meal.findOneAndUpdate(
    { _id: mealId, businessId },
    updates,
    { new: true, runValidators: true }
  );
  if (!meal) {
    throw new AppError('Meal not found', 404);
  }
  return meal;
};

const deleteMeal = async (mealId, businessId) => {
  const meal = await Meal.findOneAndDelete({ _id: mealId, businessId });
  if (!meal) {
    throw new AppError('Meal not found', 404);
  }
  return meal;
};

module.exports = { createMeal, getMealsByBusiness, getMealById, updateMeal, deleteMeal };
