import React, { useState, useEffect } from 'react';
import api from './api';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import SubscriptionCard from './components/SubscriptionCard';
import SummaryCards from './components/SummaryCards';
import AddSubscriptionModal from './components/AddSubscriptionModal';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const subscriptionsResult = await api.get();
    setSubscriptions(subscriptionsResult.data);
    const summaryResult = await api.get('/summary');
    setSummary(summaryResult.data);
    setLoading(false);
  };

  const handleAddSubscription = async (newSub) => {
    try {
      await api.post(newSub);
      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const handleDeleteSubscription = async (id) => {
    try {
      await api.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const filteredSubscriptions = activeTab === 'All' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header totalMonthly={summary?.totalMonthly} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Subscriptions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <TabNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                setShowModal={setShowModal} 
              />

              {/* Subscriptions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSubscriptions.map(sub => (
                  <SubscriptionCard 
                    key={sub._id} 
                    sub={sub} 
                    onDelete={handleDeleteSubscription} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary & Categories */}
          <div className="space-y-6">
            <SummaryCards summary={summary} />
          </div>
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showModal && (
        <AddSubscriptionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddSubscription}
        />
      )}
    </div>
  );
}
