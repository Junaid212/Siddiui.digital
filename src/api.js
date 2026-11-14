import { supabase } from "./supabaseClient";

const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1");

// Same-origin by default: nginx proxies /api to the customer backend. The old `VITE_API_URL` override pointed production
// builds at https://api.siddiqui.digital, whose TLS certificate is issued for admin.siddiqui.digital only, so every
// browser refused those calls (net::ERR_CERT_COMMON_NAME_INVALID). The override is therefore no longer honoured.
const API_BASE = isLocalhost ? "http://localhost:5000/api" : "/api";

const ADMIN_API_BASE = isLocalhost
    ? "http://localhost:5001"
    : (import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5001");

// Order history and ownership are personal data: the server identifies the customer from the signed-in
// session (bearer token) and ignores any e-mail in the URL. Returns null when nobody is signed in.
const authHeaders = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : null;
    } catch {
        return null;
    }
};

// GET for the signed-in customer. The NEW backend identifies the customer from the session alone, so the request
// carries no e-mail. A PREVIOUS backend answers 400 "email required"; only then is the request repeated once with the
// user's OWN address, so the site keeps working whichever backend version is live (deploy order does not matter).
const authedGet = async (pathname, ownEmail) => {
    const headers = await authHeaders();
    if (!headers) return null;
    let res = await fetch(`${API_BASE}${pathname}`, { headers });
    if (res.status === 400 && ownEmail) {
        const body = await res.clone().json().catch(() => ({}));
        if (/email/i.test(body.error || "")) {
            res = await fetch(`${API_BASE}${pathname}?email=${encodeURIComponent(ownEmail)}`, { headers });
        }
    }
    return res;
};

export const api = {
    // Launch offer settings (banner + Digital Companion button offer) edited in the admin dashboard.
    // The banner and the button share ONE request (cached for 30 s). Resolves to null on any failure.
    getOfferBanner() {
        const now = Date.now();
        if (!api._offerCache || now - api._offerCache.at > 30000) {
            const p = (async () => {
                try {
                    const res = await fetch(`${ADMIN_API_BASE}/api/public/offer-banner`);
                    if (!res.ok) return null;
                    return await res.json();
                } catch {
                    return null;
                }
            })();
            api._offerCache = { at: now, p };
        }
        return api._offerCache.p;
    },

    // Auth
    googleSignIn: (idToken) =>
        fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        }).then((res) => res.json()),

    checkAccountType: (email) =>
        fetch(`${API_BASE}/auth/check-account-type?email=${encodeURIComponent(email)}`)
            .then((res) => res.json())
            .catch(() => ({ exists: false, isGoogle: false })),

    forgotPassword: (email) =>
        fetch(`${API_BASE}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }).then((res) => res.json()),

    // Signed-out visitors have nothing to check; signed-in customers are identified by their session.
    checkOwnership: async (ownEmail) => {
        const none = { owned: false, edition: null, canUpgrade: false };
        try {
            const res = await authedGet("/payment/check-ownership", ownEmail);
            return res && res.ok ? await res.json() : none;
        } catch {
            return none;
        }
    },

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

    // PayPal Orders v2 API
    createPayPalOrder: (data) =>
        fetch(`${API_BASE}/payment/paypal/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `PayPal order creation failed (${res.status})`);
            }
            return json;
        }),

    capturePayPalOrder: (data) =>
        fetch(`${API_BASE}/payment/paypal/capture-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `PayPal order capture failed (${res.status})`);
            }
            return json;
        }),

    // Payhip Account Linking & Claiming
    claimPayhipPurchase: (data) =>
        fetch(`${API_BASE}/payment/claim-payhip-purchase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `Failed to initiate Payhip claim (${res.status})`);
            }
            return json;
        }),

    confirmPayhipClaim: (data) =>
        fetch(`${API_BASE}/payment/confirm-payhip-claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || `Failed to confirm Payhip claim (${res.status})`);
            }
            return json;
        }),

    // Unified Checkout Endpoints (uses PayPal Orders v2 with backward-compatible response)
    createCheckout: (data) =>
        fetch(`${API_BASE}/payment/paypal/create-order`, {
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

    // Multi-item Cart Checkout (PayPal Orders v2)
    createCartCheckout: (data) =>
        fetch(`${API_BASE}/payment/paypal/create-order`, {
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
    getCustomerOrders: async (ownEmail) => {
        const res = await authedGet("/payment/my-orders", ownEmail);
        return res ? res.json() : { error: "Please sign in to view your orders." };
    },

    // Same as getCustomerOrders but also reports the HTTP outcome (used by My Orders).
    listMyOrders: async (ownEmail) => {
        try {
            const res = await authedGet("/payment/my-orders", ownEmail);
            if (!res) return { ok: false, status: 401, data: { error: "Please sign in to view your orders." } };
            return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
        } catch {
            return { ok: false, status: 0, data: { error: "Unable to load orders. Please try again." } };
        }
    },

    // Asks the server for a short-lived link (about 2 minutes) to ONE of the customer's own orders.
    // purpose: "download" | "read".  { ok:true, path } on success; { ok:false, status, error } otherwise.
    createAccessLink: async (orderId, purpose) => {
        try {
            const headers = await authHeaders();
            if (!headers) return { ok: false, status: 401, error: "Please sign in again." };
            const res = await fetch(`${API_BASE}/payment/orders/${encodeURIComponent(orderId)}/access-link`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ purpose }),
            });
            const data = await res.json().catch(() => null);
            return res.ok && data && data.path ? { ok: true, path: data.path } : { ok: false, status: res.status, error: data && data.error };
        } catch {
            return { ok: false, status: 0, error: "Network error." };
        }
    },

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

    // Blog Comments (Approved comments only for public view, moderation-ready)
    getComments: async (blogId) => {
        try {
            const res = await fetch(`${ADMIN_API_BASE}/api/public/blogs/${blogId}/comments`);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.comments)) return data;
            }
        } catch (e) {}
        try {
            const fallbackRes = await fetch(`${API_BASE}/blog/comments/${blogId}`);
            if (fallbackRes.ok) return await fallbackRes.json();
        } catch (e) {}
        return { comments: [] };
    },

    postComment: async (blogIdOrData, maybeData) => {
        let blogId, payload;
        if (typeof blogIdOrData === 'object' && blogIdOrData !== null) {
            blogId = blogIdOrData.blogId || blogIdOrData.blog_id;
            payload = {
                user_name: blogIdOrData.userName || blogIdOrData.user_name || "Reader",
                content: blogIdOrData.content,
                parent_id: blogIdOrData.parentId || blogIdOrData.parent_id || null,
            };
        } else {
            blogId = blogIdOrData;
            payload = {
                user_name: maybeData?.userName || maybeData?.user_name || "Reader",
                content: maybeData?.content,
                parent_id: maybeData?.parentId || maybeData?.parent_id || null,
            };
        }

        try {
            const res = await fetch(`${ADMIN_API_BASE}/api/public/blogs/${blogId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) return data;
            if (data?.error) throw new Error(data.error);
        } catch (adminErr) {
            const fallbackRes = await fetch(`${API_BASE}/blog/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blogId,
                    userName: payload.user_name,
                    content: payload.content,
                    parentId: payload.parent_id
                }),
            });
            return await fallbackRes.json();
        }
    },

    // Public Blogs (from admin backend, includes category/topic)
    getPublicBlogs: (category = null, search = null) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search && search.trim()) params.append('search', search.trim());
        const qs = params.toString() ? `?${params.toString()}` : '';
        const url = `${ADMIN_API_BASE}/api/public/blogs${qs}`;
        return fetch(url).then((res) => res.json());
    },

    getFeaturedBlog: () =>
        fetch(`${ADMIN_API_BASE}/api/public/blogs/featured`).then((res) => res.json()),

    getBlogBySlug: (slug, preview = false) => {
        const query = preview ? '?preview=true' : '';
        return fetch(`${ADMIN_API_BASE}/api/public/blogs/by-slug/${encodeURIComponent(slug)}${query}`).then((res) => res.json());
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
            upgradeUrl: "/publications/marketing-reclassified",
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

    // Online Reading (signed-in customers with the Online Reading edition only; the server enforces it)
    readerRequest: async (pathname, options = {}) => {
        const headers = await authHeaders();
        if (!headers) return { ok: false, status: 401, data: { error: "Please sign in to read online." } };
        try {
            const res = await fetch(`${API_BASE}/reader${pathname}`, {
                ...options,
                headers: { ...headers, ...(options.body ? { "Content-Type": "application/json" } : {}) },
            });
            return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
        } catch {
            return { ok: false, status: 0, data: { error: "Unable to reach the reader. Please try again." } };
        }
    },
    readerAccess: () => api.readerRequest("/access"),
    readerBooks: () => api.readerRequest("/books"),
    readerBook: (bookSlug) => api.readerRequest(`/books/${encodeURIComponent(bookSlug)}`),
    readerChapter: (bookSlug, chapterSlug) => api.readerRequest(`/books/${encodeURIComponent(bookSlug)}/chapters/${encodeURIComponent(chapterSlug)}`),
    saveReaderProgress: (bookSlug, chapterSlug, percent) =>
        api.readerRequest(`/books/${encodeURIComponent(bookSlug)}/progress`, { method: "PUT", body: JSON.stringify({ chapterSlug, percent }) }),

    resetAskSidDemo: (demoSessionId) =>
        fetch(`${API_BASE}/ask-sid/reset-demo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ demoSessionId }),
        }).then((res) => res.json()).catch(() => ({ success: false })),
};

export default api;

