const businessService = require('../services/businessService');
const websiteConfigService = require('../services/websiteConfigService');
const catchAsync = require('../utils/catchAsync');

const getBusiness = catchAsync(async (req, res) => {
  const business = await businessService.getBusinessById(req.user.businessId);
  res.json({ success: true, data: business });
});

const getBusinessBySubdomain = catchAsync(async (req, res) => {
  const business = await businessService.getBusinessBySubdomain(req.params.subdomain);
  res.json({ success: true, data: business });
});

const updateBusiness = catchAsync(async (req, res) => {
  const business = await businessService.updateBusiness(
    req.user.businessId,
    req.user._id,
    req.body
  );
  res.json({ success: true, data: business });
});

const getWebsiteConfig = catchAsync(async (req, res) => {
  const config = await websiteConfigService.getConfigByBusiness(req.params.businessId);
  res.json({ success: true, data: config });
});

const updateWebsiteConfig = catchAsync(async (req, res) => {
  const config = await websiteConfigService.updateConfig(req.user.businessId, req.body);
  res.json({ success: true, data: config });
});

module.exports = { getBusiness, getBusinessBySubdomain, updateBusiness, getWebsiteConfig, updateWebsiteConfig };
