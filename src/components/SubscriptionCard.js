import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency, getDaysUntil } from '../utils/utils';

export default function SubscriptionCard({ sub, onDelete }) {
  const daysUntil = getDaysUntil(sub.nextBillingDate);
  const isDueSoon = daysUntil <= 7;

  return (
    <div
      key={sub._id}
      className={`border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
        isDueSoon ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
            {sub.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{sub.name}</h3>
            <p className="text-xs text-gray-500">{sub.category}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(sub._id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800">
            {formatCurrency(sub.monthlyEquivalent)}
          </span>
          <span className="text-sm text-gray-500">/{sub.billingCycle === 'monthly' ? 'm' : 'mo'}</span>
        </div>
        
        <div className={`text-sm ${isDueSoon ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
          <span className="font-medium">Next billing:</span> {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`}
        </div>
      </div>
    </div>
  );
}
