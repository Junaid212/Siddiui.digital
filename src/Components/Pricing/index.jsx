import React from "react";

const PricingSection = () => {
    return(
        <>
            <div className="section spacious-bottom">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="pricing-heading-container">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Core philosophy</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Marketing, Reclassified</h2>
                        </div>
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 align-items-center grid-spacer-2">
                            <div className="col">
                                <div className="card card-pricing">
                                    <h3 className="secondary-accent">What does “Marketing, Reclassified.” mean?</h3>
                                    
                                    <div className="card price-container">
                                        <div className="price-wrapper">
                                            {/* <span className="price">$99</span>
                                            <span className="price-detail">Per Month</span> */}
                                        </div>
                                    </div>
                                    <p>Marketing has long been misclassified as promotion, advertising, communication, or sales support. While these functions are important, they represent only a small part of marketing’s true role.</p>
                                    {/* <h4 className="secondary-accent">Features</h4> */}
                                    <ul className="circle-notch-list">
                                        <li>Marketing, Reclassified. repositions marketing as the Strategic Intelligence of Business—the discipline responsible for understanding markets, identifying value opportunities, shaping demand, guiding innovation, and driving sustainable growth.</li>
                                        <li>Marketing is not simply about communicating value. It is about discovering, creating, adapting, and governing value.</li>
                                        {/* <li>Ad in nullam libero commodo magnis tristique</li>
                                        <li>Elit class porta interdum commodo nisi sociosqu</li>
                                        <li>Ad fusce habitasse mauris platea faucibus</li>
                                        <li>Luctus luctus quisque semper ipsum</li>
                                        <li>Senectus non tristique ipsum orci tristique</li> */}
                                    </ul>
                                    {/* <a href="#" className="btn btn-accent"></a> */}
                                    {/* <p className="pricing-note">* Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> */}
                                </div>
                            </div>

                            <div className="col order-lg-2 order-md-3 order-2">
                                <div className="card card-pricing">
                                    <div className="d-flex justify-content-center">
                                        <div className="popular-price">
                                            {/* <h5 className="text-center">Popular Plan</h5> */}
                                        </div>
                                    </div>
                                    <h3 className="secondary-accent">How do you differentiate marketing from traditional promotion and advertising?</h3>
                                    <p>Promotion and advertising focus on communicating messages.</p>
                                    <div className="card price-container">
                                        <div className="price-wrapper">
                                            {/* <span className="price">$149</span>
                                            <span className="price-detail">Per Month</span> */}
                                        </div>
                                    </div>
                                    <h4 className="secondary-accent">Marketing focuses on:</h4>
                                    <ul className="circle-notch-list">
                                        <li>Understanding customers and stakeholders</li>
                                        <li>Identifying unmet needs and opportunities</li>
                                        <li>Designing value propositions</li>
                                        <li>Guiding innovation and business decisions</li>
                                        <li>Building sustainable competitive advantage</li>
                                        <li>Creating long-term organizational growth</li>
                                        {/* <li>Senectus non tristique ipsum orci tristique</li> */}
                                    </ul>
                                    <a href="#" className="btn btn-accent">“How do we communicate?”</a>
                                    <p className="pricing-note">What value should be created, for whom, why, and how should it evolve over time?</p>
                                </div>
                            </div>
                            <div class="col order-lg-3 order-md-2 order-3">
                            <div class="card card-pricing">
                                <h3 class="secondary-accent">What role do purpose, adaptability, and long-term value creation play?</h3>
                                {/* <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> */}
                                <div class="card price-container">
                                    <div class="price-wrapper">
                                        {/* <span class="price">$199</span>
                                        <span class="price-detail">Per Month</span> */}
                                    </div>
                                </div>
                                {/* <h4 class="secondary-accent">Purpose</h4> */}
                                <ul class="circle-notch-list">
                                    <li><b className="secondary-accent">Purpose : </b>Purpose defines why an organization exists beyond transactions. It serves as the foundation for value creation and strategic direction.</li>
                                    <li><b className="secondary-accent">Adaptability : </b>Markets continuously change. Customer expectations, technology, competition, and societal needs evolve. Organizations must continuously adapt their value proposition to remain relevant</li>
                                    <li><b className="secondary-accent">Long-Term Value Creation : </b>Success is not measured solely by short-term sales. Sustainable organizations create value for customers, employees, partners, communities, and shareholders over time.</li>
                                </ul>
                                {/* <a href="#" class="btn btn-accent"></a> */}
                                {/* <p class="pricing-note">* Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p> */}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PricingSection;