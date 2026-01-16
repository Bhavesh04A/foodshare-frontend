import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/authStore";
import { useDonationStore } from "../store/donationStore";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import DonationCard from "../components/donation/DonationCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import QRScanner from "../components/donation/QRScanner";

export default function WastePartnerHome() {
  const { user } = useAuthStore();

  const {
    expiredDonations = [],
    loading,
    fetchExpiredDonations,
    acceptForRecycling,
    confirmRecyclePickup,
  } = useDonationStore();

  /* ---------------- FETCH EXPIRED DONATIONS ---------------- */
  useEffect(() => {
    fetchExpiredDonations();
  }, [fetchExpiredDonations]);

  /* ---------------- ACCEPT FOR RECYCLING ---------------- */
  const handleAccept = async (donationId) => {
    await acceptForRecycling(donationId);
    fetchExpiredDonations();
  };

  /* ---------------- QR SCAN HANDLER ---------------- */
  const handleScan = useCallback(
    async (decodedText) => {
      if (!decodedText) return toast.error("No QR data scanned.");

      const parts = decodedText.split(":");
      const donationId = parts[0];
      const qrToken = parts.slice(1).join(":");

      if (!donationId || !qrToken)
        return toast.error("Invalid QR code format.");

      const donation = expiredDonations.find(
        (d) => String(d._id) === String(donationId)
      );

      if (!donation)
        return toast.error("This QR does not match any assigned recycling task.");

      const success = await confirmRecyclePickup(donationId, qrToken);
      if (success) {
        fetchExpiredDonations();
      }
    },
    [expiredDonations, confirmRecyclePickup, fetchExpiredDonations]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 py-8">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome, {user?.name || "Waste Partner"} ♻️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handle expired food responsibly and reduce waste
            </p>
          </div>

          {/* QR Scanner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Recycling QR Scanner
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Scan QR to confirm recycle pickup
                </p>
                <QRScanner onScan={handleScan} compact />
              </div>
            </Card>
          </div>

          {/* Expired Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              title="♻️ Expired Donations for Recycling"
              className="border-0 shadow-2xl"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">
                  Recycling Assignments
                </h3>
                <p className="text-white/90 text-sm">
                  Accept and process expired food donations
                </p>
              </div>

              {loading ? (
                <LoadingSkeleton count={2} />
              ) : expiredDonations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Expired Donations
                  </h3>
                  <p className="text-gray-600">
                    All caught up! Check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {expiredDonations.map((d, index) => (
                    <motion.div
                      key={d._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DonationCard
                        donation={d}
                        onAccept={handleAccept}
                      />

                      <div className="mt-3">
                        <Button
                          variant="primary"
                          onClick={() => handleAccept(d._id)}
                          className="w-full rounded-xl"
                        >
                          Accept for Recycling ♻️
                        </Button>
                      </div>
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
