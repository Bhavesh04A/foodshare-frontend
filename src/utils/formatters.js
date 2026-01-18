export const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatQuantity = (quantity) => {
    if (!quantity || isNaN(quantity)) return "0 servings";
    return quantity > 1 ? `${quantity} servings` : `${quantity} serving`;
};

/* 🔥 NEW: SAFE HOURS LEFT CALCULATION */
export const getHoursLeft = (expiresAt) => {
    if (!expiresAt) return null;

    const expiry = new Date(expiresAt);
    if (isNaN(expiry.getTime())) return null;

    const now = new Date();
    const diffMs = expiry - now;

    if (diffMs <= 0) return 0;

    return Math.ceil(diffMs / (1000 * 60 * 60));
};