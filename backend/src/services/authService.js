const User = require('../models/User');
const Business = require('../models/Business');
const WebsiteConfig = require('../models/WebsiteConfig');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const register = async ({ name, email, password, role, businessName, subdomain }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({ name, email, password, role });

  if (role === 'admin') {
    if (!businessName || !subdomain) {
      throw new AppError('Business name and subdomain are required for admin registration', 400);
    }

    const existingSubdomain = await Business.findOne({ subdomain });
    if (existingSubdomain) {
      throw new AppError('Subdomain is already taken', 409);
    }

    const business = await Business.create({
      name: businessName,
      ownerId: user._id,
      subdomain,
    });

    user.businessId = business._id;
    await user.save();

    // Create default website config
    await WebsiteConfig.create({ businessId: business._id });
  }

  const token = generateToken({ id: user._id, role: user.role, businessId: user.businessId });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({ id: user._id, role: user.role, businessId: user.businessId });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    },
    token,
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('businessId');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = { register, login, getProfile };
