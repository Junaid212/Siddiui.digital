import { Routes, Route, Outlet, useLocation, BrowserRouter } from "react-router-dom";
import HomePage from "./Page/Home";
import AboutPage from "./Page/About";
import ServicePage from "./Page/Service";
import PortfolioPage from "./Page/Portfolio";
import PricingPage from "./Page/Pricing";
import TeamPage from "./Page/Team";
import TestimonialPage from "./Page/Testimonial";
import FaqPage from "./Page/Faq";
import BlogPage from "./Page/Blog";
import ContactPage from "./Page/Contact";
import SingleServicePage from "./Page/ServiceDetail";
import SinglePortfolioPage from "./Page/PortfolioDetail";
import SinglePostPage from "./Page/SinglePost";
import PageNotFound from "./Page/NotFoundPage/NotFound";
import EbookPage from "./Page/Ebook";
import AppointmentDrawer from "./Components/AppointmentDrawer/appointmentDrawer";
import BookPage from "./Page/Book";
import ConsultantPage from "./Page/Consultant";
import Questionnaire from "./Page/Questionnaire";
import PopupPage from "./Page/PopupManager";
import BlogSection from "./Page/Blogs";
// import BookAppointment from "./Page/BookAppointment";

function AppRouters(){
    return(
    
        <Routes>
            
            <Route path="/Siddiui.digital" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="book1" element={<SingleServicePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio-detail" element={<SinglePortfolioPage/>}/>
            <Route path="pricing" element={<PricingPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="testimonial" element={<TestimonialPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="blog" element={<BlogPage/>} />
            <Route path="single-post" element={<SinglePostPage />} />
            <Route path="contact" element={<ContactPage />}/>
            <Route path="404-page" element={<PageNotFound />}/>
            <Route path="*" element={<PageNotFound />}/>


            <Route path="ebooks" element={<EbookPage />}/>
            <Route path="e_books" element={<BookPage />}/>
            <Route path="consultation" element={<ConsultantPage />}/>
            <Route path="blog-page" element={<BlogSection />}/>
            

        </Routes>
    );
}


export default AppRouters;