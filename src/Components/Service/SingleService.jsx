import React from "react";
import { servicedata } from "../../Data/Service";
import { Link, useNavigate } from "react-router-dom";
import EnrollBook from "../EnrollBook/enrollBook";
import img1 from "/assets/images/img/38.webp"
import img2 from "/assets/images/img/39.webp"
import img3 from "/assets/images/img/40.webp"

const SingleServiceSection = () => {
    const navigate = useNavigate();
    return (
        <section className="section">
            <div className="hero-container">
                <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                    <div className="col col-lg-8">
                        <div className="service-details">
                            <div className="image-container">
                                <img
                                src={img1}
                                alt="Service Overview"
                                className="post-detail-img"
                                />
                            </div>

                            <h3>Overview</h3>

                            <div>
                                <p>
                                    As a discipline, marketing is in the process of
transition from an art which is practised to a
profession with strong theoretical foundations.
In doing so it is following closely the precedents
set by professions such as medicine, architecture
and engineering, all of which have also been
practised for thousands of years and have built
up a wealth of descriptive information concerning the art which has both chronicled and
advanced its evolution. At some juncture, however, continued progress demands a transition
from description to analysis, such as that
initiated by Harvey’s discovery of the circulation of the blood. If marketing is to develop it,
too, must make the transition from art to applied
science and develop sound theoretical foundations, mastery of which should become an
essential qualification for practice.
                                </p>
                                {/* <p>
                                    Eu netus turpis himenaeos congue urna, volutpat laoreet
                                    dignissim. Natoque bibendum ante tempor sem vestibulum tortor
                                    urna potenti. Vulputate augue porta elementum eget; ut
                                    imperdiet. Velit himenaeos etiam eu est egestas dis nullam
                                    fringilla sit.
                                </p> */}
                            </div>

                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                                <div className="col">
                                    <div className="image-container">
                                        <img
                                        src={img2}
                                        alt="Teamwork"
                                        className="img-fluid"
                                        />
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="d-flex flex-column h-100 gap-4">
                                        <p>
                                        Adoption of this proposition is as threatening to many of today’s marketers as the
establishment of the British Medical Association
was to the surgeon-barber. But, today, you
would not dream of going to a barber for medical
advice.

                                        </p>

                                        <ul className="circle-notch-list">
                                        <li>Marketing as a managerial orientation</li>
                                        <li>Marketing myopia – a watershed </li>
                                        <li>Life cycles and evolution </li>
                                        <li>Marketing misunderstood</li>
                                        <li>The marketing function</li>
                                        <li>Relationship marketing 11</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-4 ">
                        <div >
                            <img src={img3} alt="Book Overview" className="img-fluid"/>
                        </div>
                        <div className="card other-services">
                            <div className="other-services-content">
                                <h3 className="accent-color-2">Book Details</h3>
                                <div className="underline-1"></div>
                                <ul className="service-list px-0">
                                    {/* {servicedata.slice(0,5).map((item) => (
                                        <li key={item.id}>
                                            <Link to={item.link} className="other-service-link">
                                                {item.title}
                                                <i className="fa-solid fa-arrow-right rotate45"></i>
                                            </Link>
                                        </li>
                                    ))} */}
                                    <li><b>Title:</b> Inbound Marketing: Attract, Engage, and Delight Customers Online</li>
                                    <li><b>Author:</b> Michael J.Baker</li>
                                    <li><b>Category:</b> Marketing</li>
                                    <li><b>Published:</b> 2003</li>
                                    <li><b>Pages:</b> 875</li>
                                </ul>
                            </div>
                        </div>
                        <div className="cta-banner " style={{marginTop:'2em'}}>
            <div className="cta-content">
              <div className="cta-container">
                <h2 className="secondary-accent no-dark">
                  Continue to Read
                </h2>
                <style>{`
                .cta-content{
                    background-color: var(--accent-color-4); */
                    color: var(--secondary);
                    padding: 2em; 
                    border-radius: var(--global-border-radius);
                    width: 80%; 
                    margin-left: auto;
                    margin-right: auto;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                }
                    .img-fluid{
                        position: relative;
                        border-radius: var(--global-border-radius);
                        margin-bottom: 2em;
                        }

                        @media screen and(max-width:768px){
                            .cta-content {
                            width:95%;
                }
                        }
                `}</style>

                {/* <p>
                  Reserve your appointment with an experienced marketing and
                  business professional. Discuss challenges, growth strategies,
                  and solutions with practical industry expertise at no cost.
                </p> */}

                <div>
                  <button
                    onClick={() => navigate('/buy-book/1')}
                    className="btn btn-secondary-accent"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
                    </div>
                </div>
                {/* <button className="btn btn-secondary-accent mt-4">Enroll To Read</button> */}
            </div>
        </section>
    );
}

export default SingleServiceSection;