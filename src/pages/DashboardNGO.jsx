import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDonationStore } from '../store/donationStore';
import Card from '../components/common/Card';
import DonationCard from '../components/donation/DonationCard';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DashboardNGO() {
  const { user } = useAuthStore();
  const { 
    availableDonations, 
    myDonations, 
    loading, 
    fetchAvailableDonations, 
    fetchMyDonations, 
    acceptDonation 
  } = useDonationStore();

  const [pinFilter, setPinFilter] = useState(user && user.pinCode ? user.pinCode : '');
  const [typeFilter, setTypeFilter] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    fetchMyDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchDonations = (e) => {
    e?.preventDefault();
    if (!pinFilter) return toast.error('PIN code is required to search donations.');
    fetchAvailableDonations(pinFilter, typeFilter);
    setFilterApplied(true);
  };

  const handleAccept = async (donationId) => {
    await acceptDonation(donationId, null);
    fetchMyDonations();
    handleFetchDonations();
  };

  // ✅ already correct – keeping exactly as you wrote
  const acceptedDonations = myDonations.filter(
    d => (d.status === 'accepted' || d.status === 'picked') && d.status !== 'expired'
  );

  const completedCount = myDonations.filter(d => d.status === 'completed').length;

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
              Welcome, {user && user.name ? user.name : 'NGO Partner'}! 🤝
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage food distributions and help feed communities in need
            </p>
            {!user || !user.verified ? (
              <div className="mt-4 p-4 bg-amber-100 border border-amber-300 rounded-xl inline-block">
                <span className="text-amber-800 font-medium">
                  🔒 Account Pending Verification - Contact Admin
                </span>
              </div>
            ) : null}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-center">
                <div className="text-5xl font-extrabold text-amber-600 mb-2">
                  {acceptedDonations.length}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Tasks</h3>
                <p className="text-gray-600 text-sm">Food awaiting pickup</p>
              </div>
            </Card>

            <Link to="/donations/completed" className="block h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 cursor-pointer hover:shadow-2xl transition-all h-full">
                <div className="text-center p-6 h-full flex flex-col justify-center">
                  <div className="text-5xl font-extrabold text-green-600 mb-2">
                    {completedCount}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
                  <p className="text-gray-600 text-sm">Successful distributions</p>
                </div>
              </Card>
            </Link>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h3>
                  <p className="text-gray-600 text-sm mb-4">Get logistics help</p>
                </div>
                <Link to="/assistant">
                  <Button variant="primary" className="w-full rounded-xl">
                    Open Assistant
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Accepted Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="📦 Your Accepted Donations" className="border-0 shadow-2xl mb-12">
              <div className="bg-gradient-to-r from-teal-500 to-amber-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">Current Distribution Tasks</h3>
                <p className="text-white/90 text-sm">
                  Donations you've accepted for pickup
                </p>
              </div>

              {loading ? (
                <LoadingSkeleton count={1} />
              ) : acceptedDonations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Accepted Donations
                  </h3>
                  <p className="text-gray-600">
                    Accept donations from the available list below to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {acceptedDonations.map((d, index) => (
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

          {/* Available Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="🔍 Find Available Donations" className="border-0 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">
                  Search Nearby Food Donations
                </h3>
                <p className="text-white/90 text-sm">
                  Find and accept food donations in your area
                </p>
              </div>

              {/* Search Filters */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50 mb-8">
                <form
                  onSubmit={handleFetchDonations}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
                      placeholder="e.g., 400001"
                      value={pinFilter}
                      onChange={(e) => setPinFilter(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Type
                    </label>
                    <select
                      className="input-field border-2 border-gray-300 focus:border-teal-500 rounded-xl"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                  <Button type="submit" loading={loading} className="rounded-xl h-12">
                    🔍 Search
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPinFilter(user.pinCode);
                      setTypeFilter('');
                      setFilterApplied(false);
                    }}
                    disabled={loading}
                    className="rounded-xl h-12 border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    Clear
                  </Button>
                </form>
              </Card>

              {/* Results */}
              {loading && <LoadingSkeleton count={3} />}

              {filterApplied && !loading && (availableDonations.length === 0 ? (
                <Card className="border-0 shadow-lg text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Donations Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or check back later
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableDonations
                    // ✅ ONLY NEW CHANGE
                    .filter(d => d.status !== 'expired')
                    .map((d, index) => (
                      <motion.div
                        key={d._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <DonationCard donation={d} onAccept={handleAccept} />
                      </motion.div>
                    ))}
                </div>
              ))}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
