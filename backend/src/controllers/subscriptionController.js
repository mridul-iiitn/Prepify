const subscriptionService = require('../services/subscriptionService');
const catchAsync = require('../utils/catchAsync');

const createSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.createSubscription(
    req.user.businessId,
    req.user._id,
    req.body
  );
  res.status(201).json({ success: true, data: subscription });
});

const getSubscriptions = catchAsync(async (req, res) => {
  let subscriptions;
  if (req.user.role === 'admin') {
    subscriptions = await subscriptionService.getSubscriptionsByBusiness(req.user.businessId, req.query);
  } else {
    subscriptions = await subscriptionService.getSubscriptionByCustomer(req.user._id, req.user.businessId);
  }
  res.json({ success: true, data: subscriptions });
});

const pauseSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.pauseSubscription(
    req.params.id,
    req.user.businessId
  );
  res.json({ success: true, data: subscription });
});

const resumeSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.resumeSubscription(
    req.params.id,
    req.user.businessId
  );
  res.json({ success: true, data: subscription });
});

const cancelSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(
    req.params.id,
    req.user.businessId
  );
  res.json({ success: true, data: subscription });
});

module.exports = {
  createSubscription,
  getSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
};
