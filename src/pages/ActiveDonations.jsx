// frontend/src/pages/ActiveDonations.jsx
import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useDonationStore } from "../store/donationStore";
import Card from "../components/common/Card";
import DonationCard from "../components/donation/DonationCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { motion } from "framer-motion";

export default function ActiveDonations() {
  const { user } = useAuthStore();
  const { myDonations, loading, fetchMyDonations } = useDonationStore();

  useEffect(() => {
    fetchMyDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = myDonations.filter(d => d.status !== "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Active Donations
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your ongoing food donations and their current status
            </p>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : active.length === 0 ? (
            <Card className="text-center py-16 border-0 shadow-xl">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Active Donations</h3>
              <p className="text-gray-600 text-lg">
                {user?.role === 'restaurant' 
                  ? "Start by creating your first donation to help the community!"
                  : "No active donations available at the moment."
                }
              </p>
            </Card>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {active.map((d, index) => (
                <motion.div
                  key={d._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DonationCard donation={d} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}