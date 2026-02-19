import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, CalendarCheck } from "lucide-react";
import img from "/assets/images/img/Siddiqui.png"

// Helper component to render text with character-by-character animation
const AnimatedCharacters = ({ text, isAccent = false }) => {
  const characters = text.split("");
  
  return (
    <>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: index * 0.115,
            ease: "easeOut"
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
};

export default function Hero({ onBookConsultation }) {
  const [darkMode, setDarkMode] = useState(true);

  // Listen for theme changes from navbar
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark" ||
                        document.body.classList.contains("dark-mode");
      setDarkMode(isDarkMode);
    };

    // Initial check
    checkTheme();

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme' || 
            mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    // Observe the html element for data-theme changes
    observer.observe(document.documentElement, { attributes: true });
    
    // Also observe body for class changes
    observer.observe(document.body, { attributes: true });

    // Listen for custom theme change event
    const handleThemeChange = () => checkTheme();
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <>
      <style>{`
        /* Light theme override for your existing variables */
        :root[data-theme="light"], 
        body.light-mode {
          --primary: #FCFCFC;
          --secondary: #121212;
          --text-color: #121212;
          --accent-color: #C80808;
          --accent-color-2: #f0f0f0;
          --accent-color-3: #0a8f3c;
          --accent-color-4: #00000010;
          --accent-color-5: #00000020;
          --accent-color-6: rgba(0, 0, 0, 0.05);
          --accent-border-1: #e0e0e0;
          --dropdown-box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          --accent-color-placeholder: #666666;
          --overlay-sidebar: rgba(0, 0, 0, 0.1);
        }

        /* Dark theme (your original variables) */
        :root[data-theme="dark"],
        body.dark-mode {
          --primary: #121212;
          --secondary: #FCFCFC;
          --text-color: #DAFAF4;
          --accent-color: #C80808;
          --accent-color-2: #313131;
          --accent-color-3: #8AFFAC;
          --accent-color-4: #00000030;
          --accent-color-5: #00000073;
          --accent-color-6: rgba(255, 255, 255, 0.041);
          --accent-border-1: #313131;
          --dropdown-box-shadow: 0 10px 30px rgba(45, 45, 45, 0.2);
          --accent-color-placeholder: #cccccc;
          --overlay-sidebar: rgba(51, 51, 51, 0.5);
        }

        /* Hero Section Styles */
        #hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background-color: var(--primary);
          transition: background-color var(--animation-fast) ease;
        }
        
        .grid-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: ${darkMode 
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          };
        }
        
        .accent-shape-1 {
          position: absolute;
          top: 5rem;
          right: 10%;
          width: 18rem;
          height: 18rem;
          background-color: ${darkMode ? 'rgba(200, 8, 8, 0.1)' : 'rgba(200, 8, 8, 0.05)'};
          border-radius: 9999px;
          filter: blur(48px);
          transition: background-color var(--animation-fast) ease;
        }
        
        .accent-shape-2 {
          position: absolute;
          bottom: 5rem;
          left: 5%;
          width: 24rem;
          height: 24rem;
          background-color: ${darkMode ? 'rgba(200, 8, 8, 0.05)' : 'rgba(200, 8, 8, 0.02)'};
          border-radius: 9999px;
          filter: blur(48px);
          transition: background-color var(--animation-fast) ease;
        }
        
        #hero-container {
          position: relative;
          z-index: 10;
          max-width: 90%;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .hero-grid {
          display: grid;
          gap: 3rem;
          align-items: center;
        }
        
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: ${darkMode ? 'var(--accent-color-6)' : 'rgba(200, 8, 8, 0.08)'};
          border: 1px solid ${darkMode ? 'var(--accent-border-1)' : 'rgba(200, 8, 8, 0.2)'};
          border-radius: var(--global-border-radius-btn);
          padding: 0.5rem 1.25rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          transition: all var(--animation-fast) ease;
        }
        
        .badge-dot {
          width: 0.5rem;
          height: 0.5rem;
          background-color: var(--accent-color);
          border-radius: 9999px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .badge-text {
          color: var(--accent-color);
          font-family: var(--font-family-2);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.025em;
        }
        
        .hero-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.1;
          letter-spacing: -0.025em;
          font-family: var(--font-family-1);
          transition: color var(--animation-fast) ease;
        }
        
        @media (min-width: 768px) {
          .hero-title { 
            font-size: 3rem; 
            line-height: 1.2;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-title { 
            font-size: 3.75rem; 
            line-height: 0.6;
          }
        }
        
        .hero-title-accent {
          display: block;
          color: var(--accent-color);
          margin-top: 0.5rem;
          font-family: var(--font-family-1);
        }
        
        .hero-description {
          margin-top: 1.5rem;
          font-size: 1.125rem;
          color: ${darkMode ? 'rgba(218, 250, 244, 0.7)' : 'rgba(18, 18, 18, 0.8)'};
          line-height: 1.625;
          max-width: 32rem;
          font-family: var(--font-family-2);
          transition: color var(--animation-fast) ease;
        }
        
        .button-group {
          margin-top: 2.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .btn-primary {
          background-color: var(--accent-color);
          color: #fff;
          padding: 1rem 2rem;
          font-size: 1rem;
          border-radius: var(--global-border-radius-btn);
          border: none;
          cursor: pointer;
          transition: all var(--animation-fast) ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          font-family: var(--font-family-2);
        }
        
        .btn-primary:hover {
          background-color: ${darkMode ? '#e50909' : '#a00606'};
          transform: translateY(-2px);
          box-shadow: 0 10px 25px ${darkMode ? 'rgba(200, 8, 8, 0.3)' : 'rgba(200, 8, 8, 0.2)'};
        }
        
        .btn-outline {
          border: 1px solid var(--accent-border-1);
          color: var(--text-color);
          padding: 1rem 2rem;
          font-size: 1rem;
          border-radius: var(--global-border-radius-btn);
          background: transparent;
          cursor: pointer;
          transition: all var(--animation-fast) ease;
          font-weight: 600;
          font-family: var(--font-family-2);
        }
        
        .btn-outline:hover {
          background-color: var(--accent-color-6);
          transform: translateY(-2px);
          box-shadow: var(--dropdown-box-shadow);
        }
        
        .stats-grid {
          margin-top: 3.5rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        @media (min-width: 1024px) {
          .stat-item {
            text-align: left;
          }
        }
        
        .stat-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--accent-color);
          margin-bottom: 0.5rem;
          margin-left: auto;
          margin-right: auto;
          transition: color var(--animation-fast) ease;
        }
        
        @media (min-width: 1024px) {
          .stat-icon {
            margin-left: 0;
            margin-right: 0;
          }
        }
        
        .stat-value {
          color: var(--text-color);
          font-weight: 600;
          font-size: 1rem;
          font-family: var(--font-family-1);
        }
        
        .stat-label {
          color: ${darkMode ? 'rgba(218, 250, 244, 0.6)' : 'rgba(18, 18, 18, 0.6)'};
          font-size: 0.875rem;
          margin-top: 0.125rem;
          font-family: var(--font-family-2);
          transition: color var(--animation-fast) ease;
        }
        
        .image-container {
          position: relative;
          display: flex;
          justify-content: center;
        }
        
        @media (min-width: 1024px) {
          .image-container {
            justify-content: flex;
          }
        }
        
        .image-wrapper {
          position: relative;
        }
        
        .image-accent {
          position: absolute;
          // inset: -1rem;
          // background: ${darkMode ? 'linear-gradient(135deg, rgba(200, 8, 8, 0.1), transparent)'
            : 'linear-gradient(135deg, rgba(200, 8, 8, 0.05), transparent)'
          };
          // border-radius: 1.5rem;
          // filter: blur(20px);
        }
        
        .image-frame {
          // position: relative;
          width: 100%;
          max-width: 18rem;
          height: 20rem;
          // overflow: hidden;
          // border-radius: var(--global-border-radius);
          // border: 1px solid var(--accent-border-1);
          // box-shadow: var(--dropdown-box-shadow);
        // }
        
        @media (min-width: 768px) {
          .image-frame {
            max-width: 30rem;
            height: 24rem;
          }
        }
        
        @media (min-width: 1024px) {
          .image-frame {
            width: 100%;
            height: 650px;
          }
        }
        
        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          inset: 0;
          // background: ${darkMode 
          //   ? 'linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent 50%)'
          //   : 'linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent 50%)'
          // };
        }
        
        .image-caption {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
        }
        
        .caption-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .caption-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .floating-badge {
          position: absolute;
          bottom: 10rem;
          left: -3rem;
          background-color: var(--accent-color);
          color: #fff;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px ${darkMode ? 'rgba(200, 8, 8, 0.3)' : 'rgba(200, 8, 8, 0.2)'};
        }
        
        .floating-badge-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .floating-badge-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .icon-arrow {
          margin-left: 0.5rem;
          width: 1rem;
          height: 1rem;
          transition: transform var(--animation-fast) ease;
        }
        
        .btn-primary:hover .icon-arrow {
          transform: translateX(0.25rem);
        }
        
        /* Smooth transitions for theme switching */
        .hero-section * {
          transition: background-color var(--animation-fast) ease, 
                      color var(--animation-fast) ease, 
                      border-color var(--animation-fast) ease,
                      box-shadow var(--animation-fast) ease,
                      opacity var(--animation-fast) ease;
        }
      `}</style>
      
      <section className="hero-section" id="hero-section">
        {/* Subtle grid pattern */}
        <div className="grid-pattern" />
        
        {/* Red accent shapes */}
        <div className="accent-shape-1" />
        <div className="accent-shape-2" />
        
        <div className="hero-container" id="hero-container">
          <div className="hero-grid">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="badge">
                <span className="badge-dot" />
                <span className="badge-text">18+ Years of Excellence</span>
              </div>
              
              <h1 className="hero-title">
                <AnimatedCharacters text="Expert Guidance." />
                <span className="hero-title-accent">
                  <br />
                  <AnimatedCharacters text="Real Results" isAccent={true} />
                </span>
              </h1>
              
              <p className="hero-description">
                18+ years of global experience insight shaping the future leaders in marketing and business education.
              </p>
              
              <div className="button-group">
                <button onClick={onBookConsultation} className="btn-primary">
                  Book Free Consultation
                  <ArrowRight className="icon-arrow" />
                </button>
                <button
                  className="btn-outline"
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Courses
                </button>
              </div>

              {/* Quick Stats */}
              <div className="stats-grid">
                {[
                  { icon: BookOpen, label: "E-Books", value: "Published" },
                  { icon: GraduationCap, label: "Students", value: "Mentored" },
                  { icon: CalendarCheck, label: "Experience", value: "18+ Years" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                    className="stat-item"
                  >
                    <stat.icon className="stat-icon" />
                    <p className="stat-value">{stat.value}</p>
                    <p className="stat-label">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="image-container"
            >
              
              <div className="image-wrapper">
                <div className="image-accent" />
                
                <div className="image-frame">
                  
                  <img
                    src={img}
                    alt="Mr. Siddiqui"
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                  <div className="image-overlay" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}