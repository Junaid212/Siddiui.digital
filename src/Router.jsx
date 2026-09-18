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
import BuyBookPage from "./Page/BuyBook";
import ConsultantPage from "./Page/Consultant";
import Questionnaire from "./Page/Questionnaire";
import PopupPage from "./Page/PopupManager";
import BlogSection from "./Page/Blogs";
import BlogByIdPage from "./Page/BlogById";
import Courses from "./Page/Courses";
import FrameworksPage from "./Page/Frameworks";
import FrameworkDetailPage from "./Page/FrameworkDetail";
import OrderSuccessPage from "./Page/OrderSuccess";
import OrderCancelPage from "./Page/OrderCancel";
// import BookAppointment from "./Page/BookAppointment";

function AppRouters() {
    return (

        <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="book1" element={<SingleServicePage />} />
            <Route path="course" element={<PortfolioPage />} />
            <Route path="portfolio-detail" element={<SinglePortfolioPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="testimonial" element={<TestimonialPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:topic" element={<SinglePostPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="404-page" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />


            <Route path="ebooks" element={<EbookPage />} />
            <Route path="publications" element={<BookPage />} />

            {/* Primary publication route — slug-based */}
            <Route path="publications/:slug" element={<BuyBookPage />} />

            {/* Legacy ID-based route — kept for backward compatibility with existing links */}
            <Route path="buy-book/:id" element={<BuyBookPage />} />

            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="order-cancel" element={<OrderCancelPage />} />
            <Route path="consultation" element={<ConsultantPage />} />
            <Route path="blog-page" element={<BlogSection />} />
            {/* ID-based blog route for admin share links */}
            <Route path="blogs/:id" element={<BlogByIdPage />} />
            <Route path="courses" element={<Courses />} />
            <Route path="frameworks" element={<FrameworksPage />} />
            <Route path="frameworks/:slug" element={<FrameworkDetailPage />} />
            <Route path="framework" element={<FrameworksPage />} />
            <Route path="framework/:slug" element={<FrameworkDetailPage />} />
            <Route path="publication" element={<BookPage />} />

        </Routes>
    );
}


export default AppRouters;
