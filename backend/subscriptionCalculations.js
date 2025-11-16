// Calculate monthly equivalent cost
const calculateMonthlyEquivalent = (amount, billingCycle, billingInterval = 1) => {
  const interval = billingInterval || 1;
  
  switch (billingCycle) {
    case 'weekly':
      return (amount * 52) / (12 * interval);
    case 'monthly':
      return amount / interval;
    case 'quarterly':
      return (amount * 4) / (12 * interval);
    case 'yearly':
      return amount / (12 * interval);
    case 'custom':
      // For custom, assume interval is in days
      return (amount * 365) / (12 * interval);
    default:
      return amount;
  }
};

// Calculate next billing date
const calculateNextBillingDate = (startDate, billingCycle, billingInterval = 1, billingDay = null) => {
  const interval = billingInterval || 1;
  const nextDate = new Date(startDate);
  const today = new Date();
  
  // Keep adding billing periods until we get a future date
  while (nextDate <= today) {
    switch (billingCycle) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * interval));
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + interval);
        if (billingDay) {
          nextDate.setDate(Math.min(billingDay, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()));
        }
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + (3 * interval));
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + interval);
        break;
      case 'custom':
        // For custom, assume interval is in days
        nextDate.setDate(nextDate.getDate() + interval);
        break;
    }
  }
  
  return nextDate;
};

module.exports = {
  calculateMonthlyEquivalent,
  calculateNextBillingDate
};
