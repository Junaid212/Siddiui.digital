import React from "react";
import useAnimateOnScroll from "../Hooks/useAnimateOnScroll";
import { Calendar, User } from "lucide-react";
import img1 from "/assets/images/img/6.webp"

const Awards = () => {
    useAnimateOnScroll();
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="d-flex flex-column flex-md-row h-100 gspace-3">
                            
                            <div className="about-details">
                                <div className="sub-heading">
                                    <i className="fa-solid fa-circle-notch"></i>
                                    <h6 className="font-family-1 accent-color">Awards </h6>
                                </div>
                                <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp" id="text">Best Teacher <br/><span style={{color:'#DC0909'}}>2019-2020</span></h2>
                                <div className="meta-info">
  <div className="meta-item">
    <Calendar className="meta-icon" />
    <span className="meta-text">January 1, 2022</span>
  </div>

  <div className="meta-item">
    <User className="meta-icon" />
    <span className="meta-text">Dr. M. Q. Siddiqui</span>
  </div>
  <style>{`
  .meta-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;          /* gap-6 */
  color: #475569;      /* text-slate-600 */
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;          /* gap-2 */
}

.meta-icon {
  width: 1rem;          /* w-4 */
  height: 1rem;         /* h-4 */
}

.meta-text {
  font-size: 0.875rem;  /* text-sm */
}
#text{
    font-size: 5.25rem;
}
  `}</style>
</div>

                                <p>r. Muhammad Q. Siddiqui was recognised as the Best Teacher in the College of Business at Ajman University — one of the UAE's leading institutions and ranked among the top 2.8% of universities worldwide. This award reflects not only teaching excellence but a sustained commitment to student development, intellectual depth, and the transformation of how marketing and business are understood by learners.</p>
                                <div>
                                    <a href="#" className="btn btn-accent">
Ranked among the top 2.8% of universities worldwide</a>
                                </div>
                            </div>
                            <div className="about-image-wrapper">
                                <div className="image-container">
                                    <img src={img1} alt="About Image" className="img-fluid animate-box animated animate__animated" data-animate="animate__fadeInRight" />
                                </div>
                                {/* <div className="card about-traffic-card animate-box animated animate__animated" data-animate="animate__zoomIn">
                                    <div className="d-flex flex-column gspace-2 align-self-center text-center">
                                        <i className="fa-solid fa-2x fa-chart-simple"></i>
                                        <p className="secondary-accent mb-0">Among Top</p>
                                        <h2 className="secondary-accent">2.8%</h2>
                                    </div>
                                    <div className="d-flex justify-content-center accent-color">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                        <p className="description">Universities Worldwide</p>
                                    </div>
                                </div> */}
                            </div>
                            
                        </div>
                        {/* <div className="about-spacer"></div>
                        <div className="row row-cols-md-3 row-cols-1 grid-spacer-2">
                            <div className="col">
                                <div className="card card-about animate-box animated-fast animate__animated" data-animate="animate__fadeInUp">
                                    <div className="d-flex flex-column flex-lg-row gspace-2">
                                        <div className="icon-circle align-self-lg-center align-self-start">
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                        <div className="d-flex flex-column gspace-2">
                                            <h3 className="secondary-accent">Our Philosophy</h3>
                                            <p className="secondary-accent">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated animate__animated" data-animate="animate__fadeInUp">
                                    <h3 className="secondary-accent">Our Vision</h3>
                                    <p className="secondary-accent">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                    </p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card card-about animate-box animated-slow animate__animated" data-animate="animate__fadeInUp">
                                    <h3 className="secondary-accent">Our Mission</h3>
                                    <p className="secondary-accent">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Awards;