import { create } from "zustand";
import * as donationService from "../services/donationService";
import toast from "react-hot-toast";

/* -------------------- HELPERS -------------------- */
const enrichAndSortDonations = function(donations) {
    const now = new Date();

    return donations
        .map(function(d) {
            const expiresAt = new Date(d.expiresAt);
            const hoursLeft = Math.max(
                0,
                Math.ceil((expiresAt - now) / (1000 * 60 * 60))
            );

            return {
                ...d,
                hoursLeft: hoursLeft,
                isUrgent: d.status === "available" && hoursLeft <= 4
            };
        })
        .sort(function(a, b) {
            if (a.isUrgent && !b.isUrgent) return -1;
            if (!a.isUrgent && b.isUrgent) return 1;
            return new Date(a.expiresAt) - new Date(b.expiresAt);
        });
};
/* ------------------------------------------------ */

export const useDonationStore = create(function(set, get) {
    return {
        availableDonations: [],
        myDonations: [],
        volunteerTasks: [],
        expiredDonations: [], // ✅ NEW
        loading: false,

        /* ---------------- AVAILABLE ---------------- */
        fetchAvailableDonations: async function(pin, type) {
            set({ loading: true });
            try {
                const data = await donationService.getAvailableDonations(pin, type);
                set({
                    availableDonations: enrichAndSortDonations(
                        Array.isArray(data) ? data : []
                    )
                });
            } catch (error) {
                toast.error("Failed to fetch available donations.");
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- MY DONATIONS ---------------- */
        fetchMyDonations: async function() {
            set({ loading: true });
            try {
                const data = await donationService.getUserDonations();
                set({
                    myDonations: enrichAndSortDonations(
                        Array.isArray(data) ? data : []
                    )
                });
            } catch (error) {
                toast.error("Failed to fetch your donations.");
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- VOLUNTEER TASKS ---------------- */
        fetchVolunteerTasks: async function() {
            set({ loading: true });
            try {
                const data = await donationService.getVolunteerTasks();
                set({
                    volunteerTasks: enrichAndSortDonations(
                        Array.isArray(data) ? data : []
                    )
                });
            } catch (error) {
                toast.error("Failed to fetch volunteer tasks.");
            } finally {
                set({ loading: false });
            }
        },

        /* ================= WASTE PARTNER (NEW) ================= */

        /* ---- FETCH EXPIRED DONATIONS ---- */
        fetchExpiredDonations: async function() {
            set({ loading: true });
            try {
                const data = await donationService.getExpiredDonations();
                set({
                    expiredDonations: enrichAndSortDonations(
                        Array.isArray(data) ? data : []
                    )
                });
            } catch (error) {
                toast.error("Failed to fetch expired donations.");
            } finally {
                set({ loading: false });
            }
        },

        /* ---- ACCEPT FOR RECYCLING ---- */
        acceptExpiredDonation: async function(donationId) {
            set({ loading: true });
            try {
                await donationService.acceptExpiredDonation(donationId);
                toast.success("Accepted for recycling!");
                await get().fetchExpiredDonations();
            } catch (error) {
                let msg = "Failed to accept for recycling";
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    msg = error.response.data.message;
                }
                toast.error(msg);
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- NGO ACCEPT ---------------- */
        acceptDonation: async function(donationId, volunteerId) {
            set({ loading: true });
            try {
                await donationService.acceptDonation(donationId, volunteerId);
                toast.success("Donation accepted!");
                await get().fetchMyDonations();
            } catch (error) {
                let msg = "Failed to accept donation";
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    msg = error.response.data.message;
                }
                toast.error(msg);
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- VOLUNTEER ACCEPT ---------------- */
        volunteerAcceptTask: async function(donationId) {
            set({ loading: true });
            try {
                await donationService.volunteerAccept(donationId);
                toast.success("Task accepted!");
                await get().fetchVolunteerTasks();
            } catch (error) {
                let msg = "Failed to accept task";
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    msg = error.response.data.message;
                }
                toast.error(msg);
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- CONFIRM PICKUP ---------------- */
        confirmPickup: async function(donationId, qrToken) {
            set({ loading: true });
            try {
                await donationService.confirmPickup(donationId, qrToken);
                toast.success("Pickup confirmed!");
                await get().fetchVolunteerTasks();
                await get().fetchMyDonations();
                return true;
            } catch (error) {
                let msg = "Invalid QR token";
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    msg = error.response.data.message;
                }
                toast.error(msg);
                return false;
            } finally {
                set({ loading: false });
            }
        },

        /* ---------------- DELETE ---------------- */
        deleteDonation: async function(donationId) {
            set({ loading: true });
            try {
                await donationService.deleteDonation(donationId);
                toast.success("Donation deleted!");
                await get().fetchMyDonations();
            } catch (error) {
                let msg = "Failed to delete donation";
                if (
                    error &&
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    msg = error.response.data.message;
                }
                toast.error(msg);
            } finally {
                set({ loading: false });
            }
        }
    };
});