import React from "react";

const TeamCard = ({image, name, designation, socials}) => {
    return(
        <>
            <div className="col">
                <div className="card card-team">
                    {/* <div className="social-team-container">
                        <a href="#" className="social-team-icon">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="social-team-icon">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="#" className="social-team-icon">
                            <i className="fa-brands fa-behance"></i>
                        </a>
                    </div> */}
                    <img src={image} alt="Team" className="img-fluid" />
                    {/* <div className="team-details-wrapper">
                        <div className="team-details">
                            <h3 className="secondary-accent">{name}</h3>
                            <div className="underline-secondary-accent"></div>
                            <h5 className="secondary-accent">{designation}</h5>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default TeamCard;