import React from "react";
import { teamdata } from "../../Data/Team";
import TeamCard from "../Card/TeamCard";

const TeamSectionExtend = () => {
    return(
        <>
            <div className="section spacious-top">
                <div className="hero-container">
                    <div className="d-flex flex-column gspace-2">
                        <div className="team-heading-container">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color-1">Our Team</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Meet the Expert Behind Our Success</h2>
                        </div>
                        <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1 grid-spacer-2">
                            {teamdata.map((item) => (
                                <TeamCard key={item.id} {...item}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeamSectionExtend;