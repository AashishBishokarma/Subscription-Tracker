const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 120,
  },
  amount: {
    type: Number,
    required: true,
    min: 1, // Amount in cents, must be > 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR'], // Extend as needed
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
  },
  billingInterval: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  startDate: {
    type: Date,
    required: true,
  },
  billingDay: {
    type: Number,
    min: 1,
    max: 31,
  },
  category: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  monthlyEquivalent: {
    type: Number,
    required: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true }); // Mongoose will add createdAt and updatedAt

// Indexes
SubscriptionSchema.index({ nextBillingDate: 1 });
SubscriptionSchema.index({ category: 1 });
SubscriptionSchema.index({ active: 1, category: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
