import { useState, useEffect, useRef } from "react";
import { CheckCircle, ChevronRight, User, Users, X } from "lucide-react";
import { api } from "../../api";

// ─── 3 Questions ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    key: "q1",
    question: "What is the primary purpose of marketing?",
    options: [
      { text: "Increase sales", score: 1 },
      { text: "Generate profit", score: 1 },
      { text: "Promote products and services", score: 0 },
      { text: "Create customer value", score: 2 },
      { text: "Enable sustainable value creation and strategic decision-making", score: 3 },
    ],
  },
  {
    key: "q2",
    question: "Profit is primarily:",
    options: [
      { text: "The purpose of business", score: 1 },
      { text: "A financial target", score: 1 },
      { text: "A reward for shareholders", score: 0 },
      { text: "An outcome of value creation", score: 3 },
    ],
  },
  {
    key: "q3",
    question: "Marketing should primarily help organizations:",
    options: [
      { text: "Sell more products", score: 1 },
      { text: "Increase market share", score: 1 },
      { text: "Improve advertising effectiveness", score: 0 },
      { text: "Understand their purpose, create value, adapt to change, and make better strategic decisions", score: 3 },
    ],
  },
];

const PROFILE_OPTIONS = [
  "Student",
  "Entrepreneur / Business Owner",
  "Marketing Professional",
  "Sales Professional",
  "Business Executive / Manager",
  "Founder / Startup Owner",
  "Consultant",
  "Academic / Researcher",
  "Freelancer",
  "Other",
];

// ─── Category Classification ────────────────────────────────────────────────
// Max total score: 3+3+3 = 9
const CATEGORIES = [
  {
    name: "Promotional Thinker",
    emoji: "📢",
    color: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    border: "rgba(249,115,22,0.4)",
    bg: "rgba(249,115,22,0.08)",
    description:
      "You view marketing primarily as advertising and promotion — a tool for spreading awareness and drawing attention to products and services.",
    range: [0, 2],
  },
  {
    name: "Sales Thinker",
    emoji: "📈",
    color: "#eab308",
    glow: "rgba(234,179,8,0.25)",
    border: "rgba(234,179,8,0.4)",
    bg: "rgba(234,179,8,0.08)",
    description:
      "You view marketing primarily as a driver of sales and profit growth — a performance function focused on commercial outcomes.",
    range: [3, 5],
  },
  {
    name: "Value Thinker",
    emoji: "💡",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.25)",
    border: "rgba(34,197,94,0.4)",
    bg: "rgba(34,197,94,0.08)",
    description:
      "You view marketing as a process of understanding customers and creating meaningful value — going beyond sales to long-term relationships.",
    range: [6, 7],
  },
  {
    name: "Strategic Value Architect",
    emoji: "🏛️",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.25)",
    border: "rgba(239,68,68,0.4)",
    bg: "rgba(239,68,68,0.08)",
    description:
      "You view marketing as a strategic discipline — one that helps organizations define purpose, create sustainable value, adapt to change, and make better decisions.",
    range: [8, 9],
  },
];

function computeCategory(score) {
  return CATEGORIES.find((c) => score >= c.range[0] && score <= c.range[1]) || CATEGORIES[0];
}

// ─── Animated bar component ─────────────────────────────────────────────────
function OptionBar({ text, pct, color, isHighlight, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 120);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", gap: "8px" }}>
        <span style={{
          fontSize: "0.82rem",
          color: isHighlight ? "#1a1a1a" : "#444",
          fontWeight: isHighlight ? 700 : 400,
          flex: 1,
          lineHeight: 1.4,
        }}>
          {text}
        </span>
        <span style={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: isHighlight ? color : "#888",
          whiteSpace: "nowrap",
          minWidth: "36px",
          textAlign: "right",
        }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: "8px", borderRadius: "9999px", background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          borderRadius: "9999px",
          width: `${width}%`,
          background: isHighlight
            ? `linear-gradient(90deg, ${color}, ${color}cc)`
            : "linear-gradient(90deg, #d1d5db, #9ca3af)",
          transition: "width 0.9s cubic-bezier(0.34,1,0.64,1)",
          boxShadow: isHighlight ? `0 0 8px ${color}88` : "none",
        }} />
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Questionnaire({ onClose }) {
  const [step, setStep] = useState("profile"); // profile | questions | results
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [answers, setAnswers] = useState({});

  // Results state
  const [liveResults, setLiveResults] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [category, setCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Particles
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 12 + Math.random() * 14,
    }))
  );

  // ── Profile step: continue ────────────────────────────────────────
  const handleProfileContinue = () => {
    if (!selectedProfile) return;
    setStep("questions");
  };

  // ── Select an answer ──────────────────────────────────────────────
  const handleSelect = async (optionIndex) => {
    if (showAnswer || selectedOption !== null || animating) return;

    const q = QUESTIONS[currentQ];
    const opt = q.options[optionIndex];

    setSelectedOption(optionIndex);

    const newScore = totalScore + opt.score;
    setTotalScore(newScore);

    const updatedAnswers = {
      ...answers,
      [q.key]: {
        option_text: opt.text,
        question_text: q.question,
        score: opt.score,
        option_index: optionIndex,
      },
    };
    setAnswers(updatedAnswers);

    // Short pause then show "selected" state
    setTimeout(async () => {
      setShowAnswer(true);

      // If last question — submit & fetch results
      if (currentQ === QUESTIONS.length - 1) {
        await handleFinalSubmit(updatedAnswers, newScore);
      } else {
        // Advance to next question after 1.4s
        setTimeout(() => {
          setAnimating(true);
          setTimeout(() => {
            setCurrentQ((q) => q + 1);
            setSelectedOption(null);
            setShowAnswer(false);
            setAnimating(false);
          }, 350);
        }, 1400);
      }
    }, 220);
  };

  // ── Final submit + fetch live results ────────────────────────────
  const handleFinalSubmit = async (finalAnswers, finalScore) => {
    const cat = computeCategory(finalScore);
    setCategory(cat);
    setSubmitting(true);

    // Submit full response
    try {
      await api.submitResponse({
        profile: selectedProfile,
        answers: finalAnswers,
        session_id: sessionStorage.getItem("qs_session") || undefined,
      });
      localStorage.setItem("questionnaireCompleted", "true");
    } catch (e) {
      console.error("Submit error:", e);
    }

    // Fetch live results from JSONB aggregation
    setLoadingResults(true);
    try {
      const data = await api.getLiveResults();
      setLiveResults(data.questions || []);
      setTotalParticipants(data.total_participants || 1);
    } catch (e) {
      console.error("Live results error:", e);
      setTotalParticipants(1);
    } finally {
      setLoadingResults(false);
      setSubmitting(false);
    }

    // Show results screen after brief pause
    setTimeout(() => setStep("results"), 1800);
  };

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + (showAnswer ? 1 : 0)) / QUESTIONS.length) * 100;

  // ── PROFILE STEP ─────────────────────────────────────────────────
  if (step === "profile") {
    return (
      <div style={styles.container}>
        {particles.map((p) => (
          <div key={p.id} style={{ ...styles.particle, left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
        ))}
        <div style={styles.centerer}>
          <div style={styles.card}>
            {/* Icon */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={styles.iconCircle}>
                <User size={26} color="#fff" strokeWidth={1.5} />
              </div>
              <h2 style={styles.heading}>Before we begin…</h2>
              <p style={styles.subheading}>Which best describes your professional background?</p>
            </div>

            {/* Grid of profile options */}
            <div style={styles.profileGrid}>
              {PROFILE_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProfile(p)}
                  style={{
                    ...styles.profileBtn,
                    ...(selectedProfile === p ? styles.profileBtnSelected : {}),
                  }}
                >
                  {selectedProfile === p && (
                    <CheckCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                  )}
                  <span>{p}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleProfileContinue}
              disabled={!selectedProfile}
              style={{ ...styles.continueBtn, opacity: selectedProfile ? 1 : 0.4, cursor: selectedProfile ? "pointer" : "not-allowed" }}
            >
              <span>Continue to Questions</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <style>{`
          @keyframes qsFloat {
            0%   { transform: translate(0,0);        opacity: 0.25; }
            50%  { transform: translate(20px,-20px); opacity: 0.6;  }
            100% { transform: translate(40px,-40px); opacity: 0.25; }
          }
        `}</style>
      </div>
    );
  }

  // ── RESULTS STEP ─────────────────────────────────────────────────
  if (step === "results" && category) {
    return (
      <div style={{ ...styles.container, background: "#fff" }}>
        {particles.map((p) => (
          <div key={p.id} style={{ ...styles.particle, left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
        ))}
        <div style={{ position: "relative", zIndex: 10, padding: "1.5rem 1.5rem 2rem", maxWidth: "560px", margin: "0 auto" }}>

          {/* ── Thank you header ── */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>🎉</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#111", margin: "0 0 0.4rem" }}>
              Thank you for participating
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
              in the <strong>Marketing Perception Study</strong>
            </p>
          </div>

          {/* ── Stats row ── */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            <div style={styles.statPill}>
              <Users size={14} color="#ef4444" />
              <span><strong>{totalParticipants !== null ? totalParticipants.toLocaleString() : "…"}</strong> total participants</span>
            </div>
            <div style={styles.statPill}>
              <User size={14} color="#ef4444" />
              <span><strong>{selectedProfile}</strong></span>
            </div>
          </div>

          {/* ── Category badge ── */}
          <div style={{
            background: category.bg,
            border: `1.5px solid ${category.border}`,
            borderRadius: "1rem",
            padding: "1.1rem 1.25rem",
            marginBottom: "1.5rem",
            boxShadow: `0 4px 20px ${category.glow}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.6rem" }}>{category.emoji}</span>
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: category.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Your Marketing Perception
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: category.color, margin: 0 }}>
                  {category.name}
                </h3>
              </div>
            </div>
            <p style={{ fontSize: "0.84rem", color: "#333", margin: 0, lineHeight: 1.55 }}>
              {category.description}
            </p>
          </div>

          {/* ── Live results per question ── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem" }}>
              <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: "#ef4444" }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                How everyone answered
              </span>
            </div>

            {loadingResults ? (
              <div style={{ textAlign: "center", padding: "1.5rem", color: "#888", fontSize: "0.85rem" }}>
                Loading results…
              </div>
            ) : liveResults && liveResults.length > 0 ? (
              liveResults.map((q, qi) => {
                const myAns = answers[q.key];
                const maxVotes = Math.max(...(q.options || []).map((o) => o.votes));
                return (
                  <div key={q.key} style={{
                    background: "#fafafa",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.85rem",
                    padding: "1rem 1.1rem",
                    marginBottom: "12px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#ef4444", textTransform: "uppercase" }}>Q{qi + 1}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111", lineHeight: 1.3 }}>{q.question_text}</span>
                    </div>
                    {(q.options || []).map((opt, oi) => (
                      <OptionBar
                        key={oi}
                        text={opt.option_text}
                        pct={opt.percentage}
                        color={opt.votes === maxVotes ? "#ef4444" : "#6366f1"}
                        isHighlight={opt.votes === maxVotes}
                        delay={oi * 80}
                      />
                    ))}
                    {myAns && (
                      <p style={{ fontSize: "0.72rem", color: "#888", margin: "6px 0 0", fontStyle: "italic" }}>
                        ✓ Your answer: <strong>{myAns.option_text}</strong>
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#888", textAlign: "center" }}>
                Be the first to set the benchmark!
              </p>
            )}
          </div>

          {/* ── Close button ── */}
          <button
            onClick={onClose}
            style={styles.continueBtn}
          >
            Close
          </button>
        </div>

        <style>{`
          @keyframes qsFloat {
            0%   { transform: translate(0,0);        opacity: 0.18; }
            50%  { transform: translate(20px,-20px); opacity: 0.45;  }
            100% { transform: translate(40px,-40px); opacity: 0.18; }
          }
        `}</style>
      </div>
    );
  }

  // ── QUESTIONS STEP ────────────────────────────────────────────────
  return (
    <div style={{ ...styles.container, background: "#fff" }}>
      {particles.map((p) => (
        <div key={p.id} style={{ ...styles.particle, left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}

      <div style={{ ...styles.centerer, opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "none", transition: "opacity 0.3s, transform 0.3s" }}>
        <div style={{ ...styles.card, paddingTop: "1.5rem" }}>

          {/* Profile badge + Progress */}
          <div style={{ marginBottom: "1.25rem" }}>
            {selectedProfile && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "9999px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: "10px" }}>
                <User size={12} color="#dc2626" />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#991b1b" }}>{selectedProfile}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#888" }}>
                Question {currentQ + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#ef4444,#991b1b)", borderRadius: "9999px", width: `${progress}%`, transition: "width 0.6s ease" }} />
            </div>
          </div>

          {/* Question text */}
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111", marginBottom: "1.1rem", lineHeight: 1.35 }}>
            {q.question}
          </h2>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isDisabled = selectedOption !== null;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isDisabled}
                  style={{
                    ...styles.optionBtn,
                    ...(isSelected ? styles.optionBtnSelected : {}),
                    cursor: isDisabled ? "default" : "pointer",
                    opacity: isDisabled && !isSelected ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: isSelected ? "none" : "1.5px solid #d1d5db",
                      background: isSelected ? "#ef4444" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {isSelected && <CheckCircle size={14} color="#fff" />}
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#991b1b" : "#333", textAlign: "left", lineHeight: 1.4 }}>
                      {opt.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {submitting && (
            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.78rem", color: "#dc2626" }}>
              Submitting your responses…
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes qsFloat {
          0%   { transform: translate(0,0);        opacity: 0.2;  }
          50%  { transform: translate(20px,-20px); opacity: 0.5;  }
          100% { transform: translate(40px,-40px); opacity: 0.2;  }
        }
      `}</style>
    </div>
  );
}

// ─── Shared Styles ──────────────────────────────────────────────────────────
const styles = {
  container: {
    minHeight: "70vh",
    background: "#ffffff",
    position: "relative",
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    background: "rgba(239,68,68,0.22)",
    borderRadius: "9999px",
    pointerEvents: "none",
    animation: "qsFloat 15s infinite linear",
  },
  centerer: {
    position: "relative",
    zIndex: 10,
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#fff",
    borderRadius: "1.25rem",
    padding: "1.75rem",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f3f4f6",
  },
  iconCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ef4444,#991b1b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    boxShadow: "0 6px 20px rgba(239,68,68,0.28)",
  },
  heading: {
    fontSize: "1.35rem",
    fontWeight: 800,
    color: "#111",
    margin: "0 0 0.4rem",
  },
  subheading: {
    fontSize: "0.88rem",
    color: "#666",
    margin: 0,
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "8px",
    marginBottom: "1.25rem",
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0.7rem 0.9rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "0.75rem",
    background: "#fafafa",
    color: "#333",
    fontSize: "0.85rem",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  profileBtnSelected: {
    borderColor: "#dc2626",
    background: "rgba(239,68,68,0.06)",
    color: "#991b1b",
    fontWeight: 700,
  },
  continueBtn: {
    width: "100%",
    padding: "0.9rem",
    background: "linear-gradient(135deg,#ef4444,#991b1b)",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: 700,
    border: "none",
    borderRadius: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(239,68,68,0.28)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  optionBtn: {
    width: "100%",
    padding: "0.8rem 1rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "0.85rem",
    background: "#fafafa",
    transition: "all 0.25s",
    fontFamily: "inherit",
    textAlign: "left",
  },
  optionBtnSelected: {
    borderColor: "#ef4444",
    background: "rgba(239,68,68,0.06)",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.12)",
  },
  statPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 12px",
    borderRadius: "9999px",
    background: "rgba(239,68,68,0.06)",
    border: "1px solid rgba(239,68,68,0.2)",
    fontSize: "0.8rem",
    color: "#333",
  },
};