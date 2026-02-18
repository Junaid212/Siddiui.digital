import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { partnershipdata } from "../../Data/Partner";

const PartnersipSection = () => {
    return(
        <>
            <div className="section compact-top-zero-bottom">
                <div className="hero-container">
                    <div className="overflow-hidden">
                        <Swiper
                        autoplay={{
                            delay: 2000
                        }}
                        slidesPerView={5}
                        spaceBetween={20}
                        loop={true}
                        hashNavigation={true}
                        grabCursor={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            992: {
                                slidesPerView: 5,
                            }
                        }}
                        className="swiperPartner">
                            {partnershipdata.map((item) => (
                                <SwiperSlide key={item.id}>
                                    <img src={item.logo} alt="Partner" className="img-fluid partner-img" />
                                </SwiperSlide> 
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PartnersipSection;