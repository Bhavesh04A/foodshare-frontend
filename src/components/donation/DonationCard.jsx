import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { formatDate, formatQuantity } from "../../utils/formatters";
import { getProximityLabel } from "../../utils/pinDistance";
import { useAuthStore } from "../../store/authStore";
import { useDonationStore } from "../../store/donationStore";
import LazyQRCode from "./LazyQR";
import { motion, AnimatePresence } from "framer-motion";

export default function DonationCard({
  donation,
  onAccept,
  isVolunteer = false
}) {
  const { user } = useAuthStore();
  const { deleteDonation } = useDonationStore();
  const [showQR, setShowQR] = useState(false);

  if (!donation) return null;

  // ✅ NEW: expired flag
  const isExpired = donation.status === "expired";

  // ✅ NEW: hide expired for NGO & Volunteer
  if (
    isExpired &&
    (user?.role === "ngo" || user?.role === "volunteer")
  ) {
    return null;
  }

  const proximity = user
    ? getProximityLabel(
        user && user.pinCode ? user.pinCode : "",
        user && user.zone ? user.zone : "",
        donation && donation.pinCode ? donation.pinCode : "",
        donation && donation.zone ? donation.zone : ""
      )
    : null;

  const isAvailable = donation.status === "available";
  const isAccepted = donation.status === "accepted";
  const isCompleted = donation.status === "completed";

  const getImageUrl = () => {
    try {
      console.log("Donation images data:", donation.images); 
      
      if (donation.images && donation.images.length > 0) {
        const imageData = donation.images[0];
        
        if (typeof imageData === 'string') {
          return imageData;
        }
        
        if (imageData && imageData.data) {
          let bufferData;
          
          if (imageData.data.type === 'Buffer' && Array.isArray(imageData.data.data)) {
            bufferData = new Uint8Array(imageData.data.data);
          } else if (imageData.data instanceof Uint8Array) {
            bufferData = imageData.data;
          } else if (Array.isArray(imageData.data)) {
            bufferData = new Uint8Array(imageData.data);
          } else {
            console.warn("Unknown image data format:", imageData.data);
            return "/placeholder-food.jpg";
          }
          
          let binary = '';
          const len = bufferData.length;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bufferData[i]);
          }
          const base64String = btoa(binary);
          return `data:${imageData.contentType || 'image/jpeg'};base64,${base64String}`;
        }
      }
      
      return "/placeholder-food.jpg";
    } catch (error) {
      console.error("Error processing image:", error);
      return "/placeholder-food.jpg";
    }
  };

  const imageUrl = getImageUrl();
  const qrValue = donation ? `${donation._id}:${donation.qrToken}` : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-0 overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          {/* Image Section */}
          <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <img
              src={imageUrl}
              alt={donation.title}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "/placeholder-food.jpg"; 
              }}
            />

            {/* Status Badge */}
            <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-2 rounded-full shadow-lg ${
              isExpired
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : isAvailable
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : isAccepted
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900"
                : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
            }`}>
              {String(donation.status || "").toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="text-2xl font-bold text-gray-800 leading-tight">
                {donation.title}
              </h4>
            </div>

            <p className="text-gray-600 text-lg font-medium">
              {formatQuantity(donation.quantity)} of {donation.type}
            </p>

            {/* Details Grid */}
            <div className="space-y-3 text-sm text-gray-700 border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-teal-500">📍</span>
                <span>PIN {donation.pinCode} — </span>
                <span className={`font-bold ${
                  proximity === "Very Near"
                    ? "text-green-600"
                    : proximity === "Near"
                    ? "text-amber-600"
                    : "text-red-500"
                }`}>
                  {proximity}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-amber-500">⏳</span>
                <span>Expires: {formatDate(donation.expiresAt)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-blue-500">👨‍🍳</span>
                <span>Made At: {formatDate(donation.madeAt)}</span>
              </div>

              {donation.freshnessScore && (
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">✨</span>
                  <span>Freshness: </span>
                  <span className={`font-bold ${
                    donation.freshnessScore === "High Risk"
                      ? "text-red-600"
                      : donation.freshnessScore === "Consume Soon"
                      ? "text-amber-600"
                      : "text-green-600"
                  }`}>
                    {donation.freshnessScore}
                  </span>
                </div>
              )}

              {donation.labels && donation.labels.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">🏷️</span>
                  <span>Labels: {donation.labels.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              {/* NGO accept donation */}
              {user && user.role === "ngo" && isAvailable && !isExpired && (
                <Button
                  variant="primary"
                  onClick={() => onAccept && onAccept(donation._id)}
                  className="rounded-xl"
                >
                  Accept Donation
                </Button>
              )}

              {/* Volunteer: Accept task */}
              {user && user.role === "volunteer" &&
                isAccepted &&
                (donation.volunteerId === null || donation.volunteerId === undefined) && (
                  <Button
                    variant="primary"
                    onClick={() => onAccept && onAccept(donation._id)}
                    className="rounded-xl"
                  >
                    Accept Task
                  </Button>
                )}

              {/* Volunteer: Scan QR */}
              {user && user.role === "volunteer" &&
                donation.volunteerId === (user._id || user.id) &&
                (donation.status === "accepted" || donation.status === "picked") && (
                  <Button variant="secondary" className="rounded-xl">
                    Scan QR →
                  </Button>
                )}

              {/* Restaurant delete (available OR expired) */}
              {user && user.role === "restaurant" && (isAvailable || isExpired) && (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm("Delete this donation?")) {
                      deleteDonation(donation._id);
                    }
                  }}
                  className="rounded-xl"
                >
                  Delete 🗑️
                </Button>
              )}

              {/* Restaurant view QR */}
              {user && user.role === "restaurant" &&
                !isAvailable &&
                !isCompleted && (
                  <Button
                    variant="outline"
                    onClick={() => setShowQR(true)}
                    className="rounded-xl"
                  >
                    View QR Code
                  </Button>
                )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* QR Modal (restaurant only) */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="bg-gradient-to-r from-teal-500 to-amber-500 -mx-8 -mt-8 mb-6 px-8 py-4 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">Pickup QR Code</h2>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 inline-block">
                <LazyQRCode value={qrValue} size={180} />
              </div>

              <p className="mt-4 text-gray-600 text-sm">
                Show this QR code to the volunteer for pickup verification.
              </p>
              <Button className="mt-6 w-full rounded-xl" onClick={() => setShowQR(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
