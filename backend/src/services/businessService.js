const Business = require('../models/Business');
const AppError = require('../utils/AppError');

const getBusinessById = async (businessId) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new AppError('Business not found', 404);
  }
  return business;
};

const getBusinessBySubdomain = async (subdomain) => {
  const business = await Business.findOne({ subdomain });
  if (!business) {
    throw new AppError('Business not found', 404);
  }
  return business;
};

const updateBusiness = async (businessId, ownerId, updates) => {
  const business = await Business.findOne({ _id: businessId, ownerId });
  if (!business) {
    throw new AppError('Business not found or unauthorized', 404);
  }

  Object.assign(business, updates);
  await business.save();
  return business;
};

module.exports = { getBusinessById, getBusinessBySubdomain, updateBusiness };
