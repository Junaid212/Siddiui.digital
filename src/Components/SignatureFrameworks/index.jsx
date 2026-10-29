/* src/components/SignatureFrameworks.jsx */
import { useEffect, useRef, useState } from 'react';
import {
  Compass,
  Eye,
  Target,
  Sparkles,
  Users,
  TrendingUp,
  DollarSign,
  Radar,
  RefreshCw,
  Layers,
  Gauge,
  Heart,
  Lightbulb,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import './SignatureFrameworks.css';

/* ── data ── */
const purposeSteps = [
  { label: 'Purpose', icon: Compass },
  { label: 'Vision', icon: Eye },
  { label: 'Strategy', icon: Target },
  { label: 'Value Creation', icon: Sparkles },
  { label: 'Customer Impact', icon: Users },
  { label: 'Growth', icon: TrendingUp },
  { label: 'Profit', icon: DollarSign },
];

const avfCycle = [
  { label: 'Sense', icon: Radar },
  { label: 'Shape', icon: RefreshCw },
  { label: 'Scale', icon: Layers },
];

const vdiMetrics = [
  { label: 'Customer Relevance', icon: Heart, level: 'High' },
  { label: 'Innovation', icon: Lightbulb, level: 'Moderate' },
  { label: 'Responsiveness', icon: Clock, level: 'High' },
  { label: 'Loyalty', icon: ShieldCheck, level: 'Moderate' },
  { label: 'Strategic Alignment', icon: Target, level: 'Low' },
];

const levelMap = {
  Low:      { width: '35%' },
  Moderate: { width: '62%' },
  High:     { width: '90%' },
};

/* ── sub-visuals ── */
function PurposeFlow() {
  return (
    <div className="pf-row">
      {purposeSteps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="pf-step">
            <div className="pf-step-inner">
              <div className="pf-icon-wrap">
                <Icon className="pf-icon" />
              </div>
              <span className="pf-label">{step.label}</span>
            </div>
            {i < purposeSteps.length - 1 && (
              <ArrowRight className="pf-arrow" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AvfModel() {
  return (
    <div className="avf-wrap">
      <div className="avf-ring">
        {/* center */}
        <div className="avf-center-positioner">
          <div className="avf-center-circle">
            <div className="avf-center-text">
              <Gauge className="avf-center-icon" />
              <span className="avf-center-label">
                Value<br />System
              </span>
            </div>
          </div>
        </div>
        <div className="avf-dashed-ring" />
        {avfCycle.map((node, i) => {
          const Icon = node.icon;
          const angle = (i * 120 - 90) * (Math.PI / 180);
          const r = 72;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <div
              key={node.label}
              className="avf-node-positioner"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div className="avf-node-inner">
                <div className="avf-node-icon-wrap">
                  <Icon className="avf-node-icon" />
                </div>
                <span className="avf-node-label">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
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
        <svg 
        xmlns="http://www.w3.org/2000/svg" width="auto" height="300px" viewBox="0 0 720 1000">
          <defs>
            <radialGradient id="g" cx="50%" cy="45%" r="60%">
              <stop offset="0" stop-color="#16243f"/>
              <stop offset="1" stop-color="#0b1220"/>
              </radialGradient>
              <radialGradient id="c" cx="50%" cy="40%" r="60%">
                <stop offset="0" stop-color="#C8243D"/>
                <stop offset="1" stop-color="#7A0F22"/>
                </radialGradient>
                <marker id="a" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0 L10 5 L0 10 z" fill="#E04A5F"/>
                  </marker>
                  </defs>
                  <rect width="720" height="1000" rx="28" fill="url(#g)"/>
                  <circle cx="360" cy="400" r="230" fill="none" stroke="#2A3A5C" stroke-width="2" stroke-dasharray="6 8"/>
                  <path d="M428.0 180.3 A230 230 0 0 1 579.7 332.0" fill="none" stroke="#E04A5F" stroke-width="4" marker-end="url(#a)"/>
                  <path d="M579.7 468.0 A230 230 0 0 1 428.0 619.7" fill="none" stroke="#E04A5F" stroke-width="4" marker-end="url(#a)"/>
                  <path d="M292.0 619.7 A230 230 0 0 1 140.3 468.0" fill="none" stroke="#E04A5F" stroke-width="4" marker-end="url(#a)"/>
                  <path d="M140.3 332.0 A230 230 0 0 1 292.0 180.3" fill="none" stroke="#F2C6CD" stroke-width="4" marker-end="url(#a)"/>
                  <circle cx="360" cy="400" r="110" fill="url(#c)" stroke="#F2C6CD" stroke-width="4"/>
                  <text x="360" y="392" text-anchor="middle" fill="#fff" font-family="Roboto" font-weight="800" font-size="30">VALUE</text>
                  <text x="360" y="428" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="800" font-size="30">SYSTEM</text>
                  <circle cx="360.0" cy="170.0" r="58" fill="#0F1A30" stroke="#E04A5F" stroke-width="4"/>
                  <text x="360.0" y="177.0" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="500" font-size="22">Sense</text>
                  <circle cx="590.0" cy="400.0" r="58" fill="#0F1A30" stroke="#E04A5F" stroke-width="4"/>
                  <text x="590.0" y="407.0" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="500" font-size="22">Shape</text>
                  <circle cx="360.0" cy="630.0" r="58" fill="#0F1A30" stroke="#E04A5F" stroke-width="4"/>
                  <text x="360.0" y="637.0" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="500" font-size="22">Scale</text>
                  <circle cx="130.0" cy="400.0" r="58" fill="#0F1A30" stroke="#E04A5F" stroke-width="4"/>
                  <text x="130.0" y="407.0" text-anchor="middle" fill="#fff" font-family="Inter" font-weight="500" font-size="19">Experience</text>
                  <text x="360" y="730" text-anchor="middle" fill="#F2C6CD" font-family="Inter" font-weight="500" font-size="24">Experience feeds back into Sense, so the system keeps learning</text>
                  <rect x="39.0" y="860" width="150" height="96" rx="12" fill="#F2C6CD"/>
                  <text x="114.0" y="900" text-anchor="middle" fill="#13294B" font-family="Inter" font-weight="800" font-size="20">Sense</text>
                  <text x="114.0" y="928" text-anchor="middle" fill="#3E4556" font-family="Inter" font-weight="500" font-size="18">Market reality</text>
                  <rect x="203.0" y="860" width="150" height="96" rx="12" fill="#F2C6CD"/>
                  <text x="278.0" y="900" text-anchor="middle" fill="#13294B" font-family="Inter" font-weight="800" font-size="20">Shape</text>
                  <text x="278.0" y="928" text-anchor="middle" fill="#3E4556" font-family="Inter" font-weight="500" font-size="18">Value choices</text>
                  <rect x="367.0" y="860" width="150" height="96" rx="12" fill="#F2C6CD"/>
                  <text x="442.0" y="900" text-anchor="middle" fill="#13294B" font-family="Inter" font-weight="800" font-size="20">Scale</text>
                  <text x="442.0" y="928" text-anchor="middle" fill="#3E4556" font-family="Inter" font-weight="500" font-size="18">Known and chosen</text>
                  <rect x="531.0" y="860" width="150" height="96" rx="12" fill="#FFE3E8"/>
                  <text x="606.0" y="900" text-anchor="middle" fill="#13294B" font-family="Inter" font-weight="800" font-size="20">Experience</text>
                  <text x="606.0" y="928" text-anchor="middle" fill="#3E4556" font-family="Inter" font-weight="500" font-size="18">Promise tested</text>
        </svg>
      </div>

      {/* <div className="fw-cycle-nodes-summary">
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
      </div> */}

      {/* <div className="fw-visual-footer-callout">
        <RefreshCw size={13} color="#ff5e5e" />
        <span>Sense market change, shape relevant value propositions, and scale successful solutions.</span>
      </div> */}
    </div>
  );
}

function VdiScorecard() {
  return (
    <div className="vdi-list">
      {vdiMetrics.map((m) => {
        const Icon = m.icon;
        const lvl = levelMap[m.level];
        return (
          <div key={m.label} className="vdi-row">
            <div className="vdi-icon-wrap">
              <Icon className="vdi-icon" />
            </div>
            <div className="vdi-content">
              <div className="vdi-header-row">
                <span className="vdi-metric-name">{m.label}</span>
                <span className={`vdi-level-label vdi-level-label--${m.level}`}>{m.level}</span>
              </div>
              <div className="vdi-bar-track">
                <div
                  className={`vdi-bar-fill vdi-bar-fill--${m.level}`}
                  style={{ width: lvl.width }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── framework cards data ── */
const frameworks = [
  {
    id: 'a',
    index: '01',
    letter: 'A',
    title: 'From Purpose to Profit',
    sub: 'Purpose-to-Performance Model',
    description:
      'A framework showing how meaningful purpose is converted into sustainable business performance. Profit is treated as the outcome of consistent value creation, not the starting point.',
    image:
      'assets/images/img/74.webp',
    visual: <PurposeFlow />,
  },
  {
    id: 'b',
    index: '02',
    letter: 'B',
    title: 'AVF: Adaptive Value Framework',
    sub: 'Sense · Shape · Scale',
    description:
      'AVF helps organizations continuously sense market change, shape relevant value propositions, and scale successful solutions — with the value system at the center.',
    image:
      'assets/images/img/75.webp',
    visual: <SectionAdaptiveValueCycleVisual />,
  },
  {
    id: 'c',
    index: '03',
    letter: 'C',
    title: 'VDI: Value Drift Index',
    sub: 'Low → Moderate → High',
    description:
      'VDI shows where an organization’s value is drifting from what customers now value, across relevance, innovation, responsiveness, loyalty and strategic alignment, before it appears as churn and margin loss.',
    image:
      'assets/images/img/76.webp',
    visual: <VdiScorecard />,
  },
];

/* ── scroll-reveal card ── */
function FrameworkCard({ fw }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sf-card ${visible ? 'sf-card--visible' : 'sf-card--hidden'}`}
    >
      {/* image */}
      <div className="sf-card-img-wrap">
        <img
          src={fw.image}
          alt={fw.title}
          className="sf-card-img"
          loading="lazy"
        />
        <div className="sf-card-gradient" />
        {/* top badge */}
        <div className="sf-card-badge-wrap">
          <span className="sf-card-badge">
            {fw.letter}-{fw.index}
          </span>
        </div>
        {/* bottom */}
        <div className="sf-card-bottom">
          {/* <p className="sf-card-sub">{fw.sub}</p> */}
          <h3 className="sf-card-title">{fw.title}</h3>
        </div>
      </div>

      {/* body */}
      <div className="sf-card-body">
        <p className="sf-card-desc">{fw.description}</p>
        {fw.visual}
      </div>
    </div>
  );
}

/* ── main section ── */
export default function SignatureFrameworks() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* track which card is most in view to update the sticky left counter */
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = frameworks.map((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section ref={sectionRef} className="sf-section ">
      {/* ── desktop: sticky left + scrolling right ── */}
      <div className="sf-desktop">
        {/* LEFT — sticky */}
        <div className="sf-left-col">
          <div className="sf-sticky-inner">
            <span className="sf-eyebrow">
              <span className="sf-eyebrow-accent">›_</span>
              Frameworks // {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <h2 className="sf-heading no-dark">
              SIGNATURE<br />
              <span className="sf-heading-accent">FRAMEWORKS</span>
            </h2>
            <p className="sf-desc">
              Original frameworks that connect purpose to profit, keep organizations adaptive, and detect value drift early.
            </p>

            {/* progress dots */}
            <div className="sf-dots-list">
              {frameworks.map((fw, i) => (
                <div key={fw.id} className="sf-dot-item">
                  <div className={`sf-dot ${i === activeIndex ? 'sf-dot--active' : 'sf-dot--inactive'}`} />
                  <span className={`sf-dot-label ${i === activeIndex ? 'sf-dot-label--active' : 'sf-dot-label--inactive'}`}>
                    {fw.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — scrolling cards */}
        <div className="sf-right-col">
          {frameworks.map((fw, i) => (
            <div key={fw.id} ref={(el) => { cardRefs.current[i] = el; }}>
              <FrameworkCard fw={fw} />
            </div>
          ))}
          {/* trailing spacer so last card fully passes the sticky panel */}
          <div className="sf-spacer" />
        </div>
      </div>

      {/* ── mobile: plain vertical stack ── */}
      <div className="sf-mobile">
        {/* header */}
        <div>
          <span className="sf-mobile-eyebrow">
            <span className="sf-eyebrow-accent">›_</span> Frameworks
          </span>
          <h2 className="sf-mobile-heading">
            SIGNATURE<br />
            <span className="sf-heading-accent">FRAMEWORKS</span>
          </h2>
          <p className="sf-desc-mobile">
            Proven models that turn purpose into profit, keep organizations adaptive, and measure value development with
            precision.
          </p>
        </div>
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.id} fw={fw} />
        ))}
      </div>
    </section>
  );
}