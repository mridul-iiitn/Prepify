const Subscription = require('../models/Subscription');
const AppError = require('../utils/AppError');

const createSubscription = async (businessId, customerId, data) => {
  const existing = await Subscription.findOne({
    customerId,
    businessId,
    status: 'active',
  });
  if (existing) {
    throw new AppError('Active subscription already exists', 409);
  }

  const subscription = await Subscription.create({
    ...data,
    customerId,
    businessId,
  });
  return subscription;
};

const getSubscriptionsByBusiness = async (businessId, filters = {}) => {
  const query = { businessId };
  if (filters.status) {
    query.status = filters.status;
  }

  const subscriptions = await Subscription.find(query)
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 });
  return subscriptions;
};

const getSubscriptionByCustomer = async (customerId, businessId) => {
  const subscription = await Subscription.findOne({ customerId, businessId, status: { $ne: 'cancelled' } });
  return subscription;
};

const pauseSubscription = async (subscriptionId, businessId) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscriptionId, businessId, status: 'active' },
    { status: 'paused' },
    { new: true }
  );
  if (!subscription) {
    throw new AppError('Active subscription not found', 404);
  }
  return subscription;
};

const resumeSubscription = async (subscriptionId, businessId) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscriptionId, businessId, status: 'paused' },
    { status: 'active' },
    { new: true }
  );
  if (!subscription) {
    throw new AppError('Paused subscription not found', 404);
  }
  return subscription;
};

const cancelSubscription = async (subscriptionId, businessId) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscriptionId, businessId, status: { $ne: 'cancelled' } },
    { status: 'cancelled' },
    { new: true }
  );
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }
  return subscription;
};

module.exports = {
  createSubscription,
  getSubscriptionsByBusiness,
  getSubscriptionByCustomer,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
};
