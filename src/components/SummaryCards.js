import React from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, getDaysUntil } from '../utils/utils';

export default function SummaryCards({ summary }) {
  return (
    <div className="space-y-6">
      {/* Expected Expense Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Expected Expense</span>
          <DollarSign className="w-5 h-5" />
        </div>
        <p className="text-4xl font-bold mb-1">{formatCurrency(parseFloat(summary?.totalMonthly || 0))}</p>
        <p className="text-xs opacity-75">Total monthly cost across all subscriptions</p>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Payments</h2>
        </div>
        
        <div className="space-y-3">
          {summary?.nextBillings.slice(0, 5).map((sub, index) => {
            const daysUntil = getDaysUntil(sub.nextBillingDate);
            const isDueSoon = daysUntil <= 7;
            
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${isDueSoon ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                </div>
                <span className={`text-xs ${isDueSoon ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil}d`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Category Breakdown</h2>
        </div>
        
        <div className="space-y-4">
          {summary?.byCategory.map((cat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                <span className="text-sm font-bold text-gray-800">{formatCurrency(parseFloat(cat.monthly))}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{
                    width: `${(parseFloat(cat.monthly) / parseFloat(summary.totalMonthly)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
