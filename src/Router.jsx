import { Routes, Route, Outlet, useLocation, BrowserRouter, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
import ThankYouPage from "./Page/ThankYou";
import OrderCancelPage from "./Page/OrderCancel";
import CartCheckoutPage from "./Page/CartCheckout";
import MyOrdersPage from "./Page/MyOrders";
import AskSidPage from "./Page/AskSid";
import ReaderPage from "./Page/Reader";
import PrivacyPolicyPage from "./Page/Legal/PrivacyPolicy";
import RefundPolicyPage from "./Page/Legal/RefundPolicy";
import TermsOfUsePage from "./Page/Legal/TermsOfUse";
import LoginPage from "./Page/Login";
import ResetPasswordPage from "./Page/ResetPassword";
import { canonicalFor } from "./Data/pageSeo";
// import BookAppointment from "./Page/BookAppointment";

function RouteCanonical() {
    const location = useLocation();

    useEffect(() => {
        const canonicalUrl = canonicalFor(location.pathname);

        let canonical = document.querySelector(
            'link[rel="canonical"]'
        );

        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }

        canonical.setAttribute("href", canonicalUrl);

        let ogUrl = document.querySelector(
            'meta[property="og:url"]'
        );

        if (!ogUrl) {
            ogUrl = document.createElement("meta");
            ogUrl.setAttribute("property", "og:url");
            document.head.appendChild(ogUrl);
        }

        ogUrl.setAttribute("content", canonicalUrl);
    }, [location.pathname]);

    return null;
}

function AppRouters() {
    return (
        <>
        <RouteCanonical />
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
            {/* /blog is a duplicate of the canonical /blog-page — redirect, do not index twice */}
            <Route path="blog" element={<Navigate to="/blog-page" replace />} />
            <Route path="blog/:slug" element={<BlogByIdPage />} />
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
            <Route path="thank-you" element={<ThankYouPage />} />
            <Route path="order-cancel" element={<OrderCancelPage />} />
            <Route path="cart/checkout" element={<CartCheckoutPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="my-library" element={<MyOrdersPage />} />
            <Route path="consultation" element={<ConsultantPage />} />
            <Route path="blog-page" element={<BlogSection />} />
            <Route path="blog-page/:slug" element={<BlogByIdPage />} />
            <Route path="blogs/:slug" element={<BlogByIdPage />} />
            {/* ID-based blog route for admin share links */}
            {/* <Route path="blogs/:id" element={<BlogByIdPage />} /> */}
            <Route path="courses" element={<Courses />} />
            <Route path="frameworks" element={<FrameworksPage />} />
            <Route path="frameworks/:slug" element={<FrameworkDetailPage />} />
            {/* /framework is a duplicate of the canonical /frameworks */}
            <Route path="framework" element={<Navigate to="/frameworks" replace />} />
            <Route path="framework/:slug" element={<FrameworkDetailPage />} />
            <Route path="publication" element={<BookPage />} />
            {/* Online Reading edition: signed-in readers only (noindex; not in the sitemap) */}
            <Route path="read" element={<ReaderPage />} />
            <Route path="read/:bookSlug" element={<ReaderPage />} />
            <Route path="read/:bookSlug/:chapterSlug" element={<ReaderPage />} />
            <Route path="ask-sid" element={<AskSidPage />} />
            <Route path="ask-sid/*" element={<AskSidPage />} />

            {/* Legal & Auth Routes */}
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="refund-policy" element={<RefundPolicyPage />} />
            <Route path="terms-of-use" element={<TermsOfUsePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
        </>
    );
}


export default AppRouters;
