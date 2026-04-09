const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    macros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
      calories: { type: Number, default: 0 },
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
    },
    image: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

mealSchema.index({ businessId: 1, category: 1 });
mealSchema.index({ businessId: 1, isAvailable: 1 });

module.exports = mongoose.model('Meal', mealSchema);
