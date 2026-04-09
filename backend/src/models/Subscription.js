const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      trim: true,
      default: 'custom',
    },
    mealsPerWeek: {
      type: Number,
      required: true,
      min: 1,
    },
    deliveryDays: {
      type: [String],
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ businessId: 1, status: 1 });
subscriptionSchema.index({ customerId: 1 });
subscriptionSchema.index({ nextBillingDate: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
