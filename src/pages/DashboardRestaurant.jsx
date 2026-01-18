import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import Card from '../components/common/Card';
import DonationCard from '../components/donation/DonationCard';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { motion } from 'framer-motion';

export default function DashboardRestaurant() {
  const { user } = useAuthStore();
  const { myDonations, loading, fetchMyDonations } = useDonationStore();

  useEffect(() => {
    fetchMyDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedDonations = myDonations.filter(
    d => d.status === 'completed' || d.status === 'recycled'
  );

  const activeDonations = myDonations.filter(
    d => d.status !== 'completed' && d.status !== 'recycled'
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Hello, {user && user.name ? user.name : 'Restaurant'}! 🍽️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your surplus food into smiles for the community
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-3">➕</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Donation</h3>
                  <p className="text-gray-600 text-sm mb-4">Share surplus food easily</p>
                </div>
                <Link to="/add-donation">
                  <Button variant="primary" className="w-full rounded-xl">Create Donation</Button>
                </Link>
              </div>
            </Card>

            <Link to="/donations/active" className="block h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 cursor-pointer hover:shadow-2xl transition-all h-full">
                <div className="text-center p-6 h-full flex flex-col justify-center">
                  <div className="text-5xl font-extrabold text-blue-600 mb-2">{activeDonations.length}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Active</h3>
                  <p className="text-gray-600 text-sm">Current donations</p>
                </div>
              </Card>
            </Link>

            <Link to="/donations/completed" className="block h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 cursor-pointer hover:shadow-2xl transition-all h-full">
                <div className="text-center p-6 h-full flex flex-col justify-center">
                  <div className="text-5xl font-extrabold text-amber-600 mb-2">{completedDonations.length}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
                  <p className="text-gray-600 text-sm">Successful pickups</p>
                </div>
              </Card>
            </Link>
          </div>

          {/* Active Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="🔄 Your Active Donations" className="border-0 shadow-2xl mb-12">
              <div className="bg-gradient-to-r from-teal-500 to-amber-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">Current Food Sharing</h3>
                <p className="text-white/90 text-sm">Donations awaiting pickup or in progress</p>
              </div>

              {loading ? (
                <LoadingSkeleton count={3} />
              ) : activeDonations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Donations</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first donation to help the community</p>
                  <Link to="/add-donation">
                    <Button variant="primary" className="rounded-xl">Create First Donation</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeDonations.map((d, index) => (
                    <motion.div
                      key={d._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DonationCard donation={d} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Completed Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="✅ Completed Donations" className="border-0 shadow-2xl">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">Your Impact History</h3>
                <p className="text-white/90 text-sm">Successfully delivered donations</p>
              </div>

              {loading ? (
                <LoadingSkeleton count={1} />
              ) : completedDonations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Donations Yet</h3>
                  <p className="text-gray-600">Your completed donations will appear here once they're delivered</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-90">
                  {completedDonations.map((d, index) => (
                    <motion.div
                      key={d._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DonationCard donation={d} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}