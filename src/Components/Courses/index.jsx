import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const getStyles = (darkMode) => `
  // /* Theme variables */
  // :root {
  //   --primary: ${darkMode ? '#121212' : '#FCFCFC'};
  //   --secondary: ${darkMode ? '#FCFCFC' : '#121212'};
  //   --text-color: ${darkMode ? '#DAFAF4' : '#121212'};
  //   --accent-color: #C80808;
  //   --accent-color-2: ${darkMode ? '#313131' : '#f0f0f0'};
  //   --accent-color-3: ${darkMode ? '#ff8a8a' : '#8f110a'};
  //   --accent-color-4: ${darkMode ? '#00000030' : '#00000010'};
  //   --accent-color-5: ${darkMode ? '#00000073' : '#00000020'};
  //   --accent-color-6: ${darkMode ? 'rgba(255, 255, 255, 0.041)' : 'rgba(0, 0, 0, 0.05)'};
  //   --accent-border-1: ${darkMode ? '#313131' : '#e0e0e0'};
  //   --accent-color-placeholder: ${darkMode ? '#cccccc' : '#666666'};
  //   --animation-fast: 300ms;
  // }

  /* Keyframes (unchanged) */
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  /* Animation classes */
  .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
  .animate-slide-down { animation: slide-down 0.6s ease-out forwards; }
  .animate-slide-up {
    animation: slide-up 0.7s ease-out 0.2s forwards;
    opacity: 0;
  }
  .animate-slide-up-delayed {
    animation: slide-up 0.7s ease-out 0.4s forwards;
    opacity: 0;
  }
  .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

  /* Custom utility classes (replacing Tailwind) */
  .min-h-screen { min-height: 100vh; }
  .bg-gray-50 { 
    background-color: var(--primary);
    transition: background-color var(--animation-fast) ease;
  }
  .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
  .px-6 { padding-left: 2rem; padding-right: 1.5rem; }
  .max-w-7xl { max-width: 90rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  .gap-12 { gap: 3rem; }
  .gap-32 { gap: 10rem; }

  /* Make cards smaller and add more spacing — on wide screens switch to
     a flex layout so items can be justified with space-between. */
  .card-outer {
    position: relative;
    max-width: 36rem; /* keep cards compact */
    width: 100%;
  }

  @media (min-width: 1024px) {
    .lg-grid-cols-2 { grid-template-columns: repeat(2, 1fr); }

    .grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10rem; /* horizontal and vertical spacing between cards */
    }

    .card-outer {
      width: calc(50% - 2rem);
      max-width: 26rem;
    }
  }

  /* Card styles */
  .card-outer {
    position: relative;
  }
  .group { /* marker for hover effects */ }
  .group-image { /* marker for image group */ }
  .group-btn { /* marker for button group */ }

  /* Left decorations */
  .left-decor {
    position: absolute;
    left: -2rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .line {
    width: 1px;
    height: 8rem;
    background: linear-gradient(to bottom, transparent, ${darkMode ? '#ff8a8a' : '#febab4'}, transparent);
    opacity: 0.5;
    transition: opacity 700ms;
  }
  .dot {
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    background-color: ${darkMode ? '#ff8a8a' : '#ffd5d5'};
    transition: all 500ms;
  }
  .group:hover .line {
    opacity: 1;
  }
  .group:hover .dot {
    background-color: ${darkMode ? '#ff6e6e' : '#fc8484'};
    transform: scale(1.25);
  }

  .writing-mode-vertical {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: var(--accent-color-placeholder);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  /* Content spacing */
  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Hashtag area */
  .hashtag-wrapper {
    position: relative;
    overflow: hidden;
  }
  .pulse-dot {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    background-color: ${darkMode ? '#ff8a8a' : '#fc8484'};
    opacity: 0.6;
    z-index: 10;
  }
  .hashtag {
    color: var(--accent-color);
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.025em;
  }

  /* Title */
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-color) !important;
    line-height: 1.25;
    letter-spacing: -0.025em;
  }
  @media (min-width: 768px) {
    .title {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
  }

  /* Image container */
  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 1.5rem;
  }
  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
    opacity: 0;
    transition: opacity 500ms;
    z-index: 10;
  }
  .group-image:hover .image-overlay {
    opacity: 1;
  }
  .card-image {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
    border-radius: 1.5rem;
    transition: transform 700ms cubic-bezier(0, 0, 0.2, 1);
  }
  .group-image:hover .card-image {
    transform: scale(1.05);
  }

  /* Button */
  .project-button {
    background-color: var(--accent-color);
    color: white;
    font-weight: 600;
    padding: 1rem 2rem;
    border-radius: 9999px;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 300ms;
    cursor: pointer;
  }
  .project-button:hover {
    background-color: #ce2222;
    gap: 1.25rem;
    box-shadow: 0 10px 15px -3px rgba(247, 85, 85, 0.5);
  }
  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 300ms;
  }
  .project-button:hover .btn-icon {
    transform: translateX(0.25rem);
  }
`;

function CoursPage() {
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

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = getStyles(darkMode);
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg-grid-cols-2 gap-32">
          <CaseStudyCard
            caseNumber="01"
            hashtag="#Social Media Management"
            title="BOOSTING BRAND VISIBILITY: A SOCIAL MEDIA REVAMP SUCCESS STORY"
            imageUrl="/assets/images/dummy-img-600x600.jpg"
          />

          <CaseStudyCard
            caseNumber="02"
            hashtag="#Content Creation and Strategy"
            title=" INCREASED CONVERSIONS: A COMPREHENSIVE APPROACH"
            imageUrl="/assets/images/dummy-img-600x600.jpg"
          />
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({ caseNumber, hashtag, title, imageUrl }) {
  return (
    <div className="card-outer group animate-fade-in">
      {/* Left decoration */}
      <div className="left-decor">
        <div className="line"></div>
        <div className="dot"></div>
        <div className="writing-mode-vertical">Course {caseNumber}</div>
      </div>

      <div className="content">
        {/* Hashtag with pulsing dot */}
        <div className="hashtag-wrapper">
          <div className="pulse-dot animate-pulse-slow"></div>
          <span className="hashtag animate-slide-down">{hashtag}</span>
        </div>

        <h2 className="title animate-slide-up">{title}</h2>

        {/* Image with overlay */}
        <div className="image-container group-image">
          <div className="image-overlay"></div>
          <img
            src={imageUrl}
            alt={title}
            className="card-image"
          />
        </div>

        {/* Button */}
        <button className="project-button group-btn animate-slide-up-delayed">
          <ChevronRight className="btn-icon" />
          View Course
        </button>
      </div>
    </div>
  );
}

export default CoursPage;