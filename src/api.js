const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost
    ? "http://localhost:5000/api"
    : (import.meta.env.VITE_API_URL || "/api");

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
        try {
            const res = await fetch(
                `${ADMIN_API_BASE}/api/public/products`,
                { cache: "no-store" }
            );
            if (!res.ok) throw new Error(`Products API returned ${res.status}`);
            const data = await res.json();
            if (!data || !Array.isArray(data.products)) throw new Error("Invalid products API response");
            return { products: data.products };
        } catch (error) {
            console.error("Failed to load digital products:", error);
            return { products: [] };
        }
    },

    getEbooks: () => api.getProducts(),

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

    // Fetch product by slug (primary method for /publications/:slug routing)
    getProductBySlug: async (slug) => {
        if (!slug) return null;

        // 1. Try Admin Public Products API slug endpoint
        try {
            const res = await fetch(`${ADMIN_API_BASE}/api/public/products/by-slug/${encodeURIComponent(slug)}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.product) return data;
            }
        } catch (e) {}

        // 2. Search inside products list by slug field
        try {
            const listRes = await api.getProducts();
            if (listRes && listRes.products) {
                const found = listRes.products.find(p =>
                    p.slug === slug ||
                    p.slug === slug.toLowerCase()
                );
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
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `Checkout request failed (${res.status})`);
            }
            return json;
        }),

    // Multi-item Cart Checkout
    createCartCheckout: (data) =>
        fetch(`${API_BASE}/payment/create-cart-checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `Cart checkout failed (${res.status})`);
            }
            return json;
        }),

    // Validate Discount Code
    validateDiscount: async (code, subtotal) => {
        try {
            const res = await fetch(`${API_BASE}/payment/validate-discount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.valid) return data;
            if (data && data.error) return data;
        } catch (_) {}

        // Fallback to admin server if running
        try {
            const fallbackRes = await fetch("http://localhost:5001/api/public/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal }),
            });
            return await fallbackRes.json();
        } catch (e) {
            return { valid: false, error: "Unable to verify coupon code." };
        }
    },

    // Customer Order History
    getCustomerOrders: (email) =>
        fetch(`${API_BASE}/payment/my-orders?email=${encodeURIComponent(email)}`).then((res) => res.json()),

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

    // Ask SID — Digital Companion to Marketing Reclassified
    getAskSidConfig: async () => {
        try {
            const res = await fetch(`${API_BASE}/ask-sid/config`);
            if (res.ok) return await res.json();
        } catch (e) {}
        try {
            const fallbackRes = await fetch(`${ADMIN_API_BASE}/api/public/ask-sid-config`);
            if (fallbackRes.ok) return await fallbackRes.json();
        } catch (e) {}
        return {
            askSidEnabled: true,
            publicDemoEnabled: true,
            demoQuestionLimit: 1,
            upgradeCtaText: "Unlock Full Ask SID with the Digital Companion Edition ($49.99)",
            upgradeUrl: "/publications/marketing-reclassified-principle-first-approach",
            advisoryCtaEnabled: true,
            advisoryUrl: "/consultation"
        };
    },

    checkAskSidAccess: async (token, demoSessionId) => {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const query = demoSessionId ? `?demoSessionId=${encodeURIComponent(demoSessionId)}` : "";
        try {
            const res = await fetch(`${API_BASE}/ask-sid/access${query}`, { headers });
            if (res.ok) return await res.json();
        } catch (e) {}
        return {
            authenticated: !!token,
            hasCompanionAccess: false,
            hasOnlineAccess: false,
            accessLevel: "none",
            demoAvailable: true,
            demoQuestionsRemaining: 1
        };
    },

    askSidQuestion: async ({ message, conversationHistory = [], demoSessionId }, token) => {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/ask-sid/chat`, {
            method: "POST",
            headers,
            body: JSON.stringify({ message, conversationHistory, demoSessionId }),
        });
        const data = await res.json();
        if (!res.ok) {
            const err = new Error(data.message || "Failed to process question with Ask SID");
            err.status = res.status;
            err.errorType = data.error;
            err.data = data;
            throw err;
        }
        return data;
    },

    resetAskSidDemo: (demoSessionId) =>
        fetch(`${API_BASE}/ask-sid/reset-demo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ demoSessionId }),
        }).then((res) => res.json()).catch(() => ({ success: false })),
};

export default api;

