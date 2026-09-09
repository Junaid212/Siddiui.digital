const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost
    ? "http://localhost:5000/api"
    : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

const ADMIN_API_BASE = isLocalhost
    ? "http://localhost:5001"
    : (import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5001");

export const api = {
    // Auth
    googleSignIn: (idToken) =>
        fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        }).then((res) => res.json()),

    // Digital Products & Ebooks
    getProducts: async () => {
        // 1. Try Admin Public Products API (http://localhost:5001/api/public/products)
        try {
            const res = await fetch(`${ADMIN_API_BASE}/api/public/products`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.products && data.products.length > 0) return data;
            }
        } catch (e) {
            // fallback
        }

        // 2. Try Backend Payment Products API (http://localhost:5000/api/payment/products)
        try {
            const res = await fetch(`${API_BASE}/payment/products`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.products && data.products.length > 0) return data;
            }
        } catch (e) {
            // fallback
        }

        // 3. Fallback to /payment/ebooks
        try {
            const res = await fetch(`${API_BASE}/payment/ebooks`);
            if (res.ok) {
                const data = await res.json();
                const list = data.ebooks || data.products || [];
                if (list.length > 0) return { products: list };
            }
        } catch (e) {}

        // 4. In development fallback if remote host failed
        if (!isLocalhost) {
            try {
                const res = await fetch("http://localhost:5001/api/public/products");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.products && data.products.length > 0) return data;
                }
            } catch (e) {}
        }

        return { products: [] };
    },

    getEbooks: () => {
        return api.getProducts();
    },

    getProductById: async (id) => {
        // 1. Try Admin Public Products API
        try {
            const res = await fetch(`${ADMIN_API_BASE}/api/public/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.product) return data;
            }
        } catch (e) {}

        // 2. Try Backend Payment Products API
        try {
            const res = await fetch(`${API_BASE}/payment/products/${id}`);
            if (res.ok) return await res.json();
        } catch (e) {}

        // 3. Find inside getProducts() list
        try {
            const listRes = await api.getProducts();
            if (listRes && listRes.products) {
                const found = listRes.products.find(p => String(p.id) === String(id) || String(p.sku) === String(id));
                if (found) return { product: found };
            }
        } catch (e) {}

        return null;
    },

    createCheckout: (data) =>
        fetch(`${API_BASE}/payment/create-checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    getOrderStatus: (identifier) =>
        fetch(`${API_BASE}/payment/order-status/${identifier}`).then((res) =>
            res.json()
        ),

    requestReplacementLink: (data) =>
        fetch(`${API_BASE}/payment/request-replacement`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    // Consultation
    getAvailableSlots: (date) =>
        fetch(`${API_BASE}/consultation/slots?date=${date || ""}`).then((res) =>
            res.json()
        ),

    bookConsultation: (data) =>
        fetch(`${API_BASE}/consultation/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    // Questionnaire
    getQuestions: () =>
        fetch(`${API_BASE}/questionnaire/questions`).then((res) => res.json()),

    submitVote: (questionId, optionId) =>
        fetch(`${API_BASE}/questionnaire/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, optionId }),
        }).then((res) => res.json()),

    getResults: (questionId) =>
        fetch(`${API_BASE}/questionnaire/results/${questionId}`).then((res) =>
            res.json()
        ),

    // Submit full questionnaire response (profile + all answers)
    submitResponse: (data) =>
        fetch(`${API_BASE}/questionnaire/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    // Get analytics
    getQuestionnaireAnalytics: () =>
        fetch(`${API_BASE}/questionnaire/analytics`).then((res) => res.json()),

    // Get live aggregated results from JSONB (no seeded questions needed)
    getLiveResults: () =>
        fetch(`${API_BASE}/questionnaire/results-live`).then((res) => res.json()),

    // Blog Comments
    getComments: (blogId) =>
        fetch(`${API_BASE}/blog/comments/${blogId}`).then((res) => res.json()),

    postComment: (data) =>
        fetch(`${API_BASE}/blog/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    // Public Blogs (from admin backend, includes category/topic)
    getPublicBlogs: (category = null) => {
        const url = category
            ? `${ADMIN_API_BASE}/api/public/blogs?category=${encodeURIComponent(category)}`
            : `${ADMIN_API_BASE}/api/public/blogs`;
        return fetch(url).then((res) => res.json());
    },

    getPublicCategories: () =>
        fetch(`${ADMIN_API_BASE}/api/public/blogs/categories`).then((res) => res.json()),
};
