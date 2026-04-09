const Order = require('../models/Order');
const Meal = require('../models/Meal');
const AppError = require('../utils/AppError');

const createOrder = async (businessId, customerId, { items, deliveryDate }) => {
  // Validate meals exist and belong to the business
  const mealIds = items.map((i) => i.mealId);
  const meals = await Meal.find({ _id: { $in: mealIds }, businessId });

  if (meals.length !== mealIds.length) {
    throw new AppError('One or more meals not found', 400);
  }

  const mealMap = new Map(meals.map((m) => [m._id.toString(), m]));

  const orderItems = items.map((item) => {
    const meal = mealMap.get(item.mealId.toString());
    return {
      mealId: meal._id,
      name: meal.name,
      price: meal.price,
      quantity: item.quantity,
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    items: orderItems,
    totalAmount,
    customerId,
    businessId,
    deliveryDate,
  });

  return order;
};

const getOrdersByBusiness = async (businessId, filters = {}) => {
  const query = { businessId };
  if (filters.status) {
    query.status = filters.status;
  }

  const orders = await Order.find(query)
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 });
  return orders;
};

const getOrdersByCustomer = async (customerId, businessId) => {
  const orders = await Order.find({ customerId, businessId }).sort({ createdAt: -1 });
  return orders;
};

const updateOrderStatus = async (orderId, businessId, status) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, businessId },
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  return order;
};

module.exports = { createOrder, getOrdersByBusiness, getOrdersByCustomer, updateOrderStatus };
