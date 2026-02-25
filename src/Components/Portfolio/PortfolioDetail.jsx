import React from "react";

const PortfolioDetailSection = () => {
    return (
        <div className="section">
            <div className="hero-container">
                <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                    <div className="col col-md-4">
                        <div className="d-flex flex-column gspace-2">
                            {/* <div className="card project-logo">
                            <img
                                src="/assets/images/partner-4-65f90f1a4e273.webp"
                                alt="Portfolio Logo"
                                className="img-fluid"
                            />
                            </div> */}
                            <div className="image-container">
                            <img
                                src="./assets/images/dummy-img-600x800.jpg"
                                alt="Portfolio Image"
                                className="img-fluid"
                            />
                            </div>
                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card project-detail">
                                <h4 className="secondary-accent">Topic</h4>
                                <p>Marketing</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card project-detail">
                                <h4 className="secondary-accent">Published Date</h4>
                                <p>Aug 11, 2025</p>
                                </div>
                            </div>
                            {/* <div className="col">
                                <div className="card project-detail">
                                <h4 className="secondary-accent">Service</h4>
                                <p>On-Page SEO</p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card project-detail">
                                <h4 className="secondary-accent">Budget</h4>
                                <p>$5000</p>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-8">
                        <div className="portfolio-details">
                            <h3>Digital Marketing Strategy: An Integrated Approach to Online Marketing</h3>
                            <div>
                                <p>
                                    Author Simon Kingsnorth demonstrates how to formulate the best strategy 
                                    for a company, using digital marketing techniques with business strategy 
                                    and established marketing models. These include the 7 P’s, Porter’s Five 
                                    Forces, and Customer Lifetime Value. 
                                </p>
                                <p>
                                    This book is a second edition of the best-selling guide, Digital Marketing Strategy. Recommended by the Chartered Institute of Marketing. It uses an accessible, step-by-step framework that enables the planning, integration and measurement of each digital platform and technique, which assists the selection, alignment, and management of the digital channels. 
                                </p>
                                {/* <p>
                                    Imperdiet a mattis finibus nibh suspendisse auctor rutrum.
                                    Fames fermentum iaculis lacinia proin diam vitae. Aliquam
                                    aptent augue conubia non varius est sollicitudin gravida.
                                </p> */}
                                </div>
                
                                <h3>About Book</h3>
                                <div>
                                <p>
                                    This book is a second edition of the best-selling guide, Digital Marketing Strategy. Recommended by the Chartered Institute of Marketing. It uses an accessible, step-by-step framework that enables the planning, integration and measurement of each digital platform and technique, which assists the selection, alignment, and management of the digital channels. 
                                </p>
                                <p>
                                    In addition to this, there are also downloadable templates and resources. It’s an ideal road map for any marketer to streamline a digital marketing strategy for measurable, optimised results. 
                                </p>
                                <p>“This is a really good book to read for those with experience with digital marketing, or for those who like me don’t have a great deal of experience but need to learn more.”</p>
                            </div>
            
                            {/* <h3>Strategy</h3>
                                <p>
                                Elit class porta interdum commodo nisi sociosqu maecenas curae.
                                Ad in nullam libero commodo magnis tristique, accumsan etiam
                                viverra. Massa arcu sociosqu nascetur magna parturient morbi
                                ultrices senectus.
                                </p>
                            <div className="row row-cols-lg-2 row-cols-1">
                            <div className="col">
                                <div className="d-flex flex-column h-100 gap-4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                                    dapibus leo.
                                </p>
                                <ul className="circle-notch-list">
                                    <li>
                                    Consequat orci maecenas purus cursus pellentesque
                                    </li>
                                    <li>Iaculis est rutrum vulputate nisi erat nullam sed</li>
                                    <li>
                                    Facilisi risus auctor ex lacus scelerisque mauris
                                    </li>
                                    <li>
                                    Ut donec natoque ac finibus senectus faucibus ante
                                    </li>
                                    <li>
                                    Turpis commodo fermentum aliquam facilisis rutrum
                                    </li>
                                    <li>
                                    Quam maximus cras augue suspendisse cubilia
                                    </li>
                                    <li>
                                    Velit himenaeos etiam eu est egestas dis nullam
                                    </li>
                                </ul>
                                </div>
                            </div>
                            <div className="col">
                                <div className="image-container">
                                <img
                                    src="/assets/images/dummy-img-600x400.jpg"
                                    alt="Portfolio Detail Img"
                                    className="img-fluid"
                                />
                                </div>
                            </div>
                            </div> */}
            
                            {/* <h3>Project Result</h3>
                            <div>
                            <p>
                                Proin parturient dignissim elementum magnis aptent fusce curae.
                                Accumsan vestibulum vel laoreet dui at tellus nisi dolor.
                                Parturient nunc montes, habitasse ligula habitant facilisi.
                                Luctus dis penatibus ad augue rutrum. Non gravida sociosqu
                                pellentesque cursus dictum.
                            </p>
                            <p>
                                Lorem ipsum odor amet, consectetuer adipiscing elit. Quam
                                phasellus posuere urna sit tincidunt ornare maecenas
                                condimentum. Euismod id nibh velit aenean platea.
                            </p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  
export default PortfolioDetailSection;  