import React from "react";
import { teamdata } from "../../Data/Team";
import TeamCard from "../Card/TeamCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TeamSection = () => {
    return(
        <>
            <div className="section spacious-top">
                <div className="hero-container">
                    <div className="d-flex flex-column ">
                        <div className="team-heading-container">
                            <div className="sub-heading">
                                <i className="fa-solid fa-circle-notch"></i>
                                <h6 className="font-family-1 accent-color-1">Certifications</h6>
                            </div>
                            <h2 className="animate-box animated animate__animated" data-animate="animate__fadeInUp">Industry-Recognized Certifications</h2>
                        </div>
                        <Swiper className="row row-cols-lg-4 row-cols-md-2 row-cols-1 "
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={12}
  slidesPerView={1}                                              
  autoplay={{ delay: 20000, disableOnInteraction: false }}
//   pagination={{ clickable: true, color: "#f10808" }}
//   navigation
  breakpoints={{
    768: { slidesPerView: 2 },
    992: { slidesPerView: 4 },
  }}
>
  {teamdata.slice(0, 16).map((item) => (
    <SwiperSlide key={item.id}>
      <TeamCard {...item} />
    </SwiperSlide>
  ))}
</Swiper>

                    </div>
                </div>
            </div>
        </>
    );
}

export default TeamSection;