import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import "./SignatureFrameworks.css";

/* ─── Data ─────────────────────────────────────────────── */
const frameworks = [
  {
    id: "A",
    code: "A",
    label: "From Purpose to Profit",
    tagline: "Meaning drives momentum.",
    description:
      "A framework showing how meaningful purpose is converted into sustainable business performance. Profit is treated as the outcome of consistent value creation, not the starting point.",
    visual: ["Purpose", "Vision", "Strategy", "Value Creation", "Customer Impact", "Growth", "Profit"],
    visualType: "flow",
    image: "/assets/images/img/74.webp",
    imageAlt: "Purpose to Profit flow diagram",
    accent: "#C80808",
  },
  {
    id: "B",
    code: "AVF",
    label: "AVF – Adaptive Value Framework",
    tagline: "Sense. Shape. Scale.",
    description:
      "AVF helps organizations continuously sense market change, shape relevant value propositions, and scale successful solutions.",
    visual: ["Sense", "Shape", "Scale"],
    visualCenter: "Value System",
    visualType: "circular",
    image: "/assets/images/img/75.webp",
    imageAlt: "AVF circular model diagram",
    accent: "#C80808",
  },
  {
    id: "C",
    code: "VDI",
    label: "VDI – Value Development Index",
    tagline: "Measure what truly matters.",
    description:
      "VDI measures how effectively an organization develops and strengthens value over time through customer relevance, innovation, responsiveness, loyalty, and strategic alignment.",
    visual: [
      { label: "Customer Relevance", level: 80 },
      { label: "Innovation", level: 65 },
      { label: "Responsiveness", level: 72 },
      { label: "Loyalty", level: 88 },
      { label: "Strategic Alignment", level: 70 },
    ],
    scale: ["Low", "Moderate", "High"],
    visualType: "scorecard",
    image: "/assets/images/img/76.webp",
    imageAlt: "VDI scorecard dashboard",
    accent: "#C80808",
  },
];

/* ─── Small Visuals ─────────────────────────────────────── */
const FlowVisual = ({ steps }) => (
  <div className="sf-flow-visual">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <span className="sf-flow-node">{step}</span>
        {i < steps.length - 1 && (
          <span className="sf-flow-arrow">
            <svg width="16" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M1 5H17M17 5L13 1M17 5L13 9"
                stroke="var(--accent-color)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </React.Fragment>
    ))}
  </div>
);

const CircularVisual = ({ steps, center }) => (
  <div className="sf-circular-visual">
    <div className="sf-circular-ring">
      {steps.map((step, i) => (
        <div key={step} className={`sf-circular-step sf-step-${i}`}>
          <span>{step}</span>
        </div>
      ))}
      <div className="sf-circular-center">{center}</div>
    </div>
  </div>
);

const ScorecardVisual = ({ items, scale }) => (
  <div className="sf-scorecard-visual">
    <div className="sf-scorecard-scale">
      {scale.map((s) => <span key={s} className="sf-scale-label">{s}</span>)}
    </div>
    <div className="sf-scorecard-bar-bg">
      <div className="sf-scorecard-bar-fill" />
    </div>
    <div className="sf-scorecard-metrics">
      {items.map((item) => (
        <div key={item.label} className="sf-metric-item">
          <span className="sf-metric-label">{item.label}</span>
          <div className="sf-metric-bar-bg">
            <div className="sf-metric-bar-fill" style={{ width: `${item.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Individual Animated Card ──────────────────────────── */
function FrameworkCard({ fw, index, total, scrollYProgress }) {
  const start = index / total;
  const end   = (index + 1) / total;
  const mid   = (start + end) / 2;

  /* entrance: slide up from below */
  const y = useTransform(
    scrollYProgress,
    [start - 0.05, start + 0.08, mid, end - 0.05, end],
    ["60px",        "0px",        "0px", "-20px",    "-60px"]
  );

  /* opacity: fade in, hold, fade out */
  const opacity = useTransform(
    scrollYProgress,
    [start - 0.02, start + 0.08, end - 0.07, end],
    [0,             1,             1,           0]
  );

  /* subtle scale: slightly smaller when exiting */
  const scale = useTransform(
    scrollYProgress,
    [start, start + 0.08, end - 0.07, end],
    [0.97,  1,             1,          0.97]
  );

  /* image parallax: drifts opposite direction */
  const imgY = useTransform(
    scrollYProgress,
    [start, end],
    ["8%", "-8%"]
  );

  return (
    <motion.div
      className="sf-card sf-card-sticky"
      style={{ y, opacity, scale }}
    >
      {/* Progress dot */}
      {/* <div className="sf-card-dots">
        {frameworks.map((_, di) => (
          <span
            key={di}
            className={`sf-dot ${di === index ? "sf-dot--active" : ""}`}
          />
        ))}
      </div> */}

      {/* LEFT — Content */}
      <div className="sf-card-content">
        <div className="sf-badge">
          <span className="sf-badge-code">{fw.code}</span>
          <span className="sf-badge-tagline">{fw.tagline}</span>
        </div>

        <h3 className="sf-card-title secondary-accent">{fw.label}</h3>
        <p className="sf-card-desc">{fw.description}</p>

        <div className="sf-inline-visual">
          {fw.visualType === "flow"      && <FlowVisual steps={fw.visual} />}
          {fw.visualType === "circular"  && <CircularVisual steps={fw.visual} center={fw.visualCenter} />}
          {fw.visualType === "scorecard" && <ScorecardVisual items={fw.visual} scale={fw.scale} />}
        </div>
      </div>

      {/* RIGHT — Image */}
      <div className="sf-card-image-wrap">
        <div className="sf-card-image-glow" />
        <motion.img
          src={fw.image}
          alt={fw.imageAlt}
          className="sf-card-image"
          style={{ y: imgY }}
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

/* ─── Main Section ──────────────────────────────────────── */
export default function SignatureFrameworks() {
  /* The tall scroll-space wrapper */
  const wrapperRef = useRef(null);

  /* Track scroll progress WITHIN this wrapper */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    /* Outer scroll-space: 100vh per card + 50vh for the header */
    <div
      ref={wrapperRef}
      className="sf-scroll-wrapper"
      style={{ height: `${frameworks.length * 100 + 40}vh` }}
    >
      {/* ── Section header — NOT sticky, scrolls away naturally ── */}
      <div className="sf-header hero-container sf-header-flow">
        <div className="sf-header-inner">
          <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Framework</h6>
                            </div>
                            <h2 className="text-center animate-box animated animate__animated" data-animate="animate__fadeInUp">Signature Framework</h2>
        </div>
      </div>

      {/* ── Sticky viewport: cards live here ── */}
      <div className="sf-sticky-stage">
        {frameworks.map((fw, i) => (
          <FrameworkCard
            key={fw.id}
            fw={fw}
            index={i}
            total={frameworks.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
