import React from "react";
import { blogdata } from "../../Data/Blog";
import BlogCard from "../Card/BlogCard";

const BlogSection = () =>{
    return(
        <>
            <div className="section">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="blog-heading-container">
                            <div className="sub-heading justify-content-center">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color">Certificates</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Industry-Recognized Professional Certifications</h2>
                        </div>
                        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 grid-spacer-2">
                            {blogdata.slice(0, 3).map((item) => (
                                <div className="col" key={item.id}>
                                    <BlogCard
                                        image={item.image}
                                        // title={item.title}
                                        // content={item.content}
                                        // link={item.link}
                                        // date={item.date}
                                        // comment={item.comment}
                                    />
                                </div>
                            ))}
                        </div>
                         <div className="cta-container" style={{marginTop:'30px'}}>
                                    <a href="#" className="btn btn-secondary-accent ">Explore Certificates</a>
                                </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogSection;