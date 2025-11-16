import React from 'react';
import { Plus } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab, setShowModal }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        {['All', 'Entertainment', 'Productive'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Subscription</span>
      </button>
    </div>
  );
}
