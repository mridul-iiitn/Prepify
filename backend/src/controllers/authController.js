const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.json({ success: true, data: user });
});

module.exports = { register, login, getProfile };
