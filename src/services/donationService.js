import api from "./api";

/* ---------------- CREATE DONATION ---------------- */
export const createDonation = async(donationData) => {
    const formData = new FormData();

    for (const key in donationData) {
        if (key === "images" && donationData.images instanceof File) {
            formData.append("image", donationData.images);
        } else if (Array.isArray(donationData[key])) {
            donationData[key].forEach((item) => formData.append(key, item));
        } else {
            formData.append(
                key,
                donationData[key] === undefined ? "" : donationData[key]
            );
        }
    }

    const response = await api.post("/donations", formData);
    return response.data;
};

/* ---------------- DELETE ---------------- */
export const deleteDonation = async(donationId) => {
    const response = await api.delete(`/donations/${donationId}`);
    return response.data;
};

/* ---------------- AVAILABLE ---------------- */
export const getAvailableDonations = async(pin, type) => {
    const response = await api.get("/donations/available", {
        params: { pin, type }
    });
    return response.data;
};

/* ---------------- USER DONATIONS ---------------- */
export const getUserDonations = async() => {
    const response = await api.get("/donations/mine");
    return response.data;
};

/* ---------------- NGO ACCEPT ---------------- */
export const acceptDonation = async(donationId, volunteerId = null) => {
    const response = await api.post(
        `/donations/${donationId}/accept`, { volunteerId }
    );
    return response.data;
};

/* ---------------- CONFIRM PICKUP ---------------- */
export const confirmPickup = async(donationId, qrToken) => {
    const response = await api.post(
        `/donations/${donationId}/confirm`, { qrToken }
    );
    return response.data;
};

/* ---------------- VOLUNTEER ---------------- */
export const getVolunteerTasks = async() => {
    const response = await api.get("/volunteer/tasks");
    return response.data;
};

export const volunteerAccept = async(donationId) => {
    const response = await api.post(
        `/donations/${donationId}/volunteer-accept`, {}
    );
    return response.data;
};

/* ================= WASTE PARTNER (NEW) ================= */

/* ---- FETCH EXPIRED DONATIONS ---- */
export const getExpiredDonations = async() => {
    const response = await api.get("/donations/expired");
    return response.data;
};

/* ---- ACCEPT DONATION FOR RECYCLING ---- */
export const acceptExpiredDonation = async(donationId) => {
    const response = await api.post(
        `/donations/${donationId}/recycle-accept`, {}
    );
    return response.data;
};