
import BannerInnerSection from "../../Components/Banner/inner";
import HeadTitle from "../../Components/Head/HeadTitle";
import Ebook from "../../Components/Ebook/ebook";

const EbookPage = () => {
    return(
        <>
            <HeadTitle title="E-Books -  Digital Marketing Agency"/>
            <BannerInnerSection title="E-Books" currentPage="E-Books" />
            <Ebook />
        </>
    );

}

export default EbookPage;