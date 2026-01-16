import React, { useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useDonationStore } from "../store/donationStore";
import Card from "../components/common/Card";
import DonationCard from "../components/donation/DonationCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import QRScanner from "../components/donation/QRScanner";
import toast from "react-hot-toast";
import { useAiStore } from "../store/aiStore";
import { motion } from "framer-motion";

export default function DashboardVolunteer() {
  const { user } = useAuthStore();

  const {
    volunteerTasks = [],
    loading,
    fetchVolunteerTasks,
    confirmPickup,
    volunteerAcceptTask
  } = useDonationStore();

  const { generateThankYou } = useAiStore();

  useEffect(() => {
    fetchVolunteerTasks();
  }, [fetchVolunteerTasks]);

  /* ----------------------- VOLUNTEER ACCEPT ----------------------- */
  const handleVolunteerAccept = async function (donationId) {
    await volunteerAcceptTask(donationId);
    fetchVolunteerTasks();
  };

  /* ------------------------- QR SCAN HANDLER ----------------------- */
  const handleScan = useCallback(
    async (decodedText) => {
      if (!decodedText) return toast.error("No QR data scanned.");

      const parts = decodedText.split(":");
      const donationId = parts[0];
      const qrToken = parts.slice(1).join(":");

      if (!donationId || !qrToken) return toast.error("Invalid QR code format.");

      const task = (volunteerTasks || []).find(
        (t) =>
          t &&
          String(t._id) === String(donationId) &&
          (t.status === "accepted" || t.status === "picked")
      );

      if (!task)
        return toast.error(
          "This QR does not match a task currently assigned to you."
        );

      const success = await confirmPickup(donationId, qrToken);
      if (success) {
        generateThankYou(task.title);
        fetchVolunteerTasks();
      }
    },
    [volunteerTasks, confirmPickup, generateThankYou, fetchVolunteerTasks]
  );

  const activeTasks = (volunteerTasks || []).filter(
    t => t && (t.status === "accepted" || t.status === "picked") && t.status !== "expired"
  );


  const completedCount = (volunteerTasks || []).filter(
    (t) => t && t.status === "completed"
  ).length;

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
              Hello, {user?.name || "Volunteer"}! 🚗
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help deliver food to those in need - one pickup at a time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-center">
                <div className="text-5xl font-extrabold text-green-600 mb-2">
                  {activeTasks.length}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Tasks</h3>
                <p className="text-gray-600 text-sm">Awaiting pickup</p>
              </div>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-center">
                <div className="text-5xl font-extrabold text-amber-600 mb-2">
                  {completedCount}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
                <p className="text-gray-600 text-sm">Lifetime deliveries</p>
              </div>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 h-full">
              <div className="text-center p-6 h-full flex flex-col justify-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">QR Scanner</h3>
                <p className="text-gray-600 text-sm mb-4">Scan donation QR codes for pickup verification</p>
                <QRScanner onScan={handleScan} compact={true} />
              </div>
            </Card>
          </div>

          {/* Active Tasks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="📦 Your Active Pickup Tasks" className="border-0 shadow-2xl">
              <div className="bg-gradient-to-r from-teal-500 to-amber-500 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">Current Delivery Assignments</h3>
                <p className="text-white/90 text-sm">Tasks ready for pickup and delivery</p>
              </div>

              {loading ? (
                <LoadingSkeleton count={2} />
              ) : activeTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Tasks</h3>
                  <p className="text-gray-600 mb-4">Check the NGO dashboard to accept new delivery tasks</p>
                  <p className="text-gray-500 text-sm">Available tasks will appear here once accepted</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeTasks.map((t, index) => (
                    <motion.div
                      key={t._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DonationCard
                        donation={t}
                        isVolunteer={true}
                        onAccept={handleVolunteerAccept}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card title="💡 Volunteer Tips" className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Always verify the QR code before pickup</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Handle food packages with care</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Follow proper food safety guidelines</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Communicate delays with the NGO</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Use the AI assistant for route help</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-gray-700">Thank donors for their contribution</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}