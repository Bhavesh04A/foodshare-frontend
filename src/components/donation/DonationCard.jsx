import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import {
  formatDate,
  formatQuantity,
  getHoursLeft
} from "../../utils/formatters";
import { getProximityLabel } from "../../utils/pinDistance";
import { useAuthStore } from "../../store/authStore";
import { useDonationStore } from "../../store/donationStore";
import LazyQRCode from "./LazyQR";
import { motion, AnimatePresence } from "framer-motion";

export default function DonationCard({
  donation,
  onAccept,
  isWastePartner = false
}) {
  const { user } = useAuthStore();
  const { deleteDonation } = useDonationStore();
  const [showQR, setShowQR] = useState(false);

  if (!donation) return null;

  const hoursLeft = getHoursLeft(donation.expiresAt);
  const isUrgent =
    hoursLeft !== null && hoursLeft <= 4 && donation.status === "available";

  const proximity = user
    ? getProximityLabel(
        user.pinCode || "",
        user.zone || "",
        donation.pinCode || "",
        donation.zone || ""
      )
    : null;

  const isAvailable = donation.status === "available";
  const isExpired = donation.status === "expired";
  const isCompleted = donation.status === "completed";

  // ✅ NEW (does NOT break anything)
  const isRecycled =
    donation.status === "completed" && donation.recycledBy;

  const getImageUrl = () => {
    try {
      if (donation.images && donation.images.length) {
        const img = donation.images[0];
        if (typeof img === "string") return img;

        if (img?.data?.data) {
          const buffer = new Uint8Array(img.data.data);
          let binary = "";
          buffer.forEach((b) => (binary += String.fromCharCode(b)));
          return `data:${img.contentType || "image/jpeg"};base64,${btoa(binary)}`;
        }
      }
    } catch {}
    return "/placeholder-food.jpg";
  };

  return (
    <>
      <motion.div whileHover={{ y: -5 }}>
        <Card
          className={`p-0 overflow-hidden border-2 transition-all ${
            isUrgent
              ? "border-red-500 shadow-red-300/50"
              : "border-transparent shadow-xl"
          }`}
        >
          {/* IMAGE */}
          <div className="relative h-48">
            <img
              src={getImageUrl()}
              alt={donation.title}
              className="w-full h-full object-cover"
            />

            {/* STATUS BADGE (FIXED & CLEAR) */}
            <div
            className={`absolute top-4 right-4 text-xs font-bold px-3 py-2 rounded-full text-white
              ${donation.status === "expired"
                ? "bg-red-600"
                : donation.status === "completed"
                ? "bg-gray-600"
                : donation.status === "accepted"
                ? "bg-blue-600"
                : "bg-green-500"
              }`}
          >
            {user?.role === "volunteer" && donation.status === "accepted"
              ? "READY FOR PICKUP"
              : user?.role === "ngo" && donation.status === "accepted"
              ? "ACCEPTED • READY FOR PICKUP"
              : donation.status.toUpperCase()}
          </div>


            {isUrgent && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-2 rounded-full">
                🚨 URGENT
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-3">
            <h4 className="text-2xl font-bold">{donation.title}</h4>

            <p className="text-gray-600">
              {formatQuantity(donation.quantity)} of {donation.type}
            </p>

            <div className="text-sm space-y-1">
              <div>
                📍 PIN {donation.pinCode} — <b>{proximity}</b>
              </div>

              <div className="flex items-center gap-2">
                <span>⏳ Expires:</span>
                <span>{formatDate(donation.expiresAt)}</span>
                {hoursLeft !== null && (
                  <span
                    className={`font-bold ${
                      isUrgent ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    ({hoursLeft} hrs left)
                  </span>
                )}
              </div>

              <div>👨‍🍳 Made At: {formatDate(donation.madeAt)}</div>

              {donation.freshnessScore && (
                <div>
                  ✨ Freshness:{" "}
                  <b
                    className={
                      donation.freshnessScore === "High Risk"
                        ? "text-red-600"
                        : donation.freshnessScore === "Consume Soon"
                        ? "text-amber-600"
                        : "text-green-600"
                    }
                  >
                    {donation.freshnessScore}
                  </b>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-3 flex-wrap">
              {/* RESTAURANT */}
              {user?.role === "restaurant" && isAvailable && (
                <Button
                  variant="danger"
                  onClick={() =>
                    window.confirm("Delete donation?") &&
                    deleteDonation(donation._id)
                  }
                >
                  Delete
                </Button>
              )}

              {user?.role === "restaurant" && !isAvailable && !isCompleted && (
                <Button variant="outline" onClick={() => setShowQR(true)}>
                  View QR
                </Button>
              )}

              {/* NGO ACCEPT */}
              {user?.role === "ngo" && isAvailable && (
                <Button
                  variant="primary"
                  onClick={() => onAccept && onAccept(donation._id)}
                >
                  🤝 Accept Donation
                </Button>
              )}

              {/* VOLUNTEER ACCEPT */}
              {user?.role === "volunteer" &&
                donation.status === "accepted" &&
                !donation.volunteerId && (
                  <Button
                    variant="success"
                    onClick={() => onAccept && onAccept(donation._id)}
                  >
                    🚗 Accept Task
                  </Button>
                )}

              {/* WASTE PARTNER */}
              {isWastePartner &&
                user?.role === "waste_partner" &&
                isExpired && (
                  <Button
                    variant="success"
                    onClick={() => onAccept && onAccept(donation._id)}
                  >
                    ♻️ Accept for Recycling
                  </Button>
                )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div className="bg-white p-6 rounded-xl">
              <LazyQRCode
                value={`${donation._id}:${donation.qrToken}`}
                size={180}
              />
              <Button className="mt-4 w-full" onClick={() => setShowQR(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
