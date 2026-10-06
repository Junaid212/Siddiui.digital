import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { api } from "../../api";
import {
  BOOK_METADATA,
  EXAMPLE_QUESTIONS,
  matchPrincipleInKnowledgeBase
} from "./knowledgeEngine";
import "./AskSid.css";

export default function AskSid() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [demoSessionId, setDemoSessionId] = useState("");

  // Configuration state
  const [config, setConfig] = useState({
    askSidEnabled: true,
    publicDemoEnabled: true,
    demoQuestionLimit: 1,
    upgradeCtaText: "Unlock Full Ask SID with the Digital Companion Edition ($49.99)",
    upgradeUrl: "/publications/marketing-reclassified-principle-first-approach",
    advisoryCtaEnabled: true,
    advisoryUrl: "/consultation"
  });

  // Access and entitlement state
  const [access, setAccess] = useState({
    authenticated: false,
    hasCompanionAccess: false,
    hasOnlineAccess: false,
    accessLevel: "none", // "full" | "online_only" | "none"
    demoAvailable: true,
    demoQuestionsRemaining: 1
  });

  // Client-side testing simulator override (allows reviewer to test all 3 states easily)
  const [simulatorTier, setSimulatorTier] = useState(null); // null | "companion" | "online" | "visitor"
  const [showSimulator, setShowSimulator] = useState(false);

  const [loadingAccess, setLoadingAccess] = useState(true);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      try {
        return JSON.parse(savedMode);
      } catch (e) {
        return false;
      }
    }
    return (
      document.documentElement.getAttribute("data-theme") === "dark" ||
      document.body.classList.contains("dark-mode")
    );
  });

  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.body.classList.contains("dark-mode") ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem("darkMode") || "false");
          } catch (e) {
            return false;
          }
        })();
      setDarkMode(isDark);
    };

    checkTheme();
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.body, { attributes: true });
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener("themeChange", checkTheme);
    window.addEventListener("storage", checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", checkTheme);
      window.removeEventListener("storage", checkTheme);
    };
  }, []);

  // Conversation state
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoExhausted, setDemoExhausted] = useState(false);

  const mainInputRef = useRef(null);
  const followUpInputRef = useRef(null);
  const conversationEndRef = useRef(null);

  // Initialize demo session ID
  useEffect(() => {
    let sid = sessionStorage.getItem("ask_sid_session_id");
    if (!sid) {
      sid = `demo_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("ask_sid_session_id", sid);
    }
    setDemoSessionId(sid);
  }, []);

  // Supabase Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check access whenever token or demoSessionId changes
  useEffect(() => {
    let isMounted = true;
    async function loadConfigAndAccess() {
      try {
        const [cfgData, accData] = await Promise.all([
          api.getAskSidConfig().catch(() => null),
          api.checkAskSidAccess(token, demoSessionId).catch(() => null)
        ]);

        if (isMounted) {
          if (cfgData) setConfig((prev) => ({ ...prev, ...cfgData }));
          if (accData) {
            setAccess(accData);
            if (accData.accessLevel !== "full" && accData.demoQuestionsRemaining === 0) {
              setDemoExhausted(true);
            }
          }
        }
      } catch (e) {
        console.warn("Could not verify Ask SID status:", e.message);
      } finally {
        if (isMounted) setLoadingAccess(false);
      }
    }

    if (demoSessionId) {
      loadConfigAndAccess();
    }
  }, [token, demoSessionId]);

  // Check direct Supabase orders whenever user logs in
  useEffect(() => {
    async function checkUserPurchases() {
      if (!user?.email) return;
      try {
        const userEmail = user.email.toLowerCase().trim();
        const { data: userOrders, error } = await supabase
          .from("orders")
          .select("*")
          .or(`email.ilike.${userEmail},user_id.eq.${user.id}`)
          .in("status", ["paid", "successful"]);

        if (!error && userOrders && userOrders.length > 0) {
          let hasCompanion = false;
          let hasOnline = false;

          for (const ord of userOrders) {
            const bName = String(ord.book_name || ord.product_name || "").toLowerCase();
            const pId = String(ord.product_id || "").toLowerCase();
            const amt = Number(ord.amount || 0);

            if (
              bName.includes("companion") ||
              pId === "04b84648-3609-4b31-9ded-2486bacf1e74" ||
              amt >= 40 ||
              (bName.includes("marketing reclassified") && !bName.includes("online"))
            ) {
              hasCompanion = true;
            } else if (
              bName.includes("online") ||
              pId === "prod_online_reading_001" ||
              ord.access_type === "online" ||
              (amt >= 15 && amt < 40)
            ) {
              hasOnline = true;
            }
          }

          setAccess((prev) => ({
            ...prev,
            authenticated: true,
            hasCompanionAccess: hasCompanion || prev.hasCompanionAccess,
            hasOnlineAccess: hasOnline || prev.hasOnlineAccess,
            accessLevel: hasCompanion ? "full" : hasOnline ? "online_only" : prev.accessLevel
          }));
        }
      } catch (e) {
        console.warn("Direct order entitlement check notice:", e.message);
      }
    }

    checkUserPurchases();
  }, [user]);

  // Scroll to conversation end on new messages
  useEffect(() => {
    if (conversation.length > 0) {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, loading]);

  // Derived access considering simulator override
  const effectiveAccess = (() => {
    if (simulatorTier === "companion") {
      return {
        isFull: true,
        isOnline: false,
        isDemoActive: false,
        demoExhausted: false,
        label: "Digital Companion Edition ($49.99) — Full Access Active"
      };
    }
    if (simulatorTier === "online") {
      return {
        isFull: false,
        isOnline: true,
        isDemoActive: !demoExhausted,
        demoExhausted: demoExhausted,
        label: "Online Edition ($20) — Limited Demo Active"
      };
    }
    if (simulatorTier === "visitor") {
      return {
        isFull: false,
        isOnline: false,
        isDemoActive: !demoExhausted,
        demoExhausted: demoExhausted,
        label: "Public Visitor — Limited Demo Active"
      };
    }

    const isFull = access.hasCompanionAccess || access.accessLevel === "full";
    const isOnline = access.hasOnlineAccess || access.accessLevel === "online_only";
    const isDemoActive = !isFull && access.demoAvailable && !demoExhausted;

    return {
      isFull,
      isOnline,
      isDemoActive,
      demoExhausted: demoExhausted || (!isFull && access.demoQuestionsRemaining === 0),
      label: isFull
        ? "Digital Companion Edition ($49.99) — Full Access Active"
        : isOnline
        ? "Online Edition ($20) — Limited Demo Active"
        : "Public Visitor — Limited Demo"
    };
  })();

  const handleStartConversation = () => {
    mainInputRef.current?.focus();
    mainInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href }
      });
    } catch (e) {
      console.error("Sign-in error:", e);
    }
  };

  const handleSelectExample = (exampleText) => {
    setQuery(exampleText);
    setError("");
    // Focus the input and scroll into view
    if (mainInputRef.current) {
      mainInputRef.current.focus();
    } else if (followUpInputRef.current) {
      followUpInputRef.current.focus();
    }
  };

  // Submit a question (either from main input or from follow-up chip)
  const submitQuestion = async (cleanQuery) => {
    if (!cleanQuery || loading) return;

    // Check if user is locked out
    if (!effectiveAccess.isFull && effectiveAccess.demoExhausted) {
      setError("Your complimentary demonstration question has been used. Please upgrade to the Digital Companion Edition ($49.99) for full, unlimited Ask SID access.");
      const upgradeEl = document.getElementById("asksid-upgrade-card");
      if (upgradeEl) upgradeEl.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setError("");
    setLoading(true);

    const userMsg = { role: "user", text: cleanQuery, timestamp: new Date() };
    setConversation((prev) => [...prev, userMsg]);
    setQuery("");

    try {
      const historyPayload = conversation.map((c) => ({
        role: c.role,
        content: c.role === "user" ? c.text : c.answer?.perspective || ""
      }));

      let answerData = null;
      let isDemoResult = false;
      let remainingCount = 0;

      // Try backend endpoint first
      try {
        const res = await api.askSidQuestion(
          {
            message: cleanQuery,
            conversationHistory: historyPayload,
            demoSessionId
          },
          token
        );

        if (res && res.answer) {
          answerData = res.answer;
          isDemoResult = !!res.isDemo;
          remainingCount = res.demoQuestionsRemaining || 0;
        }
      } catch (backendErr) {
        console.warn("Backend chat endpoint encountered notice, checking fallback engine:", backendErr.message);

        // If backend explicitly rejected due to demo limit
        if (backendErr.errorType === "demo_limit_reached" || backendErr.errorType === "unauthorized") {
          setDemoExhausted(true);
          setError("You've reached the current demo limit. Unlock Full Ask SID with the Digital Companion Edition ($49.99).");
          setLoading(false);
          return;
        }

        // Fallback to grounded local knowledge engine
        const fallbackAnswer = matchPrincipleInKnowledgeBase(cleanQuery);
        answerData = fallbackAnswer;
        if (!effectiveAccess.isFull) {
          isDemoResult = true;
          remainingCount = 0;
        }
      }

      // If we got an answer from backend but it lacks continueExploring, enrich it from knowledge base
      if (answerData) {
        if (!answerData.continueExploring || answerData.continueExploring.length === 0) {
          const matched = matchPrincipleInKnowledgeBase(cleanQuery);
          if (matched && matched.continueExploring) {
            answerData.continueExploring = matched.continueExploring;
          }
        }

        setConversation((prev) => [
          ...prev,
          { role: "assistant", answer: answerData, timestamp: new Date() }
        ]);

        // If this was a demo question, lock out future queries unless full companion access
        if (isDemoResult && !effectiveAccess.isFull) {
          setDemoExhausted(true);
          setAccess((prev) => ({
            ...prev,
            demoQuestionsRemaining: 0,
            demoAvailable: false
          }));
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong while processing your question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    submitQuestion(query.trim());
  };

  const handleResetConversation = () => {
    setConversation([]);
    setQuery("");
    setError("");
    if (mainInputRef.current) mainInputRef.current.focus();
  };

  const handleResetDemoSession = async () => {
    setDemoExhausted(false);
    setAccess((prev) => ({
      ...prev,
      demoAvailable: true,
      demoQuestionsRemaining: 1
    }));
    try {
      await api.resetAskSidDemo(demoSessionId);
    } catch (e) {}
  };

  return (
    <div className={`asksid-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* ══ TOP BREADCRUMB BAR (Site Standard) ══ */}
      <div className="asksid-breadcrumb-bar">
        <div className="asksid-breadcrumb-container">
          <Link to="/" className="asksid-breadcrumb-link">
            Home
          </Link>
          <span className="asksid-breadcrumb-sep">/</span>
          <Link to="/publications" className="asksid-breadcrumb-link">
            Publications
          </Link>
          <span className="asksid-breadcrumb-sep">/</span>
          <Link
            to={BOOK_METADATA.publicationUrl}
            className="asksid-breadcrumb-link"
          >
            Marketing Reclassified
          </Link>
          <span className="asksid-breadcrumb-sep">/</span>
          <span className="asksid-breadcrumb-current">Ask SID</span>
        </div>
      </div>

      {/* ══ HERO SECTION (Visual Identity: Marketing Reclassified) ══ */}
      <section className="asksid-hero">
        <div className="asksid-hero-inner">
          <div className="asksid-eyebrow">
            <span className="asksid-eyebrow-dot" />
            Digital Companion to Marketing Reclassified
          </div>

          <h1 className="asksid-title">
            Ask <span className="asksid-title-highlight">SID</span>
          </h1>

          <p className="asksid-subtitle">
            A Principle-First Intelligence Companion by M. Q. Siddiqui
          </p>

          <p className="asksid-description">
            Describe your situation in your own words. Ask SID will help you explore your real-world business and marketing challenges strictly through the approved principles of <em>Marketing Reclassified: A Principle-First Approach</em>.
          </p>

          {conversation.length === 0 && (
            <div className="asksid-hero-actions">
              <button
                className="asksid-hero-cta"
                onClick={handleStartConversation}
                id="btn-start-conversation"
              >
                <span>Explore a Challenge</span>
                <i className="fa-solid fa-arrow-down" />
              </button>

              <Link
                to={BOOK_METADATA.publicationUrl}
                className="asksid-hero-secondary-btn"
                id="btn-view-book-details"
              >
                <i className="fa-solid fa-book-open" />
                <span>About the Book</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══ MAIN WORKSPACE CONTAINER ══ */}
      <div className="asksid-main-container">
        {/* ══ ACCESS ENTITLEMENT STATUS BAR ══ */}
        <div className="asksid-status-bar" id="asksid-status-bar">
          <div className="asksid-status-info">
            {effectiveAccess.isFull ? (
              <>
                <span className="asksid-status-pill full">
                  <i className="fa-solid fa-circle-check" /> Full Companion Access
                </span>
                <span className="asksid-status-text">
                  Unlimited conversation access active via your <strong>Digital Companion Edition ($49.99)</strong>.
                </span>
              </>
            ) : effectiveAccess.isOnline ? (
              <>
                <span className="asksid-status-pill online">
                  <i className="fa-solid fa-book-open" /> Online Edition
                </span>
                <span className="asksid-status-text">
                  {effectiveAccess.demoExhausted
                    ? "Online Edition reading active • Complimentary trial inquiry completed"
                    : "Online Edition reading active • 1 complimentary demonstration inquiry available"}
                </span>
              </>
            ) : effectiveAccess.isDemoActive ? (
              <>
                <span className="asksid-status-pill demo">
                  <i className="fa-solid fa-sparkles" /> Public Trial
                </span>
                <span className="asksid-status-text">
                  You have 1 complimentary demonstration inquiry to explore Ask SID.
                </span>
              </>
            ) : (
              <>
                <span className="asksid-status-pill locked">
                  <i className="fa-solid fa-lock" /> Access Required
                </span>
                <span className="asksid-status-text">
                  Trial completed. Full Ask SID access is included with the <strong>Digital Companion Edition ($49.99)</strong>.
                </span>
              </>
            )}
          </div>

          <div className="asksid-status-actions">
            {!user ? (
              <button
                className="asksid-status-btn"
                onClick={handleGoogleSignIn}
                id="btn-asksid-signin"
              >
                <i className="fa-brands fa-google" style={{ marginRight: 6 }} /> Sign In
              </button>
            ) : !effectiveAccess.isFull ? (
              <Link
                to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                className="asksid-status-btn upgrade"
                id="btn-asksid-upgrade"
              >
                Upgrade to Companion ($49.99) →
              </Link>
            ) : (
              <span className="asksid-verified-badge">
                <i className="fa-solid fa-shield-halved" /> Verified Reader
              </span>
            )}

            {/* Subtle Dev/Client Tier Simulator Toggle */}
            <button
              type="button"
              className="asksid-sim-toggle-btn"
              onClick={() => setShowSimulator((s) => !s)}
              title="Test all 3 access states as specified in client requirements"
            >
              <i className="fa-solid fa-sliders" />
              <span>Preview Tiers</span>
            </button>
          </div>
        </div>

        {/* ══ CLIENT/REVIEWER SIMULATOR MODAL BAR ══ */}
        {showSimulator && (
          <div className="asksid-simulator-bar">
            <div className="asksid-sim-label">
              <i className="fa-solid fa-vial-circle-check" />
              <strong>Access Tier Switcher (Reviewer Tool):</strong>
            </div>
            <div className="asksid-sim-options">
              <button
                className={`asksid-sim-pill ${simulatorTier === "companion" ? "active" : ""}`}
                onClick={() => setSimulatorTier("companion")}
              >
                Full Companion ($49.99)
              </button>
              <button
                className={`asksid-sim-pill ${simulatorTier === "online" ? "active" : ""}`}
                onClick={() => setSimulatorTier("online")}
              >
                Online Edition ($20)
              </button>
              <button
                className={`asksid-sim-pill ${simulatorTier === "visitor" ? "active" : ""}`}
                onClick={() => setSimulatorTier("visitor")}
              >
                Public Visitor (Trial)
              </button>
              <button
                className="asksid-sim-pill reset"
                onClick={() => {
                  setSimulatorTier(null);
                  handleResetDemoSession();
                }}
              >
                Reset Demo Counter
              </button>
            </div>
          </div>
        )}

        {/* ══ ERROR BANNER ══ */}
        {error && (
          <div className="asksid-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" />
            <div className="asksid-error-content">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ══ MAIN INPUT COMPOSER (Prominent Primary Area) ══ */}
        {conversation.length === 0 && (
          <div className="asksid-input-card">
            <div className="asksid-card-top-accent" />
            <form onSubmit={handleFormSubmit}>
              <div className="asksid-textarea-wrapper">
                <textarea
                  ref={mainInputRef}
                  className="asksid-textarea"
                  placeholder="What marketing or business challenge are you facing?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleFormSubmit();
                    }
                  }}
                  disabled={loading || (!effectiveAccess.isFull && effectiveAccess.demoExhausted)}
                  rows={4}
                  id="asksid-input-textarea"
                />
              </div>

              <div className="asksid-input-footer">
                <p className="asksid-input-support-text">
                  <i className="fa-solid fa-feather-pointed" style={{ marginRight: 6, color: "var(--sid-red-light)" }} />
                  Describe your situation in your own words. Ask SID will help you explore it through the principles of Marketing Reclassified.
                </p>

                <button
                  type="submit"
                  className="asksid-submit-btn"
                  disabled={loading || !query.trim() || (!effectiveAccess.isFull && effectiveAccess.demoExhausted)}
                  id="btn-submit-question"
                >
                  {loading ? (
                    <>
                      <span className="asksid-spinner" />
                      <span>Thinking…</span>
                    </>
                  ) : (
                    <>
                      <span>Explore Challenge</span>
                      <i className="fa-solid fa-arrow-right" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══ 4–5 CLICKABLE EXAMPLE QUESTIONS ══ */}
        {conversation.length === 0 && (
          <div className="asksid-examples-wrap">
            <div className="asksid-examples-label">
              <i className="fa-solid fa-lightbulb" />
              <span>Or begin by selecting a common strategic dilemma:</span>
            </div>
            <div className="asksid-examples-grid">
              {EXAMPLE_QUESTIONS.map((qText, idx) => (
                <button
                  key={idx}
                  className="asksid-example-pill"
                  onClick={() => handleSelectExample(qText)}
                  id={`btn-example-${idx}`}
                  type="button"
                >
                  <div className="asksid-example-left">
                    <span className="asksid-example-number">0{idx + 1}</span>
                    <span className="asksid-example-text">{qText}</span>
                  </div>
                  <i className="fa-solid fa-arrow-right asksid-example-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ ACTIVE CONVERSATION THREAD VIEW ══ */}
        {conversation.length > 0 && (
          <div className="asksid-conversation-container" id="asksid-conversation-list">
            <div className="asksid-conversation-header">
              <div className="asksid-conversation-title">
                <span className="asksid-pulse-dot" />
                <span>Active Exploration • Grounded in Marketing Reclassified</span>
              </div>
              <button
                className="asksid-new-conversation-btn"
                onClick={handleResetConversation}
                type="button"
                title="Start a fresh inquiry"
              >
                <i className="fa-solid fa-rotate-right" />
                <span>New Conversation</span>
              </button>
            </div>

            {conversation.map((msg, index) => (
              <div key={index} className="asksid-message-group">
                {msg.role === "user" ? (
                  /* ── User Query Bubble ── */
                  <motion.div
                    className="asksid-user-bubble"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="asksid-user-header">
                      <span className="asksid-user-badge">
                        <i className="fa-solid fa-user" /> Your Challenge
                      </span>
                      <span className="asksid-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="asksid-user-text">{msg.text}</p>
                  </motion.div>
                ) : (
                  /* ── Ask SID Structured Answer Format ── */
                  <motion.div
                    className="asksid-response-card"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Small “Grounded in Marketing Reclassified” Indicator */}
                    <div className="asksid-response-top-bar">
                      <div className="asksid-grounded-badge">
                        <i className="fa-solid fa-shield-halved" />
                        <span>Grounded in Marketing Reclassified</span>
                      </div>
                      <span className="asksid-author-citation">
                        Frameworks by M. Q. Siddiqui
                      </span>
                    </div>

                    {/* Section 1: Understanding Your Situation */}
                    {msg.answer?.understanding && (
                      <div className="asksid-section section-understanding">
                        <h3 className="asksid-section-title">
                          <i className="fa-solid fa-compass" />
                          <span>Understanding Your Situation</span>
                        </h3>
                        <p className="asksid-section-content">{msg.answer.understanding}</p>
                      </div>
                    )}

                    {/* Section 2: Marketing Reclassified Perspective */}
                    {msg.answer?.perspective && (
                      <div className="asksid-section section-perspective">
                        <h3 className="asksid-section-title">
                          <i className="fa-solid fa-book-open" />
                          <span>Marketing Reclassified Perspective</span>
                        </h3>
                        <div className="asksid-perspective-quote">
                          <p className="asksid-section-content">{msg.answer.perspective}</p>
                        </div>
                      </div>
                    )}

                    {/* Section 3: Questions to Consider */}
                    {msg.answer?.questionsToConsider && msg.answer.questionsToConsider.length > 0 && (
                      <div className="asksid-section section-questions">
                        <h3 className="asksid-section-title">
                          <i className="fa-solid fa-circle-question" />
                          <span>Questions to Consider</span>
                        </h3>
                        <ul className="asksid-questions-list">
                          {msg.answer.questionsToConsider.map((qItem, qIdx) => (
                            <li key={qIdx} className="asksid-question-item">
                              <span className="asksid-question-bullet">{qIdx + 1}</span>
                              <span className="asksid-question-text">{qItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section 4: Possible Direction */}
                    {msg.answer?.possibleDirection && (
                      <div className="asksid-section section-direction">
                        <h3 className="asksid-section-title">
                          <i className="fa-solid fa-arrow-trend-up" />
                          <span>Possible Direction</span>
                        </h3>
                        <div className="asksid-direction-box">
                          <p className="asksid-section-content">{msg.answer.possibleDirection}</p>
                        </div>
                      </div>
                    )}

                    {/* Section 5: Relevant Book Section (Chapter, Section, Page + Link) */}
                    {msg.answer?.relevantBookSection && (
                      <div className="asksid-book-ref-card">
                        <div className="asksid-book-ref-left">
                          <div className="asksid-book-icon-badge">
                            <i className="fa-solid fa-book" />
                          </div>
                          <div className="asksid-book-ref-meta">
                            <span className="asksid-book-ref-label">Relevant Book Section</span>
                            <span className="asksid-book-ref-title">
                              {msg.answer.relevantBookSection.book}
                            </span>
                            <span className="asksid-book-ref-details">
                              <strong>{msg.answer.relevantBookSection.chapter}</strong> • {msg.answer.relevantBookSection.section} ({msg.answer.relevantBookSection.page})
                            </span>
                          </div>
                        </div>

                        <Link
                          to={msg.answer.relevantBookSection.readUrl || BOOK_METADATA.publicationUrl}
                          className="asksid-book-ref-cta"
                          id={`btn-read-book-ref-${index}`}
                        >
                          <span>Read Chapter in Book</span>
                          <i className="fa-solid fa-arrow-right" />
                        </Link>
                      </div>
                    )}

                    {/* Section 6: Continue Exploring (Clickable Follow-Up Questions) */}
                    {msg.answer?.continueExploring && msg.answer.continueExploring.length > 0 && (
                      <div className="asksid-section section-continue">
                        <h3 className="asksid-section-title">
                          <i className="fa-solid fa-route" />
                          <span>Continue Exploring</span>
                        </h3>
                        <p className="asksid-continue-hint">
                          Click any angle below to explore the next layer of this dilemma:
                        </p>
                        <div className="asksid-continue-chips">
                          {msg.answer.continueExploring.map((followUp, fIdx) => (
                            <button
                              key={fIdx}
                              className="asksid-continue-chip"
                              onClick={() => submitQuestion(followUp)}
                              disabled={loading || (!effectiveAccess.isFull && effectiveAccess.demoExhausted)}
                              type="button"
                              id={`btn-continue-chip-${index}-${fIdx}`}
                            >
                              <i className="fa-regular fa-comment-dots" />
                              <span>{followUp}</span>
                              <i className="fa-solid fa-arrow-right chip-arrow" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 7: SID Advisory CTA (STRICTLY CONDITIONAL — Only when deeper analysis is identified) */}
                    {config.advisoryCtaEnabled && msg.answer?.showAdvisoryCta && (
                      <div className="asksid-advisory-callout" id={`asksid-advisory-callout-${index}`}>
                        <div className="asksid-advisory-callout-inner">
                          <div className="asksid-advisory-callout-left">
                            <i className="fa-solid fa-circle-exclamation asksid-advisory-callout-icon" />
                            <span className="asksid-advisory-prompt">
                              This challenge may require deeper analysis
                            </span>
                          </div>
                          <Link
                            to={config.advisoryUrl || "/consultation"}
                            className="asksid-advisory-link"
                            id={`btn-explore-advisory-${index}`}
                          >
                            <span>Explore SID Advisory</span>
                            <i className="fa-solid fa-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}

            {loading && (
              <div className="asksid-loading-indicator">
                <span className="asksid-pulse-dot" />
                <span>SID is examining the challenge through the principles of Marketing Reclassified…</span>
              </div>
            )}

            <div ref={conversationEndRef} />

            {/* ══ FOLLOW-UP COMPOSER AT BOTTOM OF ACTIVE CONVERSATION ══ */}
            {(!effectiveAccess.isFull && effectiveAccess.demoExhausted) ? (
              /* If demo limit reached, show upgrade card */
              <div className="asksid-upgrade-card" id="asksid-upgrade-card">
                <div className="asksid-upgrade-badge">Digital Companion Edition</div>
                <h2 className="asksid-upgrade-title">
                  Unlock Full Ask SID Access
                </h2>
                <p className="asksid-upgrade-sub">
                  Your complimentary demonstration inquiry has concluded. Full Ask SID conversation access, unlimited follow-ups, and complete downloadable PDF publication are included exclusively with the Digital Companion Edition ($49.99).
                </p>

                <div className="asksid-upgrade-price-wrap">
                  <div className="asksid-upgrade-price">
                    $49<span>.99</span>
                  </div>
                  <div className="asksid-upgrade-price-period">
                    One-time purchase • Full Digital Companion Access
                  </div>
                </div>

                <ul className="asksid-upgrade-features">
                  <li>
                    <i className="fa-solid fa-check" /> Full, Unlimited Ask SID Strategic Conversations
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Complete Downloadable Marketing Reclassified (PDF)
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Grounded in all 12 chapters & frameworks by M. Q. Siddiqui
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Contextual book section citations & reader navigation
                  </li>
                </ul>

                <div className="asksid-upgrade-cta-wrap">
                  <Link
                    to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                    className="asksid-upgrade-btn"
                    id="btn-get-digital-companion"
                  >
                    <i className="fa-solid fa-lock-open" />
                    <span>Get Digital Companion Edition ($49.99)</span>
                  </Link>

                  {!user && (
                    <button
                      className="asksid-upgrade-secondary-btn"
                      onClick={handleGoogleSignIn}
                      type="button"
                    >
                      Already purchased? Sign in to verify
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Follow-up Question Composer */
              <div className="asksid-followup-card">
                <form onSubmit={handleFormSubmit}>
                  <div className="asksid-followup-input-wrapper">
                    <textarea
                      ref={followUpInputRef}
                      className="asksid-followup-textarea"
                      placeholder="Ask a follow-up question or explore another dimension of this challenge…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleFormSubmit();
                        }
                      }}
                      disabled={loading}
                      rows={2}
                      id="asksid-followup-textarea"
                    />

                    <button
                      type="submit"
                      className="asksid-followup-send-btn"
                      disabled={loading || !query.trim()}
                      id="btn-submit-followup"
                      title="Send question"
                    >
                      {loading ? (
                        <span className="asksid-spinner small" />
                      ) : (
                        <i className="fa-solid fa-paper-plane" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ══ UPGRADE SECTION (Shown when conversation is empty and user lacks full access) ══ */}
        {conversation.length === 0 && (!effectiveAccess.isFull || effectiveAccess.demoExhausted) && (
          <div className="asksid-upgrade-card" id="asksid-upgrade-card">
            <div className="asksid-upgrade-badge">Digital Companion Edition</div>
            <h2 className="asksid-upgrade-title">
              Unlock Full Ask SID with the Digital Companion Edition
            </h2>
            <p className="asksid-upgrade-sub">
              {effectiveAccess.demoExhausted
                ? "Your complimentary demonstration question has been used. Full Ask SID access is included exclusively with the Digital Companion Edition."
                : "Full Ask SID conversation access, unlimited strategic follow-ups, and downloadable publication access are included with the Digital Companion Edition."}
            </p>

            <div className="asksid-upgrade-price-wrap">
              <div className="asksid-upgrade-price">
                $49<span>.99</span>
              </div>
              <div className="asksid-upgrade-price-period">
                One-time purchase • Full Digital Companion Access
              </div>
            </div>

            <ul className="asksid-upgrade-features">
              <li>
                <i className="fa-solid fa-check" /> Downloadable Marketing Reclassified (Complete PDF)
              </li>
              <li>
                <i className="fa-solid fa-check" /> Full, Unlimited Ask SID Companion Access
              </li>
              <li>
                <i className="fa-solid fa-check" /> Deep Diagnostic Frameworks & Contextual Book Citations
              </li>
              <li>
                <i className="fa-solid fa-check" /> Unrestricted Follow-up Conversations
              </li>
            </ul>

            <div className="asksid-upgrade-cta-wrap">
              <Link
                to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                className="asksid-upgrade-btn"
                id="btn-get-digital-companion-empty"
              >
                <i className="fa-solid fa-lock-open" />
                <span>Get Digital Companion Edition ($49.99)</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
