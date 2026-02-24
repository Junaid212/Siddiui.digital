import React from "react";

const PageNotFoundSection = () => {
    return (
        <div className="section notfound-section">
            <div className="hero-container">
                <div className="notfound-container">
                    <span className="text-404">404</span>
                    <h2>Page Not Found!</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                        tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                    <div>
                        <a href="/" className="btn btn-accent">
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
export default PageNotFoundSection;