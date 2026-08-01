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
    title: 'AVF — Adaptive Value Framework',
    sub: 'Sense · Shape · Scale',
    description:
      'AVF helps organizations continuously sense market change, shape relevant value propositions, and scale successful solutions — with the value system at the center.',
    image:
      'assets/images/img/75.webp',
    visual: <AvfModel />,
  },
  {
    id: 'c',
    index: '03',
    letter: 'C',
    title: 'VDI — Value Development Index',
    sub: 'Low → Moderate → High',
    description:
      'VDI measures how effectively an organization develops and strengthens value over time through customer relevance, innovation, responsiveness, loyalty, and strategic alignment.',
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
    <section ref={sectionRef} className="sf-section">
      {/* ── desktop: sticky left + scrolling right ── */}
      <div className="sf-desktop">
        {/* LEFT — sticky */}
        <div className="sf-left-col">
          <div className="sf-sticky-inner">
            <span className="sf-eyebrow">
              <span className="sf-eyebrow-accent">›_</span>
              Frameworks // {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <h2 className="sf-heading">
              SIGNATURE<br />
              <span className="sf-heading-accent">FRAMEWORKS</span>
            </h2>
            <p className="sf-desc">
              Proven models that turn purpose into profit, keep organizations adaptive, and measure value development with
              precision.
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