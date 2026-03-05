import { useState, useEffect } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";
import { api } from "../../api";

// Fallback data if backend is unavailable
const fallbackQuestions = [
  {
    id: 1,
    question: "What's your preferred work environment?",
    options: [
      { id: "f1", text: "Remote from home", percentage: 42, votes: 847 },
      { id: "f2", text: "Hybrid (2-3 days office)", percentage: 31, votes: 625 },
      { id: "f3", text: "Full-time office", percentage: 15, votes: 302 },
      { id: "f4", text: "Coworking space", percentage: 12, votes: 241 },
    ],
  },
  {
    id: 2,
    question: "Which technology are you most excited about?",
    options: [
      { id: "f5", text: "Artificial Intelligence", percentage: 38, votes: 1254 },
      { id: "f6", text: "Quantum Computing", percentage: 28, votes: 923 },
      { id: "f7", text: "Blockchain & Web3", percentage: 19, votes: 627 },
      { id: "f8", text: "Extended Reality (AR/VR)", percentage: 15, votes: 495 },
    ],
  },
  {
    id: 3,
    question: "How do you prefer to learn new skills?",
    options: [
      { id: "f9", text: "Online courses & tutorials", percentage: 45, votes: 1823 },
      { id: "f10", text: "Reading documentation", percentage: 27, votes: 1094 },
      { id: "f11", text: "Building projects", percentage: 20, votes: 810 },
      { id: "f12", text: "Attending workshops", percentage: 8, votes: 324 },
    ],
  },
];

export default function Questionnaire({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [particles, setParticles] = useState([]);
  const [liveResults, setLiveResults] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch questions from backend on mount
  useEffect(() => {
    api.getQuestions()
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          const mapped = data.questions.map((q) => ({
            id: q.id,
            question: q.question_text,
            options: (q.question_options || []).map((opt) => ({
              id: opt.id,
              text: opt.option_text,
              percentage: 0,
              votes: opt.votes || 0,
            })),
          }));
          setQuestions(mapped);
        } else {
          setQuestions(fallbackQuestions);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setQuestions(fallbackQuestions);
        setUsingFallback(true);
      });
  }, []);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);

  const handleOptionSelect = async (index) => {
    setSelectedOption(index);
    const currentQ = questions[currentQuestion];
    const selectedOpt = currentQ.options[index];

    if (!usingFallback) {
      try {
        const result = await api.submitVote(currentQ.id, selectedOpt.id);
        if (result.results) {
          setLiveResults(result.results);
        }
      } catch (err) {
        console.error("Vote submit error:", err);
      }
    }

    setTimeout(() => setShowResults(true), 300);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setShowResults(false);
      setSelectedOption(null);
      setLiveResults(null);
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleSubmit = () => {
    setShowThankYou(true);
    // Mark questionnaire as completed in localStorage
    localStorage.setItem('questionnaireCompleted', 'true');
    // Close the modal after showing thank you message
    setTimeout(() => onClose(), 3000);
  };

  if (questions.length === 0) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#555', fontSize: '1.2rem' }}>Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Helper: get percentage for an option (prefer liveResults from API)
  const getOptionPercentage = (option) => {
    if (liveResults) {
      const found = liveResults.find((r) => r.id === option.id);
      if (found) return found.percentage;
    }
    return option.percentage;
  };

  if (showThankYou) {
    return (
      <div className="thankyou-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div className="relative z-10 text-center">
          <div className="glass-card thankyou-card">
            <div className="check-icon-wrapper">
              <CheckCircle />
            </div>
            <h1 className="thankyou-title">Thank You!</h1>
            <p className="thankyou-text">
              Your responses have been recorded and will help us understand your
              preferences better.
            </p>
            <div className="thankyou-badge">
              <span>Questionnaire Completed Successfully</span>
            </div>
          </div>
        </div>

        {/* Inline styles – you can move these to a CSS file */}
        <style>{`
          .thankyou-container {
            min-height: 60vh;
            background: linear-gradient(to bottom right, #ebe1e1, #e0e0e0, #e9e3e3);
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(239, 68, 68, 0.3);
            border-radius: 9999px;
            pointer-events: none;
            animation: float 15s infinite linear;
          }
          @keyframes float {
            0% { transform: translate(0, 0); opacity: 0.3; }
            50% { opacity: 0.8; transform: translate(30px, -30px); }
            100% { opacity: 0.3; transform: translate(60px, -60px); }
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            
          }
          .thankyou-card {
            padding: 3rem;
            max-width: 42rem;
            text-align: center;
          }
          @media (min-width: 768px) {
            .thankyou-card {
              padding: 4rem;
            }
          }
          .check-icon-wrapper svg {
            width: 6rem;
            height: 6rem;
            color: #ef4444;
          }
          .thankyou-title {
            font-size: 2.25rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 1rem;
          }
          @media (min-width: 768px) {
            .thankyou-title {
              font-size: 3rem;
            }
          }
          .thankyou-text {
            font-size: 1.125rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
          }
          .thankyou-badge {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: linear-gradient(to right, rgba(239, 68, 68, 0.2), rgba(225, 29, 72, 0.2));
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 0.75rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      <div className="content-wrapper">
        <div className="inner-container">
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-text">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              {/* <span className="progress-text">{Math.round(progress)}%</span> */}
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="glass-card p-8 md:p-12">
            <h2 className="question-title">{currentQ.question}</h2>

            <div className="options-container">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const pct = getOptionPercentage(option);
                const allPcts = currentQ.options.map((o) => getOptionPercentage(o));
                const maxPercentage = Math.max(...allPcts);
                const isTopChoice = pct === maxPercentage;

                return (
                  <button
                    key={index}
                    onClick={() => !showResults && handleOptionSelect(index)}
                    disabled={showResults}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="option-card-content">
                      <div className="option-left">
                        {isSelected && <CheckCircle className="selected-icon" />}
                        <span className="option-text">{option.text}</span>
                      </div>
                      {showResults && (
                        <div className="results-info">
                          <span className={`percentage ${isTopChoice ? "highlight" : ""}`}>
                            {pct}%
                          </span>
                        </div>
                      )}
                    </div>
                    {showResults && (
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${isTopChoice ? "highlight" : "normal"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {showResults && currentQuestion < questions.length - 1 && (
              <button onClick={handleNext} className="next-button">
                Next Question <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {showResults && currentQuestion === questions.length - 1 && (
              <button onClick={handleSubmit} className="next-button">
                Submit <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline styles – move to CSS if desired */}
      <style>{`
        .app-container {
          min-height: 80vh;
          background: linear-gradient(to bottom right, #bababa, #cdcdcd, #ababab);
          position: relative;
          overflow: hidden;
          // opacity:0.7;
          
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(239, 68, 68, 0.3);
          border-radius: 9999px;
          pointer-events: none;
          animation: float 15s infinite linear;
        }
        @keyframes float {
          0% { transform: translate(0, 0); opacity: 0.3; }
          50% { opacity: 0.8; transform: translate(30px, -30px); }
          100% { opacity: 0.3; transform: translate(60px, -60px); }
        }
        .content-wrapper {
          position: relative;
          z-index: 10;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .inner-container {
          width: 100%;
          max-width: 48rem;
        }
        .progress-container {
          margin-bottom: 2rem;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .progress-text {
          color: rgba(73, 0, 0, 0.74) !important;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .progress-bar-track {
          height: 0.5rem;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
          backdrop-filter: blur(4px);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(to right, #ef4444, #e11d48);
          transition: width 0.7s ease-out;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: all 0.5s;
          padding:20px;
          
        }
        .question-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #2b0909 !important;
          margin-bottom: 2rem;
          line-height: 1.25;
        }
        @media (min-width: 768px) {
          .question-title {
            font-size: 2.25rem;
          }
        }
        .options-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .option-card {
          width: 100%;
          text-align: left;
          padding: 1rem 1.5rem;
          border: 1px solid rgba(254, 1, 1, 0.48);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.5s;
          cursor: pointer;
        }
        .option-card.selected {
          border-color: rgba(228, 10, 10, 0.5);
          background: rgb(110, 109, 109);
        }
        .option-card:disabled {
          cursor: default;
        }
        .option-card-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }
        .option-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .selected-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #15ff00;
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .option-text {
          font-size: 1.125rem;
          font-weight: 500;
          color: rgb(82, 33, 33) !important;
        }
        .option-card.selected .option-text {
          color: #dadada;
        }
        .results-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .vote-count {
          color: rgb(203, 203, 203) !important;
          font-size: 0.875rem;
        }
        .percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: #e7e7e7 !important;
        }
        .percentage.highlight {
          color: #ff0000;
        }
        .bar-container {
          margin-top: 1rem;
          height: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 1s ease-out;
        }
        .bar-fill.highlight {
          background: linear-gradient(to right, #ff0000, #a70505);
        }
        .bar-fill.normal {
          background: linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
        }
        .next-button {
          margin-top: 2rem;
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(to right, #ff0000, #a40303);
          color: #fff;
          font-weight: 600;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .next-button:hover {
          box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.5);
          transform: scale(1.05);
        }
        @media (min-width: 768px) {
          .next-button {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}