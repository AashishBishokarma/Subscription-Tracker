import React from 'react';
import { Package } from 'lucide-react';
import { formatCurrency } from '../utils/utils';

export default function Header({ totalMonthly }) {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Subscan</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Total Monthly Cost</p>
            <p className="text-3xl font-bold">{formatCurrency(parseFloat(totalMonthly || 0))}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
