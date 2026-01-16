import { create } from "zustand";
import * as donationService from "../services/donationService";
import toast from "react-hot-toast";

export const useDonationStore = create((set, get) => ({
    availableDonations: [],
    myDonations: [],
    volunteerTasks: [],
    expiredDonations: [], // ✅ ADDED
    loading: false,

    fetchAvailableDonations: async function(pin, type) {
        set({ loading: true });
        try {
            const data = await donationService.getAvailableDonations(pin, type);
            set({ availableDonations: Array.isArray(data) ? data : [] });
        } catch (error) {
            toast.error("Failed to fetch available donations.");
        } finally {
            set({ loading: false });
        }
    },

    fetchMyDonations: async function() {
        set({ loading: true });
        try {
            const data = await donationService.getUserDonations();
            set({ myDonations: Array.isArray(data) ? data : [] });
        } catch (error) {
            toast.error("Failed to fetch your donations.");
        } finally {
            set({ loading: false });
        }
    },

    fetchVolunteerTasks: async function() {
        set({ loading: true });
        try {
            const data = await donationService.getVolunteerTasks();
            set({ volunteerTasks: Array.isArray(data) ? data : [] });
        } catch (error) {
            toast.error("Failed to fetch volunteer tasks.");
        } finally {
            set({ loading: false });
        }
    },

    /* ---------------- NGO ACCEPT DONATION ---------------- */
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

    /* ---------------- VOLUNTEER ACCEPT TASK ---------------- */
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
    },

    /* ================= WASTE PARTNER (ONLY ADDITIONS) ================= */

    fetchExpiredDonations: async function() {
        set({ loading: true });
        try {
            const data = await donationService.getExpiredDonations();
            set({ expiredDonations: Array.isArray(data) ? data : [] });
        } catch (error) {
            toast.error("Failed to fetch expired donations.");
        } finally {
            set({ loading: false });
        }
    },

    acceptForRecycling: async function(donationId) {
        set({ loading: true });
        try {
            await donationService.acceptForRecycling(donationId);
            toast.success("Accepted for recycling");
            await get().fetchExpiredDonations();
        } catch (error) {
            toast.error("Failed to accept for recycling");
        } finally {
            set({ loading: false });
        }
    },

    confirmRecyclePickup: async function(donationId, qrToken) {
        set({ loading: true });
        try {
            await donationService.confirmRecyclePickup(donationId, qrToken);
            toast.success("Recycled successfully");
            await get().fetchExpiredDonations();
            return true;
        } catch (error) {
            toast.error("Invalid QR token");
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));