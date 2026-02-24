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
                                <h6 className="font-family-1 accent-color">Pricing Plan</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Value-Driven Pricing for Every Stage of Growth</h2>
                        </div>
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 align-items-center grid-spacer-2">
                            <div className="col">
                                <div className="card card-pricing">
                                    <h3 className="secondary-accent">Basic</h3>
                                    <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    <div className="card price-container">
                                        <div className="price-wrapper">
                                            <span className="price">$99</span>
                                            <span className="price-detail">Per Month</span>
                                        </div>
                                    </div>
                                    <h4 className="secondary-accent">Features</h4>
                                    <ul className="circle-notch-list">
                                        <li>Consectetur venenatis penatibus primis tristique</li>
                                        <li>Massa arcu sociosqu nascetur magna parturient</li>
                                        <li>Ad in nullam libero commodo magnis tristique</li>
                                        <li>Elit class porta interdum commodo nisi sociosqu</li>
                                        <li>Ad fusce habitasse mauris platea faucibus</li>
                                        <li>Luctus luctus quisque semper ipsum</li>
                                        <li>Senectus non tristique ipsum orci tristique</li>
                                    </ul>
                                    <a href="#" className="btn btn-accent">Choose Package</a>
                                    <p className="pricing-note">* Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                </div>
                            </div>

                            <div className="col order-lg-2 order-md-3 order-2">
                                <div className="card card-pricing">
                                    <div className="d-flex justify-content-center">
                                        <div className="popular-price">
                                            <h5 className="text-center">Popular Plan</h5>
                                        </div>
                                    </div>
                                    <h3 className="secondary-accent">Bussiness</h3>
                                    <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                    <div className="card price-container">
                                        <div className="price-wrapper">
                                            <span className="price">$149</span>
                                            <span className="price-detail">Per Month</span>
                                        </div>
                                    </div>
                                    <h4 className="secondary-accent">Features</h4>
                                    <ul className="circle-notch-list">
                                        <li>Consectetur venenatis penatibus primis tristique</li>
                                        <li>Massa arcu sociosqu nascetur magna parturient</li>
                                        <li>Ad in nullam libero commodo magnis tristique</li>
                                        <li>Elit class porta interdum commodo nisi sociosqu</li>
                                        <li>Ad fusce habitasse mauris platea faucibus</li>
                                        <li>Luctus luctus quisque semper ipsum</li>
                                        <li>Senectus non tristique ipsum orci tristique</li>
                                    </ul>
                                    <a href="#" className="btn btn-accent">Choose Package</a>
                                    <p className="pricing-note">* Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                </div>
                            </div>
                            <div class="col order-lg-3 order-md-2 order-3">
                            <div class="card card-pricing">
                                <h3 class="secondary-accent">Enterprise</h3>
                                <p>Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                                <div class="card price-container">
                                    <div class="price-wrapper">
                                        <span class="price">$199</span>
                                        <span class="price-detail">Per Month</span>
                                    </div>
                                </div>
                                <h4 class="secondary-accent">Features</h4>
                                <ul class="circle-notch-list">
                                    <li>Consectetur venenatis penatibus primis tristique</li>
                                    <li>Massa arcu sociosqu nascetur magna parturient</li>
                                    <li>Ad in nullam libero commodo magnis tristique</li>
                                    <li>Elit class porta interdum commodo nisi sociosqu</li>
                                    <li>Ad fusce habitasse mauris platea faucibus</li>
                                    <li>Luctus luctus quisque semper ipsum</li>
                                    <li>Senectus non tristique ipsum orci tristique</li>
                                </ul>
                                <a href="#" class="btn btn-accent">Choose Package</a>
                                <p class="pricing-note">* Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
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