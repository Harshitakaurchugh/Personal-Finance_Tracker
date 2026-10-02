import axios from "axios";

const getResponseMessage = (value) => {
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "string") return item;
                if (!item || typeof item !== "object") return "";
                const message = item.defaultMessage || item.message || item.detail;
                return message && item.field ? `${item.field}: ${message}` : message || "";
            })
            .filter(Boolean)
            .join("\n");
    }

    if (!value || typeof value !== "object") {
        return "";
    }

    for (const field of ["message", "detail", "title", "error_description"]) {
        const message = getResponseMessage(value[field]);
        if (message) return message;
    }

    for (const field of ["errors", "fieldErrors", "violations"]) {
        const message = getResponseMessage(value[field]);
        if (message) return message;
    }

    const errorMessage = getResponseMessage(value.error);
    if (errorMessage) return errorMessage;

    const nestedDataMessage = getResponseMessage(value.data);
    if (nestedDataMessage) return nestedDataMessage;

    return Object.entries(value)
        .filter(([field]) => !["timestamp", "status", "path", "instance", "type", "trace"].includes(field))
        .map(([field, fieldValue]) => {
            const message = getResponseMessage(fieldValue);
            return message ? `${field}: ${message}` : "";
        })
        .filter(Boolean)
        .join("\n");
};

export const getApiErrorMessage = (error, fallback = "The request failed.") => {
    const backendMessage = getResponseMessage(error?.response?.data);
    if (backendMessage) return backendMessage;

    return fallback;
};

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach session token to every request
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally: clear session and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            try {
                sessionStorage.removeItem("token");
                window.location.href = "/login";
            } catch (e) {
                // ignore
            }
        }
        return Promise.reject(error);
    }
);

export default api;