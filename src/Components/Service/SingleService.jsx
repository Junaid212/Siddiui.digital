import React from "react";
import { servicedata } from "../../Data/Service";
import { Link } from "react-router-dom";
import EnrollBook from "../EnrollBook/enrollBook";

const SingleServiceSection = () => {
    return (
        <section className="section">
            <div className="hero-container">
                <div className="row row-cols-md-2 row-cols-1 grid-spacer-2">
                    <div className="col col-lg-8">
                        <div className="service-details">
                            <div className="image-container">
                                <img
                                src="/assets/images/dummy-img-600x400.jpg"
                                alt="Service Overview"
                                className="post-detail-img"
                                />
                            </div>

                            <h3>Overview</h3>

                            <div>
                                <p>
                                    Elit class porta interdum commodo nisi sociosqu maecenas curae.
                                    Ad in nullam libero commodo magnis tristique, accumsan etiam
                                    viverra. Massa arcu sociosqu nascetur magna parturient morbi
                                    ultrices senectus. Consectetur venenatis penatibus primis
                                    tristique ac ultrices cras suscipit! Porta auctor laoreet dui
                                    nisl tempor.
                                </p>
                                <p>
                                    Eu netus turpis himenaeos congue urna, volutpat laoreet
                                    dignissim. Natoque bibendum ante tempor sem vestibulum tortor
                                    urna potenti. Vulputate augue porta elementum eget; ut
                                    imperdiet. Velit himenaeos etiam eu est egestas dis nullam
                                    fringilla sit.
                                </p>
                            </div>

                            <div className="row row-cols-lg-2 row-cols-1 grid-spacer-2">
                                <div className="col">
                                    <div className="image-container">
                                        <img
                                        src="/assets/images/dummy-img-600x400.jpg"
                                        alt="Teamwork"
                                        className="img-fluid"
                                        />
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="d-flex flex-column h-100 gap-4">
                                        <p>
                                        Proin parturient dignissim elementum magnis aptent fusce
                                        curae. Accumsan vestibulum vel laoreet dui at tellus nisi
                                        dolor. Parturient nunc montes, habitasse ligula habitant
                                        facilisi.
                                        </p>

                                        <ul className="circle-notch-list">
                                        <li>Consequat orci maecenas purus cursus pellente</li>
                                        <li>Iaculis est rutrum vulputate nisi erat nullam sed</li>
                                        <li>Facilisi risus auctor ex lacus scelerisque mauris</li>
                                        <li>Ut donec natoque ac finibus senectus faucibus ante</li>
                                        <li>Turpis commodo fermentum aliquam facilisis rutrum</li>
                                        <li>Quam maximus cras augue suspendisse cubilia sed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-4 ">
                        <div className="card other-services">
                            <div className="other-services-content">
                                <h3 className="accent-color-2">Other Books</h3>
                                <div className="underline-1"></div>
                                <ul className="service-list px-0">
                                    {servicedata.slice(0,5).map((item) => (
                                        <li key={item.id}>
                                            <Link to={item.link} className="other-service-link">
                                                {item.title}
                                                <i className="fa-solid fa-arrow-right rotate45"></i>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="cta-banner " style={{marginTop:'50px'}}>
            <div className="cta-content">
              <div className="cta-container">
                <h2 className="secondary-accent">
                  This is just a preview. Enroll now to access the complete book
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
                `}</style>

                {/* <p>
                  Reserve your appointment with an experienced marketing and
                  business professional. Discuss challenges, growth strategies,
                  and solutions with practical industry expertise at no cost.
                </p> */}

                <div>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
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