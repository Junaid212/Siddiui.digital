import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import HeadTitle from "../../Components/Head/HeadTitle";
import { getFrameworkBySlug, INDIVIDUAL_FRAMEWORKS } from "../../Data/FrameworksData";
import "./FrameworkDetail.css";
import "../Frameworks/Frameworks.css";

export default function FrameworkDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const framework = getFrameworkBySlug(slug);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!framework) {
    return (
      <div className={`fwd-page ${darkMode ? "dark-mode" : "light-mode"} d-flex flex-column align-items-center justify-content-center text-center p-5`}>
        <h2 className={darkMode ? "text-white mb-3" : "text-dark mb-3"}>Framework Not Found</h2>
        <p className="text-muted mb-4">
          The framework you are looking for does not exist or has been moved.
        </p>
        <Link to="/frameworks" className="fwd-btn-primary">
          Back to All Frameworks <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className={`fwd-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <HeadTitle title={`${framework.pageHeading} — Siddiqui.Digital`} />

      {/* ------------------------------------------------------------------
          1. Breadcrumb Bar
      ------------------------------------------------------------------ */}
      <nav className="fwd-breadcrumb-section" aria-label="Breadcrumb">
        <div className="fwd-breadcrumb-container">
          <Link to="/" className="fwd-breadcrumb-link">Home</Link>
          <ChevronRight size={14} className="fwd-breadcrumb-separator" />
          <Link to="/frameworks" className="fwd-breadcrumb-link">Frameworks</Link>
          <ChevronRight size={14} className="fwd-breadcrumb-separator" />
          <span className="fwd-breadcrumb-current">{framework.title}</span>
        </div>
      </nav>

      {/* ------------------------------------------------------------------
          2. Hero Section
      ------------------------------------------------------------------ */}
      <section className="fwd-hero-section">
        <div className="fwd-hero-container">
          <div className="fwd-hero-content">
            <div className="fwd-code-badge">
              <span className="fwd-badge-dot" />
              {framework.code} // {framework.tag}
            </div>

            <h1 className="fwd-hero-title">
              {framework.pageHeading}
            </h1>

            <p className="fwd-hero-definition">
              {framework.shortDefinition}
            </p>

            {/* <div className="fwd-hero-actions">
              <Link to={framework.cta.primary.link} className="fwd-btn-primary">
                {framework.cta.primary.label} <ArrowRight size={15} />
              </Link>
              <Link to={framework.cta.secondary.link} className="fwd-btn-secondary">
                {framework.cta.secondary.label} <ArrowUpRight size={15} />
              </Link>
            </div> */}
          </div>

          <div className="fwd-hero-visual-card">
            <img
              src={framework.image}
              alt={framework.pageHeading}
              className="fwd-hero-img"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Strategic Foundation: Problem & Core Idea
      ------------------------------------------------------------------ */}
      <section className="fwd-foundation-section">
        <div className="fwd-container">
          <div className="fwd-foundation-grid">
            {/* Problem Card */}
            <div className="fwd-card-problem">
              <div className="fwd-card-eyebrow">
                <AlertCircle size={15} />
                The Problem It Addresses
              </div>
              <h3 className="fwd-card-heading">Misaligned Starting Points & Short-Termism</h3>
              <p className="fwd-card-body">{framework.problemAddressed}</p>
            </div>

            {/* Core Idea Card */}
            <div className="fwd-card-core">
              <div className="fwd-card-eyebrow">
                <Lightbulb size={15} />
                Core Idea
              </div>
              <h3 className="fwd-card-heading">Strategic Premise</h3>
              <p className="fwd-quote-text">"{framework.coreIdea}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. Summary Content Section
      ------------------------------------------------------------------ */}
      <section className="fwd-summary-section">
        <div className="fwd-container">
          <div className="fwd-section-header">
            <span className="fwd-section-eyebrow">
              <Layers size={14} />
              Strategic Architecture
            </span>
            <h2 className="fwd-section-title">Framework Summary & Logic</h2>
            <p className="fwd-section-desc">
              How the model reorganizes strategic thinking from fragmented tactics into a disciplined, coherent system.
            </p>
          </div>

          <div className="fwd-summary-card">
            {framework.summaryContent.map((paragraph, idx) => (
              <p key={idx} className="fwd-summary-p">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. Key Focus Areas Grid
      ------------------------------------------------------------------ */}
      <section className="fwd-focus-section">
        <div className="fwd-container">
          <div className="fwd-section-header">
            <span className="fwd-section-eyebrow">
              <Sparkles size={14} />
              Core Dimensions
            </span>
            <h2 className="fwd-section-title">Key Focus Areas</h2>
            <p className="fwd-section-desc">
              The disciplined pillars governing this strategic model.
            </p>
          </div>

          <div className="fwd-focus-grid">
            {framework.keyFocusAreas.map((area, idx) => (
              <div className="fwd-focus-card" key={area.title}>
                <span className="fwd-focus-num">0{idx + 1} // FOCUS</span>
                <h4 className="fwd-focus-title">{area.title}</h4>
                <p className="fwd-focus-desc">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          6. Applications & Connected Ecosystem
      ------------------------------------------------------------------ */}
      <section className="fwd-ecosystem-section">
        <div className="fwd-container">
          <div className="fwd-section-header">
            <span className="fwd-section-eyebrow">
              <Briefcase size={14} />
              Applied Intelligence
            </span>
            <h2 className="fwd-section-title">Real-World Applications</h2>
            <p className="fwd-section-desc">{framework.applications}</p>
          </div>

          <div className="fwd-app-pills-wrap">
            {framework.applicationPills.map((pill) => (
              <span className="fwd-app-pill" key={pill}>
                <CheckCircle2 size={14} color="#ff6b6b" />
                {pill}
              </span>
            ))}
          </div>

          {/* Related Publication & Learning */}
          <div className="fwd-duo-grid">
            {/* Publication Card */}
            <div className="fwd-duo-card">
              <img
                src={framework.relatedPublication.image}
                alt={framework.relatedPublication.title}
                className="fwd-book-cover"
              />
              <div className="fwd-duo-content">
                <span className="fwd-duo-badge">Related Publication</span>
                <h4 className="fwd-duo-title">{framework.relatedPublication.title}</h4>
                <p className="fwd-duo-desc">{framework.relatedPublication.desc}</p>
                <Link to={framework.relatedPublication.link} className="fwd-duo-link">
                  Explore Publication <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Learning Card */}
            <div className="fwd-duo-card">
              <div className="fwd-duo-icon-box">
                <GraduationCap size={28} />
              </div>
              <div className="fwd-duo-content">
                <span className="fwd-duo-badge">Curriculum Learning</span>
                <h4 className="fwd-duo-title">{framework.relatedLearning.title}</h4>
                <p className="fwd-duo-desc">{framework.relatedLearning.desc}</p>
                <Link to={framework.relatedLearning.link} className="fwd-duo-link">
                  Explore in Learning <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          7. Bottom Capsule CTA Bar
      ------------------------------------------------------------------ */}
      <section className="fwd-bottom-cta">
        <div className="fw-container">
          <div className="fw-capsule-cta-bar">
            <div className="fw-capsule-bar-glow" />

            <div className="fw-capsule-bar-left">
              <div className="fw-capsule-bar-eyebrow">
                <Sparkles size={13} />
                <span>Next Strategic Steps</span>
              </div>
              <h2 className="fw-capsule-bar-title">
                Apply the {framework.title}
              </h2>
              <p className="fw-capsule-bar-desc">
                Advance your capability through executive learning or discuss tailored advisory engagements.
              </p>
            </div>

            <div className="fw-capsule-bar-right">
              <Link to={framework.cta.primary.link} className="fw-btn-secondary-light">
                {framework.cta.primary.label} <ArrowRight size={14} />
              </Link>
              <Link to={framework.cta.secondary.link} className="fw-btn-capsule-outline">
                {framework.cta.secondary.label}
              </Link>
              <Link to="/frameworks" className="fw-btn-capsule-outline">
                All Frameworks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
