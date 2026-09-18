import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { X, Users, ArrowRight } from "lucide-react";
import "./PortfolioCard.css";

const PortfolioCard = ({
    logo,
    image,
    category,
    title,
    content,
    detailedContent,
    bestSuitedFor,
    link,
    speed = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    setIsOpen(false);
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                document.body.style.overflow = "";
                window.removeEventListener("keydown", handleKeyDown);
            };
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    return (
        <>
            <div className={`card card-portfolio animate-box animate__animated ${speed}`} data-animate="animate__fadeIn">
                <img src={image} alt={title || "Portfolio Image"} className="img-fluid" />
                {/* <div className="portfolio-logo">
                    <img src={logo} alt="Portfolio Logo" className="img-fluid" />
                    <p className="accent-color">{category}</p>
                </div> */}
                <div className="portfolio-content">
                    {/* <p className="accent-color">{category}</p> */}
                    <h4 className="secondary-accent">{title}</h4>
                    <p className="secondary-accent" style={{ fontSize: '14px' }}>{content}</p>
                    <div>
                        <button
                            type="button"
                            className="btn btn-accent"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(true);
                            }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && ReactDOM.createPortal(
                <div
                    className="portfolio-modal-overlay"
                    onClick={() => setIsOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`portfolio-modal-title-${title}`}
                >
                    <div
                        className="portfolio-modal-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="portfolio-modal-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        {image && (
                            <div className="portfolio-modal-header-img">
                                <img src={image} alt={title} />
                                {/* <div className="portfolio-modal-header-gradient" /> */}
                                {/* {category && (
                                    <div className="portfolio-modal-badge-container">
                                        <span className="portfolio-modal-tag">{category}</span>
                                    </div>
                                )} */}
                            </div>
                        )}

                        <div className="portfolio-modal-body">
                            <h3 id={`portfolio-modal-title-${title}`} className="portfolio-modal-title">
                                {title}
                            </h3>
                            <p className="portfolio-modal-desc">
                                {detailedContent || content}
                            </p>

                            {bestSuitedFor && (
                                <div className="portfolio-modal-suited">
                                    <div className="portfolio-modal-suited-header">
                                        <Users size={15} />
                                        <span>Best suited for</span>
                                    </div>
                                    <p className="portfolio-modal-suited-text">{bestSuitedFor}</p>
                                </div>
                            )}
                        </div>

                        <div className="portfolio-modal-footer">
                            <button
                                type="button"
                                className="portfolio-modal-btn-close"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </button>
                            {/* <Link
                                to="/courses"
                                className="portfolio-modal-btn-action"
                                onClick={() => setIsOpen(false)}
                            >
                                Explore Courses <ArrowRight size={15} />
                            </Link> */}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default PortfolioCard;