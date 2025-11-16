const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { calculateMonthlyEquivalent, calculateNextBillingDate } = require('../subscriptionCalculations');
const { body, query, param, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Helper for consistent API responses
const sendResponse = (res, success, data, message, status = 200, errors = null) => {
  if (success) {
    logger.info(`API Response Success: ${message || 'OK'}`, { data });
    return res.status(status).json({ success: true, data });
  }
  logger.error(`API Response Error: ${message}`, { status, errors });
  return res.status(status).json({ success: false, message, errors });
};

// Validation middleware
const validateSubscription = [
  body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required and must be between 1 and 120 characters'),
  body('amount').isInt({ gt: 0 }).withMessage('Amount is required and must be an integer greater than 0 (in cents)'),
  body('currency').optional().isISO31661Alpha3().withMessage('Currency must be a 3-letter ISO code'),
  body('billingCycle').isIn(['weekly', 'monthly', 'quarterly', 'yearly', 'custom']).withMessage('Invalid billing cycle'),
  body('billingInterval').optional().isInt({ gt: 0 }).withMessage('Billing interval must be an integer greater than 0'),
  body('startDate').isISO8601().toDate().withMessage('Start date must be a valid ISO date'),
  body('billingDay').optional().isInt({ min: 1, max: 31 }).withMessage('Billing day must be an integer between 1 and 31'),
  body('category').optional().isString().withMessage('Category must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = {};
      errors.array().forEach(err => {
        if (!extractedErrors[err.path]) {
          extractedErrors[err.path] = err.msg;
        }
      });
      return sendResponse(res, false, null, 'validation failed', 400, extractedErrors);
    }
    next();
  }
];

// GET /api/v1/subscriptions
router.get('/', [
  query('active').optional().isBoolean().withMessage('Active must be a boolean'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a non-negative integer'),
  query('sort').optional().isIn(['nextBilling', 'name']).withMessage('Sort can be "nextBilling" or "name"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = {};
      errors.array().forEach(err => {
        if (!extractedErrors[err.path]) {
          extractedErrors[err.path] = err.msg;
        }
      });
      return sendResponse(res, false, null, 'validation failed', 400, extractedErrors);
    }
    next();
  }
], async (req, res) => {
  try {
    logger.info('GET /api/v1/subscriptions called', { query: req.query });
    const { active, limit, skip, sort } = req.query;
    const filter = {};
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    let queryBuilder = Subscription.find(filter);

    if (sort === 'nextBilling') {
      queryBuilder = queryBuilder.sort({ nextBillingDate: 1 });
    } else if (sort === 'name') {
      queryBuilder = queryBuilder.sort({ name: 1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 }); // Default sort
    }

    if (skip) {
      queryBuilder = queryBuilder.skip(parseInt(skip));
    }
    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    const subscriptions = await queryBuilder.select('_id name amount currency billingCycle billingInterval startDate category monthlyEquivalent nextBillingDate active');
    sendResponse(res, true, subscriptions, 'Subscriptions fetched successfully');
  } catch (error) {
    logger.error('Error fetching subscriptions:', error);
    sendResponse(res, false, null, 'Server error', 500);
  }
});

// POST /api/v1/subscriptions
router.post('/', validateSubscription, async (req, res) => {
  try {
    logger.info('POST /api/v1/subscriptions called', { body: req.body });
    const { name, amount, currency, billingCycle, billingInterval, startDate, billingDay, category } = req.body;

    const monthlyEquivalent = calculateMonthlyEquivalent(amount, billingCycle, billingInterval);
    const nextBillingDate = calculateNextBillingDate(new Date(startDate), billingCycle, billingInterval, billingDay);

    const newSubscription = new Subscription({
      name,
      amount,
      currency,
      billingCycle,
      billingInterval,
      startDate,
      billingDay,
      category,
      monthlyEquivalent,
      nextBillingDate,
    });

    await newSubscription.save();
    sendResponse(res, true, newSubscription, 'Subscription created successfully', 201);
  } catch (error) {
    logger.error('Error creating subscription:', error);
    sendResponse(res, false, null, 'Server error', 500);
  }
});

// DELETE /api/v1/subscriptions/:id
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid subscription ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = {};
      errors.array().forEach(err => {
        if (!extractedErrors[err.path]) {
          extractedErrors[err.path] = err.msg;
        }
      });
      return sendResponse(res, false, null, 'validation failed', 400, extractedErrors);
    }
    next();
  }
], async (req, res) => {
  try {
    logger.info(`DELETE /api/v1/subscriptions/${req.params.id} called`);
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, { active: false }, { new: true });

    if (!subscription) {
      logger.warn(`Subscription with ID ${id} not found for deletion`);
      return sendResponse(res, false, null, 'Subscription not found', 404);
    }

    sendResponse(res, true, null, 'Subscription soft-deleted successfully');
  } catch (error) {
    logger.error(`Error soft-deleting subscription with ID ${req.params.id}:`, error);
    sendResponse(res, false, null, 'Server error', 500);
  }
});

// GET /api/v1/subscriptions/summary
router.get('/summary', async (req, res) => {
  try {
    logger.info('GET /api/v1/subscriptions/summary called');
    const activeSubscriptions = await Subscription.find({ active: true });

    const totalMonthly = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyEquivalent, 0);

    const byCategoryMap = {};
    activeSubscriptions.forEach(sub => {
      const category = sub.category || 'Uncategorized';
      if (!byCategoryMap[category]) {
        byCategoryMap[category] = 0;
      }
      byCategoryMap[category] += sub.monthlyEquivalent;
    });

    const byCategory = Object.entries(byCategoryMap).map(([category, monthly]) => ({
      category,
      monthly: parseFloat(monthly.toFixed(2)),
    }));

    const nextBillings = await Subscription.find({ active: true, nextBillingDate: { $gt: new Date() } })
      .sort({ nextBillingDate: 1 })
      .limit(5)
      .select('name nextBillingDate monthlyEquivalent');

    sendResponse(res, true, {
      totalMonthly: parseFloat(totalMonthly.toFixed(2)),
      currency: 'USD', // Assuming USD as default currency for summary
      byCategory,
      nextBillings,
    }, 'Summary data fetched successfully');

  } catch (error) {
    logger.error('Error fetching summary:', error);
    sendResponse(res, false, null, 'Server error', 500);
  }
});


module.exports = router;
