import React from "react";

const BlogCard = ({image, title, content, link, date, comment}) => {
    return(
        <>
            <div className="card card-blog">
                <img src={image} alt="Blog Image" className="img-fluid" />
                {/* <div className="card-body">
                    <h3 className="blog-title">{title}</h3>
                    <div className="blog-date">
                        <span className="date">{date}</span>
                    </div>
                    <p>{content}</p>
                </div> */}
                {/* <div className="card_footer"> */}
                    {/* <a href={link} className="blog-link">Read More <i className="fa-solid fa-arrow-right rotate45"></i></a> */}
                    {/* <div className="blog-comment"> */}
                        {/* <i className="fa-solid align-content-center fa-message secondary-accent"></i> */}
                        {/* <span className="comment">{comment}</span> */}
                    {/* </div> */}
                {/* </div> */}
            </div>
            
        </>
    );
}

export default BlogCard;