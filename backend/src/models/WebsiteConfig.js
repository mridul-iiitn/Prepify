const mongoose = require('mongoose');

const websiteConfigSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      default: 'default',
    },
    template: {
      type: String,
      default: 'classic',
    },
    colors: {
      primary: { type: String, default: '#4F46E5' },
      secondary: { type: String, default: '#10B981' },
      accent: { type: String, default: '#F59E0B' },
      background: { type: String, default: '#FFFFFF' },
      text: { type: String, default: '#111827' },
    },
    logo: {
      type: String,
      default: '',
    },
    banners: [
      {
        imageUrl: { type: String },
        title: { type: String },
        subtitle: { type: String },
        linkUrl: { type: String },
      },
    ],
    heroText: {
      type: String,
      default: 'Fresh Meals, Delivered.',
    },
    aboutText: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

websiteConfigSchema.index({ businessId: 1 }, { unique: true });

module.exports = mongoose.model('WebsiteConfig', websiteConfigSchema);
