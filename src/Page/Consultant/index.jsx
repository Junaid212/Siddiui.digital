
import BannerInnerSection from "../../Components/Banner/inner";
import BookConsultation from "../../Components/BookConsultation";
import HeadTitle from "../../Components/Head/HeadTitle";

const ConsultantPage= () => {
    return(
        <>
            <HeadTitle title="Consultant "/>
            {/* <BannerInnerSection title="Free Consultation" currentPage="Consultant" /> */}
            <BookConsultation />
        </>
    );

}

export default ConsultantPage;