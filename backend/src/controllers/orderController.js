const orderService = require('../services/orderService');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(
    req.user.businessId,
    req.user._id,
    req.body
  );
  res.status(201).json({ success: true, data: order });
});

const getOrders = catchAsync(async (req, res) => {
  let orders;
  if (req.user.role === 'admin') {
    orders = await orderService.getOrdersByBusiness(req.user.businessId, req.query);
  } else {
    orders = await orderService.getOrdersByCustomer(req.user._id, req.user.businessId);
  }
  res.json({ success: true, data: orders });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.user.businessId,
    req.body.status
  );
  res.json({ success: true, data: order });
});

module.exports = { createOrder, getOrders, updateOrderStatus };
