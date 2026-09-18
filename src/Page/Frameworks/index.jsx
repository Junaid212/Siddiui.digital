import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Target,
  Award,
  Layers,
  Lightbulb,
  Heart,
  GraduationCap,
  Briefcase,
  BookOpen,
  Sparkles,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
  Radar,
  RefreshCw,
  Gauge,
  Clock,
  ShieldCheck,
  X,
  CheckCircle2,
} from "lucide-react";
import "./Frameworks.css";


import { INDIVIDUAL_FRAMEWORKS } from "../../Data/FrameworksData";

/* --------------------------------------------------------------------------
   Data Definitions
   -------------------------------------------------------------------------- */
const FRAMEWORKS = INDIVIDUAL_FRAMEWORKS.map((fw) => ({
  ...fw,
  shortDesc: fw.shortDefinition,
  expandedText: fw.summaryContent[0],
  keyIdea: fw.coreIdea,
  ctaText: `Explore ${fw.title.replace(" — The DNA of Business", "")}`,
  relatedBook: fw.relatedPublication,
}));

const FLOW_STEPS = [
  { num: "01", label: "Purpose" },
  { num: "02", label: "Value" },
  { num: "03", label: "Relevance" },
  { num: "04", label: "Adaptability" },
  { num: "05", label: "Diagnosis" },
  { num: "06", label: "Alignment" },
  { num: "07", label: "Sustainable Outcomes" },
];

const APPLICATIONS = [
  { title: "Marketing Strategy", icon: Target },
  { title: "Brand & Value Positioning", icon: Award },
  { title: "Digital Marketing Direction", icon: Compass },
  { title: "Business & Market Alignment", icon: Layers },
  { title: "Innovation & Product Development", icon: Lightbulb },
  { title: "Customer Relevance Assessment", icon: Heart },
  { title: "Curriculum & Executive Learning", icon: GraduationCap },
  { title: "Advisory & Strategic Review", icon: Briefcase },
];

const PUBLICATIONS = [
  {
    title: "Marketing Reclassified",
    desc: "From transaction to human progress.",
    image: "/assets/images/img/book1.webp",
    link: "/buy-book/cff3798b-88bb-41af-8e2a-bc5f7a2a4239",
  },
  {
    title: "The Value Drift Index",
    desc: "Practical tool for measuring, managing and preventing value drift.",
    image: "/assets/images/img/book2.webp",
    link: "/buy-book/prod_002_sid_philosophy",
  },
  {
    title: "The Adaptive Value Framework",
    desc: "A practical approach to creating sustainable value in a changing world.",
    image: "/assets/images/img/book3.webp",
    link: "/buy-book/prod_003_research_report",
  },
];

/* --------------------------------------------------------------------------
   Interactive Visuals for Modal
   -------------------------------------------------------------------------- */
function PurposeFlowMini() {
  const steps = [
    { label: "Purpose", icon: Compass },
    { label: "Vision", icon: Eye },
    { label: "Strategy", icon: Target },
    { label: "Value Creation", icon: Sparkles },
    { label: "Customer Impact", icon: Users },
    { label: "Growth", icon: TrendingUp },
    { label: "Profit", icon: DollarSign },
  ];

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 py-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <React.Fragment key={s.label}>
            <div
              style={{
                background: "#222",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color: "#e5e7eb",
              }}
            >
              <Icon size={14} color="#ff5e5e" />
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={13} color="rgba(255,255,255,0.3)" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function AvfCycleMini() {
  const nodes = [
    { label: "Sense", desc: "Perceive market shifts & signals", icon: Radar },
    { label: "Shape", desc: "Formulate agile value offerings", icon: RefreshCw },
    { label: "Scale", desc: "Execute & expand sustainably", icon: Layers },
  ];

  return (
    <div className="row g-2 py-2">
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <div className="col-12 col-md-4" key={node.label}>
            <div
              style={{
                background: "#222",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "0.85rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(219, 27, 2, 0.15)",
                  color: "#ff5e5e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.5rem",
                }}
              >
                <Icon size={18} />
              </div>
              <strong style={{ color: "#ffffff", fontSize: "0.9rem", display: "block" }}>
                {node.label}
              </strong>
              <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                {node.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VdiMetricsMini() {
  const metrics = [
    { label: "Customer Relevance", icon: Heart, level: "Critical Marker" },
    { label: "Innovation Velocity", icon: Lightbulb, level: "Growth Engine" },
    { label: "Market Responsiveness", icon: Clock, level: "Adaptability" },
    { label: "Relationship Trust", icon: ShieldCheck, level: "Retention" },
    { label: "Strategic Alignment", icon: Target, level: "Coherence" },
  ];

  return (
    <div className="d-flex flex-column gap-2 py-1">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            style={{
              background: "#222",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "0.6rem 0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Icon size={14} color="#ff5e5e" />
              <span style={{ fontSize: "0.85rem", color: "#f3f4f6", fontWeight: 500 }}>
                {m.label}
              </span>
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#ff8a8a",
                background: "rgba(219, 27, 2, 0.1)",
                padding: "0.15rem 0.5rem",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {m.level}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Redesigned Interactive Visuals for Section 4 Cards
   -------------------------------------------------------------------------- */
function SectionPurposeToProfitVisual() {
  const steps = [
    { num: "01", label: "Purpose", sub: "Meaningful intent", icon: Compass },
    { num: "02", label: "Vision", sub: "Strategic direction", icon: Eye },
    { num: "03", label: "Strategy", sub: "Disciplined priorities", icon: Target },
    { num: "04", label: "Value Creation", sub: "Core engine", icon: Sparkles },
    { num: "05", label: "Customer Impact", sub: "Authentic relevance", icon: Users },
    { num: "06", label: "Growth", sub: "Market expansion", icon: TrendingUp },
    { num: "07", label: "Profit", sub: "Sustainable outcome", icon: DollarSign, isOutcome: true },
  ];

  return (
    <div className="fw-visual-box fw-visual-box-flow">
      {/* <div className="fw-visual-top-bar">
        <span className="fw-visual-tag">Sequential Value Flow</span>
        <span className="fw-visual-status-pill fw-visual-status-gold">Outcome-Driven</span>
      </div> */}

      <div className="fw-flow-ladder">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className={`fw-flow-ladder-item ${step.isOutcome ? "is-outcome" : ""}`}>
                <div className="fw-flow-item-left">
                  <div className="fw-flow-num-badge">{step.num}</div>
                  <div className="fw-flow-icon-wrap">
                    <Icon size={12} color={step.isOutcome ? "#ffd700" : "#ff8585"} />
                  </div>
                  <div>
                    <span className="fw-flow-item-name">{step.label}</span>
                    {/* <span className="fw-flow-item-role"> — {step.sub}</span> */}
                  </div>
                </div>
                {step.isOutcome && (
                  <span className="fw-outcome-tag">Outcome</span>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="fw-flow-ladder-connector">
                  <ArrowRight size={11} style={{ transform: "rotate(90deg)" }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* <div className="fw-visual-footer-callout">
        <Sparkles size={13} color="#facc15" />
        <span>Profit is treated as the outcome of consistent value creation, not the starting point.</span>
      </div> */}
    </div>
  );
}

function SectionAdaptiveValueCycleVisual() {
  return (
    <div className="fw-visual-box fw-visual-box-cycle">
      {/* <div className="fw-visual-top-bar">
        <span className="fw-visual-tag">Circular Adaptive Model</span>
        <span className="fw-visual-status-pill fw-visual-status-crimson">Value Centered</span>
      </div> */}

      <div className="fw-circular-svg-wrap">
        <svg viewBox="0 0 280 230" className="fw-circular-svg">
          <defs>
            <radialGradient id="centerHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#db1b02" />
              <stop offset="100%" stopColor="#800505" />
            </radialGradient>
            <marker
              id="cycleArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#ff5e5e" />
            </marker>
          </defs>

          {/* Dashed Orbital Track */}
          <circle
            cx="140"
            cy="115"
            r="72"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Curved Flow Connectors with Arrow Markers */}
          <path
            d="M 166 60 A 72 72 0 0 1 204 136"
            fill="none"
            stroke="#ff5e5e"
            strokeWidth="2"
            markerEnd="url(#cycleArrow)"
          />
          <path
            d="M 178 168 A 72 72 0 0 1 96 166"
            fill="none"
            stroke="#ff5e5e"
            strokeWidth="2"
            markerEnd="url(#cycleArrow)"
          />
          <path
            d="M 74 134 A 72 72 0 0 1 114 60"
            fill="none"
            stroke="#ff5e5e"
            strokeWidth="2"
            markerEnd="url(#cycleArrow)"
          />

          {/* Central Hub: Value System */}
          <circle
            cx="140"
            cy="115"
            r="38"
            fill="url(#centerHubGrad)"
            stroke="#ffffff"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 14px rgba(219, 27, 2, 0.6))" }}
          />
          <text
            x="140"
            y="112"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="9"
            fontWeight="800"
            letterSpacing="0.02em"
          >
            Value System
          </text>
          {/* <text
            x="140"
            y="125"
            textAnchor="middle"
            fill="#ffc0c0"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.06em"
          >
            AT THE CENTER
          </text> */}

          {/* Node 1: Sense (Top) */}
          <g transform="translate(140, 38)">
            <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#ff5e5e" strokeWidth="1.5" />
            <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Sense</text>
            {/* <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="500">Market Change</text> */}
          </g>

          {/* Node 2: Shape (Bottom Right) */}
          <g transform="translate(208, 156)">
            <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#ff5e5e" strokeWidth="1.5" />
            <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Shape</text>
            {/* <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="500">Value Props</text> */}
          </g>

          {/* Node 3: Scale (Bottom Left) */}
          <g transform="translate(72, 156)">
            <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#ff5e5e" strokeWidth="1.5" />
            <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Scale</text>
            {/* <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="500">Solutions</text> */}
          </g>
        </svg>
      </div>

      <div className="fw-cycle-nodes-summary">
        <div className="fw-cycle-node-pill">
          <span className="fw-cycle-node-pill-title">Sense</span>
          <span className="fw-cycle-node-pill-desc">Market Shifts</span>
        </div>
        <div className="fw-cycle-node-pill">
          <span className="fw-cycle-node-pill-title">Shape</span>
          <span className="fw-cycle-node-pill-desc">Relevant Props</span>
        </div>
        <div className="fw-cycle-node-pill">
          <span className="fw-cycle-node-pill-title">Scale</span>
          <span className="fw-cycle-node-pill-desc">Solutions</span>
        </div>
      </div>

      {/* <div className="fw-visual-footer-callout">
        <RefreshCw size={13} color="#ff5e5e" />
        <span>Sense market change, shape relevant value propositions, and scale successful solutions.</span>
      </div> */}
    </div>
  );
}

function SectionValueDevelopmentDashboardVisual() {
  const metrics = [
    { label: "Customer Relevance", score: 94, icon: Heart },
    { label: "Innovation Velocity", score: 88, icon: Lightbulb },
    { label: "Market Responsiveness", score: 85, icon: Clock },
    { label: "Brand & Customer Loyalty", score: 91, icon: ShieldCheck },
    { label: "Strategic Alignment", score: 89, icon: Target },
  ];

  return (
    <div className="fw-visual-box fw-visual-box-scorecard">
      {/* <div className="fw-visual-top-bar">
        <span className="fw-visual-tag">Development Scorecard</span>
        <span className="fw-visual-status-pill fw-visual-status-green">Tier: High Development</span>
      </div> */}

      {/* Stage Progression Gauge (Low -> Moderate -> High) */}
      <div className="fw-vdi-gauge-bar">
        <div className="fw-vdi-gauge-stage">
          <span className="fw-vdi-stage-dot" /> Low
        </div>
        <div className="fw-vdi-gauge-stage">
          <span className="fw-vdi-stage-dot" /> Moderate
        </div>
        <div className="fw-vdi-gauge-stage is-active">
          <span className="fw-vdi-stage-dot" /> High
        </div>
      </div>

      {/* 5 Core Dimensions */}
      <div className="fw-vdi-metrics-list">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div className="fw-vdi-metric-row" key={m.label}>
              <div className="fw-vdi-metric-top">
                <div className="d-flex align-items-center gap-2">
                  <Icon size={12} color="#ff8585" />
                  <span>{m.label}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-vdi-score-num">{m.score}%</span>
                  <span className="fw-vdi-stage-chip">High</span>
                </div>
              </div>
              <div className="fw-vdi-metric-progress-track">
                <div
                  className="fw-vdi-metric-progress-fill"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="fw-visual-footer-callout">
        <Gauge size={13} color="#4ade80" />
        <span>Measures how effectively value develops & strengthens over time across all 5 dimensions.</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Modal Component
   -------------------------------------------------------------------------- */
function FrameworkDetailModal({ framework, open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open, onClose]);

  if (!open || !framework) return null;

  return ReactDOM.createPortal(
    <div
      className="fw-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fw-modal-title"
    >
      <div className="fw-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="fw-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="fw-modal-body">
          <div className="fw-modal-eyebrow">
            {framework.code} // {framework.tag}
          </div>
          <h2 id="fw-modal-title" className="fw-modal-title">
            {framework.title}
          </h2>
          <p className="fw-modal-short">{framework.shortDesc}</p>
          <p className="fw-modal-text">{framework.expandedText}</p>

          <div className="fw-key-idea-box" style={{ marginBottom: "1.5rem" }}>
            <div className="fw-key-idea-label">
              <Sparkles size={13} />
              Key Idea
            </div>
            <p className="fw-key-idea-text">{framework.keyIdea}</p>
          </div>

          <div className="fw-modal-interactive-wrap">
            <div className="fw-modal-interactive-title">
              <Gauge size={14} color="#ff5e5e" />
              Strategic Architecture Overview
            </div>
            {framework.visualType === "flow" && <PurposeFlowMini />}
            {framework.visualType === "cycle" && <AvfCycleMini />}
            {framework.visualType === "gauge" && <VdiMetricsMini />}
          </div>
        </div>

        <div className="fw-modal-footer">
          <button
            type="button"
            className=""
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            Close
          </button>
          <Link
            to={framework.url || `/frameworks/${framework.slug}/`}
            className="fw-btn-primary"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem", background: "#ff4d4d", borderColor: "#ff4d4d" }}
            onClick={onClose}
          >
            Full Page <ArrowRight size={14} />
          </Link>
          <Link
            to={framework.relatedBook.link}
            className="fw-btn-secondary-light"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            Related Book <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/courses"
            className="fw-btn-secondary-light"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            Explore in Learning <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* --------------------------------------------------------------------------
   Main Frameworks Page Component
   -------------------------------------------------------------------------- */
export default function FrameworksPage() {
  const [selectedFw, setSelectedFw] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenFw = (fw) => {
    setSelectedFw(fw);
    setModalOpen(true);
  };

  const scrollToOverview = () => {
    const el = document.getElementById("signature-frameworks");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Listen for theme changes from navbar toggle or storage
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

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "data-theme" ||
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });

    window.addEventListener("themeChange", checkTheme);
    window.addEventListener("storage", checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", checkTheme);
      window.removeEventListener("storage", checkTheme);
    };
  }, []);

  return (
    <div className={`frameworks-page courses-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Hidden SVG definition for the banner cutout clip path */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <clipPath id="hero-cutout-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.09 C 0,0.025 0.012,0 0.025,0 L 0.9675,0 C 0.988,0 1,0.025 1,0.06 L 1,0.92 C 1,0.965 0.988,1 0.975,1 L 0.58,1 C 0.53,1 0.49,0.94 0.47,0.85 C 0.45,0.76 0.42,0.72 0.38,0.72 L 0.025,0.72 C 0.012,0.72 0,0.685 0,0.64 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ------------------------------------------------------------------
          1. Hero section (Matches exact UI screenshot)
      ------------------------------------------------------------------ */}
      <section className="fw-hero-section">
        <div className="fw-hero-container hero-container">
          <div className="fw-hero-banner-wrapper">
            {/* The Red Silk Wave Banner with Scooped Cutout */}
            <div className="fw-hero-banner">
              <div className="fw-hero-content">
                <h1 className="fw-hero-title">
                  Strategic Frameworks for Value, Relevance<br />
                  and Purposeful Growth
                </h1>
                <p className="fw-hero-subheading">
                  Frameworks developed to reclassify marketing as strategic
                  intelligence — connecting purpose, value creation, adaptability,
                  relevance and long-term business outcomes.
                </p>
              </div>
            </div>

            {/* Action buttons layer aligned horizontally */}
            <div className="fw-hero-buttons-layer">
              <div className="fw-hero-left-btn-wrap">
                <button
                  type="button"
                  className="fw-btn-red-explore"
                  onClick={scrollToOverview}
                >
                  Explore the Frameworks <ArrowRight size={16} />
                </button>
              </div>

              <div className="fw-hero-right-btn-wrap">
                <Link to="/publications" className="fw-btn-dark-pub">
                  <BookOpen size={16} /> View Related Publications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. Introductory positioning section (Matches exact UI screenshot)
      ------------------------------------------------------------------ */}
      <section className="fw-positioning-section">
        <div className="fw-container">
          <div className="fw-positioning-card">
            <div className="fw-positioning-eyebrow">
              <span className="fw-positioning-eyebrow-icon" />
              STRATEGIC FOUNDATION
            </div>
            <h2 className="fw-positioning-heading">
              Marketing Needs Better Thinking Before Better Execution
            </h2>
            <p className="fw-positioning-lead">
              Marketing is often reduced to promotion, campaigns, advertising or
              digital activity. These are important, but they do not fully
              explain the deeper role marketing should play in business.
            </p>
            <p className="fw-positioning-body">
              The frameworks on siddiqui.digital are designed to improve the
              thinking behind marketing practice. They help students,
              professionals, entrepreneurs, educators and organizations examine
              purpose, value, relevance, adaptability and strategic alignment
              more clearly.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Three framework overview cards (Main section)
      ------------------------------------------------------------------ */}
      <section id="signature-frameworks" className="fw-cards-section">
        <div className="fw-container">
          <div className="fw-section-header">
            <span className="fw-section-eyebrow justify-content-center">
              <Sparkles size={14} />
              Core Signatures
            </span>
            <h2 className="fw-section-title">The Three Signature Frameworks</h2>
            <p className="fw-section-desc">
              Three disciplined lenses designed to transform how business and
              marketing are conceived, executed, and sustained.
            </p>
          </div>

          <div className="fw-cards-grid">
            {FRAMEWORKS.map((fw) => (
              <article className="fw-card" key={fw.id}>
                <div className="fw-card-img-wrap">
                  <img src={fw.image} alt={fw.title} />
                  {/* <div className="fw-card-img-overlay" /> */}
                  {/* <span className="fw-card-tag">
                    <span className="fw-card-tag-dot" />
                    {fw.code} · {fw.tag}
                  </span> */}
                </div>

                <div className="fw-card-body">
                  <h3 className="fw-card-title">
                    <Link to={fw.url || `/frameworks/${fw.slug}/`} className="text-white text-decoration-none">
                      {fw.title}
                    </Link>
                  </h3>
                  <p className="fw-card-short">{fw.shortDesc}</p>
                  <p className="fw-card-expanded">{fw.expandedText}</p>

                  <div className="fw-key-idea-box">
                    <div className="fw-key-idea-label">
                      <Sparkles size={12} />
                      Key Idea
                    </div>
                    <p className="fw-key-idea-text">"{fw.keyIdea}"</p>
                  </div>

                  <Link
                    to={fw.url || `/frameworks/${fw.slug}/`}
                    className="fw-card-btn text-decoration-none"
                  >
                    <span className="fw-card-btn-text">{fw.ctaText}</span>
                    <span className="fw-card-btn-icon-wrap">
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. How the frameworks work together
      ------------------------------------------------------------------ */}
      <section className="fw-synthesis-section">
        <div className="fw-container">
          <div className="fw-section-header">
            <span className="fw-section-eyebrow justify-content-center">
              <Layers size={14} />
              Integrated Philosophy
            </span>
            <h2 className="fw-section-title">One Philosophy, Three Strategic Lenses</h2>
            <p className="fw-section-desc">
              The three frameworks are connected, but each one plays a
              different role. Together, they support the broader philosophy of{" "}
              <strong style={{ color: "#c80808" }}>
                Marketing, Reclassified
              </strong>
              .
            </p>
          </div>

          <div className="fw-synthesis-roles">
            {/* Card A: From Purpose to Profit */}
            <article className="fw-synthesis-role-card">
              <div className="fw-synthesis-role-header">
                {/* <div className="fw-synthesis-role-num">Lens A // Foundation</div> */}
                <h3 className="fw-synthesis-role-name">From Purpose to Profit</h3>
                <p className="fw-synthesis-role-desc">
                  A framework showing how meaningful purpose is converted into
                  sustainable business performance. Profit is treated as the
                  outcome of consistent value creation, not the starting point.
                </p>
              </div>

              <SectionPurposeToProfitVisual />

              {/* <Link
                to="/frameworks/from-purpose-to-profit/"
                className="fw-card-link-btn"
              >
                <span>Explore From Purpose to Profit</span>
                <ArrowRight size={14} />
              </Link> */}
            </article>

            {/* Card B: AVF – Adaptive Value Framework */}
            <article className="fw-synthesis-role-card">
              <div className="fw-synthesis-role-header">
                {/* <div className="fw-synthesis-role-num">Lens B // Capability</div> */}
                <h3 className="fw-synthesis-role-name">
                  AVF – Adaptive Value Framework
                </h3>
                <p className="fw-synthesis-role-desc">
                  AVF helps organizations continuously sense market change, shape
                  relevant value propositions, and scale successful solutions.
                </p>
              </div>

              <SectionAdaptiveValueCycleVisual />

              {/* <Link
                to="/frameworks/adaptive-value-framework/"
                className="fw-card-link-btn"
              >
                <span>Explore Adaptive Value Framework</span>
                <ArrowRight size={14} />
              </Link> */}
            </article>

            {/* Card C: VDI – Value Development Index */}
            <article className="fw-synthesis-role-card">
              <div className="fw-synthesis-role-header">
                {/* <div className="fw-synthesis-role-num">Lens C // Evaluation</div> */}
                <h3 className="fw-synthesis-role-name">
                  VDI – Value Development Index
                </h3>
                <p className="fw-synthesis-role-desc">
                  VDI measures how effectively an organization develops and
                  strengthens value over time through customer relevance,
                  innovation, responsiveness, loyalty, and strategic alignment.
                </p>
              </div>

              <SectionValueDevelopmentDashboardVisual />

              {/* <Link
                to="/frameworks/value-drift-index/"
                className="fw-card-link-btn"
              >
                <span>Explore Value Development Index</span>
                <ArrowRight size={14} />
              </Link> */}
            </article>
          </div>

          {/* Suggested visual flow */}
          {/* <div className="fw-flow-container">
            <div className="fw-flow-title">
              Suggested Strategic Progression Flow
            </div>
            <div className="fw-flow-steps">
              {FLOW_STEPS.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <div className="fw-flow-node">
                    <div className="fw-flow-circle">{step.num}</div>
                    <span className="fw-flow-label">{step.label}</span>
                  </div>
                  {idx < FLOW_STEPS.length - 1 && (
                    <ArrowRight className="fw-flow-arrow" size={20} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div> */}
        </div>
      </section>


      {/* ------------------------------------------------------------------
          5. Application section
      ------------------------------------------------------------------ */}
      <section className="fw-applications-section">
        <div className="fw-container">
          <div className="fw-section-header">
            <span className="fw-section-eyebrow justify-content-center">
              <Briefcase size={14} />
              Applied Intelligence
            </span>
            <h2 className="fw-section-title">
              Where These Frameworks Can Be Applied
            </h2>
            <p className="fw-section-desc">
              Built for real-world impact across academic, strategic, executive,
              and organizational landscapes.
            </p>
          </div>

          <div className="fw-app-grid">
            {APPLICATIONS.map((app) => {
              const Icon = app.icon;
              return (
                <div className="fw-app-card" key={app.title}>
                  <div className="fw-app-icon-wrap">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <h4 className="fw-app-title">{app.title}</h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. Related pathways
      ------------------------------------------------------------------ */}
      <section className="fw-pathways-section">
        <div className="fw-container">
          <div className="fw-section-header">
            <span className="fw-section-eyebrow justify-content-center">
              <Compass size={14} />
              Explore Further
            </span>
            <h2 className="fw-section-title">Continue the Journey</h2>
            <p className="fw-section-desc">
              Three interconnected pathways to build capability, expand your
              thinking, or resolve complex strategic challenges.
            </p>
          </div>

          <div className="fw-pathways-grid">
            {/* Pathway 1: Learn */}
            <div className="fw-pathway-card">
              {/* <span className="fw-pathway-badge">Education</span> */}
              <h3 className="fw-pathway-title">Learn</h3>
              <p className="fw-pathway-desc">
                Explore courses, workshops and learning areas connected to these
                frameworks.
              </p>
              <Link to="/courses" className="fw-pathway-cta">
                Explore Learning <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pathway 2: Read */}
            <div className="fw-pathway-card">
              {/* <span className="fw-pathway-badge">Insights</span> */}
              <h3 className="fw-pathway-title">Read</h3>
              <p className="fw-pathway-desc">
                Read articles that expand the philosophy behind the frameworks.
              </p>
              <Link to="/blog-page" className="fw-pathway-cta">
                Read the Blog <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pathway 3: Apply */}
            <div className="fw-pathway-card">
              {/* <span className="fw-pathway-badge">Consultation</span> */}
              <h3 className="fw-pathway-title">Apply</h3>
              <p className="fw-pathway-desc">
                Discuss how these ideas may support strategic, educational or
                professional challenges.
              </p>
              <Link to="/consultation" className="fw-pathway-cta">
                Explore Advisory <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7. Related books and digital publications
      ------------------------------------------------------------------ */}
      <section className="fw-publications-section">
        <div className="fw-container">
          <div className="fw-section-header" style={{ marginBottom: "3rem" }}>
            <span className="fw-section-eyebrow justify-content-center">
              <BookOpen size={14} />
              Literature
            </span>
            <h2 className="fw-section-title">
              Related Books and Digital Publications
            </h2>
            <p className="fw-section-desc">
              Foundational publications expanding the core principles of each
              signature framework.
            </p>
          </div>

          <div className="fw-pub-grid">
            {PUBLICATIONS.map((pub) => (
              <div className="fw-pub-card" key={pub.title}>
                <img src={pub.image} alt={pub.title} className="fw-pub-img" />
                <div className="fw-pub-info">
                  <h4 className="fw-pub-title">{pub.title}</h4>
                  <p className="fw-pub-desc">{pub.desc}</p>
                  {/* <Link to={pub.link} className="fw-pub-link">
                    Explore Publication <ArrowUpRight size={13} />
                  </Link> */}
                </div>
              </div>
            ))}
          </div>

          <div className="fw-pub-cta-center">
            <Link to="/publications" className="fw-btn-secondary-light">
              <BookOpen size={16} /> View Publications
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          8. Final CTA (Compact Capsule Bar)
      ------------------------------------------------------------------ */}
      <section className="fw-final-cta-section">
        <div className="fw-container">
          <div className="fw-capsule-cta-bar">
            <div className="fw-capsule-bar-glow" />

            <div className="fw-capsule-bar-left">
              <div className="fw-capsule-bar-eyebrow">
                <Sparkles size={13} />
                <span>Transform Your Perspective</span>
              </div>
              <h2 className="fw-capsule-bar-title">
                Ready to Think About Marketing Differently?
              </h2>
              <p className="fw-capsule-bar-desc">
                Explore the frameworks, read related insights, or connect to discuss strategic growth.
              </p>
            </div>

            <div className="fw-capsule-bar-right">
              <Link to="/courses" className="fw-btn-secondary-light">
                Explore Learning <ArrowRight size={14} />
              </Link>
              <Link to="/blog-page" className="fw-btn-capsule-outline">
                Read Blog
              </Link>
              <Link to="/contact" className="fw-btn-capsule-outline">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <FrameworkDetailModal
        framework={selectedFw}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
