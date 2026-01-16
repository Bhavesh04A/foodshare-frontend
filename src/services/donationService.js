import api from "./api";

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

export const deleteDonation = async(donationId) => {
    const response = await api.delete(`/donations/${donationId}`);
    return response.data;
};

export const getAvailableDonations = async(pin, type) => {
    const response = await api.get("/donations/available", {
        params: { pin, type }
    });
    return response.data;
};

export const getUserDonations = async() => {
    const response = await api.get("/donations/mine");
    return response.data;
};

export const acceptDonation = async(donationId, volunteerId = null) => {
    const response = await api.post(
        `/donations/${donationId}/accept`, { volunteerId }
    );
    return response.data;
};

export const confirmPickup = async(donationId, qrToken) => {
    const response = await api.post(
        `/donations/${donationId}/confirm`, { qrToken }
    );
    return response.data;
};

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

/* ================= WASTE PARTNER (ONLY ADDITIONS) ================= */

export const getExpiredDonations = async() => {
    const response = await api.get("/waste/expired");
    return response.data;
};

export const acceptForRecycling = async(donationId) => {
    const response = await api.post(`/waste/${donationId}/accept`);
    return response.data;
};

export const confirmRecyclePickup = async(donationId, qrToken) => {
    const response = await api.post(
        `/waste/${donationId}/confirm`, { qrToken }
    );
    return response.data;
};