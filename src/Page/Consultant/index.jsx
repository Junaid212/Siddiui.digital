
import BannerInnerSection from "../../Components/Banner/inner";
import BookConsultation from "../../Components/BookConsultation";
import HeadTitle from "../../Components/Head/HeadTitle";
import { seoProps } from "../../Data/pageSeo";

const ConsultantPage= () => {
    return(
        <>
            <HeadTitle {...seoProps("advisory")} />
            {/* <BannerInnerSection title="Free Consultation" currentPage="Consultant" /> */}
            <BookConsultation />
        </>
    );

}

export default ConsultantPage;