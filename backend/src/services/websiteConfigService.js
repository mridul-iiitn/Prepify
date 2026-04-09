const WebsiteConfig = require('../models/WebsiteConfig');
const AppError = require('../utils/AppError');

const getConfigByBusiness = async (businessId) => {
  const config = await WebsiteConfig.findOne({ businessId });
  if (!config) {
    throw new AppError('Website config not found', 404);
  }
  return config;
};

const updateConfig = async (businessId, updates) => {
  const config = await WebsiteConfig.findOneAndUpdate(
    { businessId },
    updates,
    { new: true, runValidators: true }
  );
  if (!config) {
    throw new AppError('Website config not found', 404);
  }
  return config;
};

module.exports = { getConfigByBusiness, updateConfig };
