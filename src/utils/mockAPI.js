const mockSubscriptions = [
  {
    _id: '1',
    name: 'Netflix',
    amount: 1299,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Entertainment',
    startDate: '2024-01-01',
    nextBillingDate: '2025-11-18',
    monthlyEquivalent: 12.99,
    icon: '🎬'
  },
  {
    _id: '2',
    name: 'Adobe Photoshop',
    amount: 1799,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Productive',
    startDate: '2024-02-01',
    nextBillingDate: '2025-11-19',
    monthlyEquivalent: 17.99,
    icon: '🎨'
  },
  {
    _id: '3',
    name: 'Slack',
    amount: 2400,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Productive',
    startDate: '2024-03-01',
    nextBillingDate: '2025-11-19',
    monthlyEquivalent: 24.00,
    icon: '💬'
  },
  {
    _id: '4',
    name: 'Dribbble',
    amount: 1800,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Productive',
    startDate: '2024-04-01',
    nextBillingDate: '2025-11-20',
    monthlyEquivalent: 18.00,
    icon: '🎯'
  },
  {
    _id: '5',
    name: 'Spotify',
    amount: 999,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Entertainment',
    startDate: '2024-05-01',
    nextBillingDate: '2025-11-21',
    monthlyEquivalent: 9.99,
    icon: '🎵'
  },
  {
    _id: '6',
    name: 'Hotstar',
    amount: 899,
    currency: 'USD',
    billingCycle: 'monthly',
    billingInterval: 1,
    category: 'Entertainment',
    startDate: '2024-06-01',
    nextBillingDate: '2025-11-22',
    monthlyEquivalent: 8.99,
    icon: '📺'
  }
];

export const mockAPI = {
  getSubscriptions: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockSubscriptions });
      }, 300);
    });
  },
  
  getSummary: (subs) => {
    const totalMonthly = subs.reduce((sum, sub) => sum + sub.monthlyEquivalent, 0);
    const byCategory = {};
    
    subs.forEach(sub => {
      if (!byCategory[sub.category]) {
        byCategory[sub.category] = 0;
      }
      byCategory[sub.category] += sub.monthlyEquivalent;
    });
    
    const nextBillings = [...subs]
      .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate))
      .slice(0, 5);
    
    return {
      success: true,
      data: {
        totalMonthly: totalMonthly.toFixed(2),
        currency: 'USD',
        byCategory: Object.entries(byCategory).map(([category, monthly]) => ({
          category,
          monthly: monthly.toFixed(2)
        })),
        nextBillings
      }
    };
  },
  
  addSubscription: (sub) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSub = {
          ...sub,
          _id: Date.now().toString(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          monthlyEquivalent: sub.billingCycle === 'monthly' ? sub.amount / 100 :
                            sub.billingCycle === 'yearly' ? sub.amount / 1200 :
                            sub.billingCycle === 'quarterly' ? sub.amount / 300 :
                            sub.billingCycle === 'weekly' ? (sub.amount / 100) * 4.33 :
                            sub.amount / 100,
          icon: '📦'
        };
        resolve({ success: true, data: newSub });
      }, 300);
    });
  },
  
  deleteSubscription: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }
};
