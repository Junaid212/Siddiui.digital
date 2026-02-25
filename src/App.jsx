import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";
import PageTransition from "./Components/PageTransition"; // <-- import the transition component
import CustomCursor from "./Components/CustomCursor";
import PopupManager from "./Page/PopupManager";

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Handle GitHub Pages 404 redirect
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        if (redirect) {
            // Remove the query parameter from history
            window.history.replaceState(null, '', window.location.pathname);
            try {
                // Navigate to the redirect path
                navigate(redirect, { replace: true });
            } catch (e) {
                // Fallback to home if navigation fails
                navigate('/', { replace: true });
            }
        }
    }, [navigate]);

    return (
        <>
            <CustomCursor />
            <Navbar />
            <Sidebar />
            <ModalVideoProvider>
                <ScrollToTop />
                {/* Wrap only the dynamic routes with PageTransition */}
                <PageTransition>
                    <AppRouters />
                    <PopupManager/>
                </PageTransition>
            </ModalVideoProvider>
            <Footer />
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;