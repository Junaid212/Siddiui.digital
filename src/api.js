const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
    // Auth
    googleSignIn: (idToken) =>
        fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        }).then((res) => res.json()),

    // Ebooks
    getEbooks: () =>
        fetch(`${API_BASE}/payment/ebooks`).then((res) => res.json()),

    createCheckout: (data) =>
        fetch(`${API_BASE}/payment/create-checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json()),

    getOrderStatus: (sessionId) =>
        fetch(`${API_BASE}/payment/order-status/${sessionId}`).then((res) =>
            res.json()
        ),

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
};
