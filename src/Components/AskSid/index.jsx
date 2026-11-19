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

const HERO_SHOWCASE_SAMPLES = [
  {
    tag: "Lead Conversion Paradox",
    icon: "fa-solid fa-filter-circle-dollar",
    question: "Our marketing generates consistent leads, but customers aren't converting. What should we examine?",
    answer: "Lead conversion friction is rarely a tactical closing problem. It is an upstream misalignment between promotional promise and operational reality. When campaigns buy superficial attention rather than qualifying genuine buyer intent, trust collapses at the point of commercial commitment.",
    chapter: "Chapter 3: The Illusions of Modern Marketing",
    framework: "Promise-to-Delivery Continuum"
  },
  {
    tag: "Commodity Price Trap",
    icon: "fa-solid fa-tags",
    question: "Our competitors are offering lower prices. Should we reduce ours to protect market share?",
    answer: "A price concession validates the competitor's commodity frame without altering perceived customer value. When you cut prices to survive, you trade organizational sovereignty for temporary transactional volume. Compete on authentic relevance, not desperate pricing parity.",
    chapter: "Chapter 4: The Illusions of Modern Marketing",
    framework: "The Relevance Imperative"
  },
  {
    tag: "Value Drift Diagnostic",
    icon: "fa-solid fa-compass-drafting",
    question: "How do we know whether our core value proposition is still relevant?",
    answer: "Value drift occurs silently when internal operational momentum replaces outward customer empathy. If leadership cannot explicitly articulate how customer problems have evolved over the last 18 months, your proposition has already begun decaying.",
    chapter: "Chapter 7: The Adaptive Value Framework",
    framework: "The Value Drift Index"
  }
];

export default function AskSid() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [demoSessionId, setDemoSessionId] = useState("");
  const [activeHeroTab, setActiveHeroTab] = useState(0);
  const [authReady, setAuthReady] = useState(false);

  // Configuration state
  const [config, setConfig] = useState({
    askSidEnabled: true,
    publicDemoEnabled: true,
    demoQuestionLimit: 1,
    upgradeCtaText: "Unlock Full Ask SID with the Digital Companion Edition ($49.99)",
    upgradeUrl: "/publications/marketing-reclassified",
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
    let isMounted = true;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;

        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        setAuthReady(true);
      })
      .catch((error) => {
        console.warn("Could not restore authentication session:", error);
        if (isMounted) setAuthReady(true);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setAuthReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);


  
  // Check access after authentication and demo session are initialized
  useEffect(() => {
    let isCurrent = true;

    async function loadConfigAndAccess() {
      setLoadingAccess(true);

      try {
        const [cfgData, accData] = await Promise.all([
          api.getAskSidConfig().catch(() => null),
          api.checkAskSidAccess(token, demoSessionId).catch(() => null)
        ]);

        if (!isCurrent) return;

        if (cfgData) {
          setConfig((prev) => ({ ...prev, ...cfgData }));
        }

        if (accData) {
          setAccess(accData);

          const hasFullAccess =
            accData.hasCompanionAccess ||
            accData.accessLevel === "full";

          const remaining = Number(accData.demoQuestionsRemaining);

          const isExhausted =
            !hasFullAccess &&
            (
              accData.demoAvailable === false ||
              (Number.isFinite(remaining) && remaining <= 0)
            );

          // Explicitly update both true and false states
          setDemoExhausted(isExhausted);
        }
      } catch (error) {
        console.warn("Could not verify Ask SID status:", error.message);
      } finally {
        if (isCurrent) {
          setLoadingAccess(false);
        }
      }
    }

    if (authReady && demoSessionId) {
      loadConfigAndAccess();
    }

    return () => {
      isCurrent = false;
    };
  }, [authReady, token, demoSessionId]);


  // (Entitlements are decided by the server and returned by /ask-sid/access above. The page no longer reads the orders table to guess them.)


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
    // New server: an Online Reading customer has no Ask SID and no demo, only the upgrade message. Companion access that has
    // ended (12 months) or whose allowance is spent is shown as such by the status bar.
    const onlineLocked = access.edition === "online";
    const isDemoActive = false; // the free demo was removed: only Digital Companion owners can ask

    return {
      isFull,
      isOnline,
      onlineLocked,
      isDemoActive,
      demoExhausted: !isFull,
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
        options: {
          redirectTo: window.location.href,
          scopes: "openid email profile",
        }
      });
    } catch (e) {
      console.error("Sign-in error:", e);
    }
  };

  const handleSelectExample = (exampleText) => {
    setQuery(exampleText);
    setError("");
    // Focus the input and scroll into view smoothly
    setTimeout(() => {
      if (mainInputRef.current) {
        mainInputRef.current.focus();
        mainInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (followUpInputRef.current) {
        followUpInputRef.current.focus();
        followUpInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  // Submit a question (either from main input or from follow-up chip)
  const submitQuestion = async (cleanQuery) => {
    if (!cleanQuery || loading) return;

    // Check if user is locked out
    if (!effectiveAccess.isFull && effectiveAccess.demoExhausted) {
      setError(effectiveAccess.onlineLocked
        ? "Ask SID is available exclusively with the Digital Companion Edition. Upgrade your edition to unlock your AI book companion."
        : token
          ? "Ask SID is available with the Digital Companion Edition. Please upgrade to unlock it."
          : "Ask SID is available to Digital Companion owners. Please sign in with the account you purchased with.");
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
        content: c.role === "user" ? c.text : c.answer?.text || c.answer?.perspective || ""
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
          // Keep the visible allowance in step with what the server just counted.
          if (res.usage && res.usage.charged) {
            setAccess((prev) => ({
              ...prev,
              allowance: prev.allowance
                ? {
                    ...prev.allowance,
                    dailyRemaining: res.usage.dailyRemaining,
                    totalRemaining: res.usage.totalRemaining,
                    dailyUsed: prev.allowance.dailyLimit - res.usage.dailyRemaining,
                    totalUsed: prev.allowance.totalLimit - res.usage.totalRemaining
                  }
                : prev.allowance
            }));
          }
        }
      } catch (backendErr) {
        console.warn("Backend chat endpoint encountered notice:", backendErr.message);
        const type = backendErr.errorType;

        // The server decides access and limits. Every decision it makes is shown as it is, never worked around locally.
        if (type === "demo_limit_reached" || type === "unauthorized") {
          setDemoExhausted(true);
          setError(backendErr.message || "You've reached the current demo limit. Unlock Ask SID with the Digital Companion Edition.");
          setLoading(false);
          return;
        }
        if (type === "upgrade_required") {
          setAccess((prev) => ({ ...prev, edition: "online", hasOnlineAccess: true, hasCompanionAccess: false, accessLevel: "online_only" }));
          setError(backendErr.message);
          setLoading(false);
          return;
        }
        if (["daily_limit", "total_limit", "expired", "revoked", "session", "message_too_long", "rate_limited", "service_unavailable"].includes(type)) {
          if (type === "daily_limit") setAccess((prev) => (prev.allowance ? { ...prev, allowance: { ...prev.allowance, dailyRemaining: 0 } } : prev));
          if (type === "total_limit") setAccess((prev) => (prev.allowance ? { ...prev, allowance: { ...prev.allowance, totalRemaining: 0 } } : prev));
          setError(backendErr.message || "Ask SID could not answer right now.");
          setLoading(false);
          return;
        }

        // Only a visitor trying the public demo may fall back to the on-page engine when the server cannot be reached.
        // A signed-in customer is never given unmetered answers because a request failed.
        // No local answers for anyone: the free demo was removed.
        setError("Ask SID is temporarily unavailable. Please try again in a moment. This question was not counted.");
        setLoading(false);
        return;
      }

      // If we got an answer from the legacy backend but it lacks continueExploring, enrich it from knowledge base.
      // (The new answer format has no follow-up suggestions: Ask SID answers, it does not coach.)
      if (answerData) {
        if (!answerData.text && (!answerData.continueExploring || answerData.continueExploring.length === 0)) {
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
          <div className="asksid-breadcrumb-sep">/</div>
          <Link to="/publications" className="asksid-breadcrumb-link">
            Publications
          </Link>
          <div className="asksid-breadcrumb-sep">/</div>
          <Link
            to={BOOK_METADATA.publicationUrl}
            className="asksid-breadcrumb-link"
          >
            Marketing Reclassified
          </Link>
          <div className="asksid-breadcrumb-sep">/</div>
          <div className="asksid-breadcrumb-current">Ask SID</div>
        </div>
      </div>

      {/* ══ HERO SECTION (Visual Identity: Marketing Reclassified) ══ */}
      {conversation.length === 0 ? (
        <section className="asksid-hero">
          {/* Ambient Lighting Orbs & Grid */}
          <div className="asksid-hero-glow asksid-hero-glow-1" />
          <div className="asksid-hero-glow asksid-hero-glow-2" />
          <div className="asksid-hero-grid-pattern" />

          <div className="asksid-hero-inner">
            <div className="asksid-hero-layout">
              {/* ── LEFT COLUMN: Core Narrative, Author Credential & Actions ── */}
              <div className="asksid-hero-content">
                <div className="asksid-eyebrow-row">
                  <div className="asksid-eyebrow">
                    <span className="asksid-eyebrow-dot" />
                    <span>Digital Companion to Marketing Reclassified</span>
                  </div>
                  {/* <span className="asksid-canon-badge">
                    <i className="fa-solid fa-shield-halved" /> Grounded in Canon
                  </span> */}
                </div>

                <h1 className="asksid-title">
                  Ask <span className="asksid-title-highlight">SID</span>
                </h1>

                <p className="asksid-subtitle">
                  YOUR AI COMPANION TO MARKETING RECLASSIFIED
                  
                </p>

                {/* Author Credential Badge */}
                <div className="asksid-author-chip">
                  <img
                    src="/assets/images/img/M.Q.Siddiqui.webp"
                    alt="M. Q. Siddiqui"
                    className="asksid-author-thumb"
                  />
                  <div className="asksid-author-text">
                    <span className="asksid-author-name">By M. Q. Siddiqui</span>
                    <span className="asksid-author-role">Author of <em>Marketing Reclassified</em></span>
                  </div>
                </div>

                <p className="asksid-description">
                   Describe your business or marketing challenge in your own words. Ask SID explores it through the frameworks and principles of <em>Marketing Reclassified:  From Promotion to Governed Strategic Intelligence</em>
                </p>

                {/* Trust & Methodology Pillars */}
                {/* <div className="asksid-hero-pillars">
                  <div className="asksid-pillar-item">
                    <div className="asksid-pillar-icon">
                      <i className="fa-solid fa-bullseye" />
                    </div>
                    <div className="asksid-pillar-text">
                      <strong>Diagnostic Precision</strong>
                      <span>Addresses root causes upstream</span>
                    </div>
                  </div>
                  <div className="asksid-pillar-item">
                    <div className="asksid-pillar-icon">
                      <i className="fa-solid fa-book-bookmark" />
                    </div>
                    <div className="asksid-pillar-text">
                      <strong>Book Citations</strong>
                      <span>Direct chapter & framework links</span>
                    </div>
                  </div>
                  <div className="asksid-pillar-item">
                    <div className="asksid-pillar-icon">
                      <i className="fa-solid fa-scale-balanced" />
                    </div>
                    <div className="asksid-pillar-text">
                      <strong>Strategic Grounding</strong>
                      <span>Beyond transactional myopia</span>
                    </div>
                  </div>
                </div> */}

                {/* Hero CTAs */}
                <div className="asksid-hero-actions">
                  <button
                    className="asksid-hero-cta"
                    onClick={handleStartConversation}
                    id="btn-start-conversation"
                  >
                    <i className="fa-solid fa-sparkles" />
                    <span>Explore a Challenge</span>
                    <i className="fa-solid fa-arrow-down" />
                  </button>

                  <Link
                    to={BOOK_METADATA.publicationUrl}
                    className="asksid-hero-secondary-btn"
                    id="btn-view-book-details"
                  >
                    <i className="fa-solid fa-book-open" />
                    <span>About the Book </span>
                  </Link>
                </div>
              </div>
              </div>
            </div>
        </section>
      ) : (
        /* Compact Header when in active conversation */
        <section className="asksid-hero asksid-hero--compact">
          <div className="asksid-hero-compact-inner">
            <div className="asksid-compact-left">
              <span className="asksid-compact-dot" />
              <div>
                <h1 className="asksid-compact-title">
                  Ask <span className="asksid-title-highlight">SID</span>
                  <span className="asksid-compact-sub">Active Exploration • Grounded in Marketing Reclassified</span>
                </h1>
              </div>
            </div>
            <div className="asksid-compact-right">
              <button
                className="asksid-compact-new-btn"
                onClick={handleResetConversation}
                type="button"
                id="btn-compact-new-conversation"
              >
                <i className="fa-solid fa-rotate-right" />
                <span>New Inquiry</span>
              </button>
              <Link
                to={BOOK_METADATA.publicationUrl}
                className="asksid-compact-book-btn"
              >
                <i className="fa-solid fa-book-open" />
                <span>About Book</span>
              </Link>
            </div>
          </div>
        </section>
      )}

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
                <span className="asksid-status-text" data-testid="asksid-allowance">
                  {access.allowance ? (
                    <>
                      <strong>{access.allowance.dailyRemaining}</strong> of {access.allowance.dailyLimit} questions left today
                      {" • "}<strong>{access.allowance.totalRemaining}</strong> of {access.allowance.totalLimit} left in total
                      {access.allowance.expiresAt ? <> {" • "}{new Date(access.allowance.expiresAt).getUTCFullYear() >= 2100 ? "no end date" : `access until ${new Date(access.allowance.expiresAt).toISOString().slice(0, 10)}`}</> : null}
                      {access.allowance.launchOffer ? " • launch offer" : ""}
                    </>
                  ) : (
                    <>Access active via your <strong>Digital Companion Edition</strong>.</>
                  )}
                </span>
              </>
            ) : effectiveAccess.isOnline ? (
              <>
                <span className="asksid-status-pill online">
                  <i className="fa-solid fa-book-open" /> Online Edition
                </span>
                <span className="asksid-status-text" data-testid="asksid-online-note">
                  {effectiveAccess.onlineLocked
                    ? <>Ask SID is available exclusively with the Digital Companion Edition. Upgrade your edition to unlock your AI book companion.{" "}
                        <Link to={config.upgradeUrl || "/publications/marketing-reclassified"} className="asksid-status-upgrade">Upgrade</Link></>
                    : effectiveAccess.demoExhausted
                    ? "Online Edition reading active • Ask SID is part of the Digital Companion Edition"
                    : "Online Edition reading active • Ask SID is part of the Digital Companion Edition"}
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
                  Ask SID is included with the <strong>Digital Companion Edition ($49.99)</strong>. Sign in with the account you purchased with.
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
            ) : null}
            {!user ? (
              <Link to="/login?redirect=/ask-sid" className="asksid-status-btn" id="btn-asksid-signin-email" style={{ marginLeft: 8 }}>
                <i className="fa-solid fa-envelope" style={{ marginRight: 6 }} /> Use email
              </Link>
            ) : !effectiveAccess.isFull ? (
              <Link
                to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                className="asksid-status-btn upgrade"
                id="btn-asksid-upgrade"
              >
                 Unlock Full Ask SID →
              </Link>
            ) : (
              <span className="asksid-verified-badge">
                <i className="fa-solid fa-shield-halved" /> Verified Reader
              </span>
            )}

            {/* Reviewer tier simulator: development builds only (never shown to customers) */}
            {import.meta.env.DEV && (<button
              type="button"
              className="asksid-sim-toggle-btn"
              onClick={() => setShowSimulator((s) => !s)}
              title="Test all 3 access states as specified in client requirements"
            >
              <i className="fa-solid fa-sliders" />
              <span>Preview Tiers</span>
            </button>)}
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
                      <div>Explore Challenge</div>
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

                    {/* New format: a short answer taken only from the book, naming the chapter / concept it comes from */}
                    {msg.answer?.text && (
                      <div className="asksid-section" data-testid="asksid-answer">
                        <p className="asksid-section-content" style={{ whiteSpace: "pre-line" }}>{msg.answer.text}</p>
                        {Array.isArray(msg.answer.sources) && msg.answer.sources.length > 0 && (
                          <p className="asksid-book-ref-details" data-testid="asksid-source">
                            Source: {msg.answer.sources.map((src) => [src.concept, src.chapter].filter(Boolean).join(" — ")).join("; ")}
                          </p>
                        )}
                      </div>
                    )}

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
                            <div className="asksid-book-ref-label">Relevant Book Section</div>
                            <div className="asksid-book-ref-title">
                              {msg.answer.relevantBookSection.book}
                            </div>
                            <div className="asksid-book-ref-details">
                              <strong>{msg.answer.relevantBookSection.chapter}</strong> • {msg.answer.relevantBookSection.section} ({msg.answer.relevantBookSection.page})
                            </div>
                          </div>
                        </div>

                        <Link
                          to={msg.answer.relevantBookSection.readUrl || BOOK_METADATA.publicationUrl}
                          className="asksid-book-ref-cta"
                          id={`btn-read-book-ref-${index}`}
                        >
                          <div>Read Chapter in Book</div>
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

            {/* ══ FOLLOW-UP COMPOSER AT BOTTOM OF ACTIVE CONVERSATION ══ */}
            {(!effectiveAccess.isFull && effectiveAccess.demoExhausted) ? (
              /* If demo limit reached, show upgrade card */
              <div className="asksid-upgrade-card" id="asksid-upgrade-card">
            <div className="asksid-upgrade-badge">Digital Companion Edition</div>
            <h2 className="asksid-upgrade-title">
              Unlock Full Ask SID
            </h2>
            <p className="asksid-upgrade-sub">
              {effectiveAccess.demoExhausted
                ? "Ask SID is included exclusively with the Digital Companion Edition. Sign in with the account you purchased with, or upgrade to unlock it."
                : " Full Ask SID access, the book as your own PDF and the full Companion Pack are included with the Digital Companion Edition."}
            </p>

            <div className="asksid-upgrade-price-wrap">
              <div className="asksid-upgrade-price">
                $49.99
              </div>
              <div className="asksid-upgrade-price-period">
                One-time purchase • Full Digital Companion Access
              </div>
            </div>

            <ul className="asksid-upgrade-features">
              <li>
                <i className="fa-solid fa-check" /> The complete book online, plus your own PDF
              </li>
              <li>
                <i className="fa-solid fa-check" /> Ask SID: 100 questions over 12 months
              </li>
              <li>
                <i className="fa-solid fa-check" /> The full Companion Pack: seven practical tools
              </li>
              <li>
                <i className="fa-solid fa-check" />  Diagnostic questions based on the book's frameworks
              </li>
            </ul>

            <div className="asksid-upgrade-cta-wrap">
              <Link
                to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                className="asksid-upgrade-btn"
                id="btn-get-digital-companion-empty"
              >
                <i className="fa-solid fa-lock-open" />
                <div>Get the Digital Companion Edition</div>
              </Link>
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
        {!loadingAccess &&
          conversation.length === 0 &&
          (!effectiveAccess.isFull || effectiveAccess.demoExhausted) && (
          <div className="asksid-upgrade-card" id="asksid-upgrade-card">
            <div className="asksid-upgrade-badge">Digital Companion Edition</div>
            <h2 className="asksid-upgrade-title">
              Unlock Full Ask SID
            </h2>
            <p className="asksid-upgrade-sub">
              {effectiveAccess.demoExhausted
                ? "Ask SID is included exclusively with the Digital Companion Edition. Sign in with the account you purchased with, or upgrade to unlock it."
                : " Full Ask SID access, the book as your own PDF and the full Companion Pack are included with the Digital Companion Edition."}
            </p>

            <div className="asksid-upgrade-price-wrap">
              <div className="asksid-upgrade-price">
                $49.99
              </div>
              <div className="asksid-upgrade-price-period">
                One-time purchase • Full Digital Companion Access
              </div>
            </div>

            <ul className="asksid-upgrade-features">
              <li>
                <i className="fa-solid fa-check" /> The complete book online, plus your own PDF
              </li>
              <li>
                <i className="fa-solid fa-check" /> Ask SID: 100 questions over 12 months
              </li>
              <li>
                <i className="fa-solid fa-check" /> The full Companion Pack: seven practical tools
              </li>
              <li>
                <i className="fa-solid fa-check" />  Diagnostic questions based on the book's frameworks
              </li>
            </ul>

            <div className="asksid-upgrade-cta-wrap">
              <Link
                to={config.upgradeUrl || BOOK_METADATA.publicationUrl}
                className="asksid-upgrade-btn"
                id="btn-get-digital-companion-empty"
              >
                <i className="fa-solid fa-lock-open" />
                <div>Get the Digital Companion Edition</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
